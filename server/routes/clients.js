const express = require('express');
const router = express.Router();
const { query } = require('../database/connection');

// Get all clients
router.get('/', async (req, res) => {
  try {
    const { search, limit = 50, offset = 0 } = req.query;
    
    let queryText = `
      SELECT c.*, 
             COUNT(ec.id) as email_count,
             MAX(ec.sent_at) as last_email_sent
      FROM clients c
      LEFT JOIN email_communications ec ON c.id = ec.client_id
      WHERE 1=1
    `;
    const queryParams = [];
    
    if (search) {
      queryText += ` AND (c.name ILIKE $${queryParams.length + 1} OR c.email ILIKE $${queryParams.length + 1} OR c.company ILIKE $${queryParams.length + 1})`;
      queryParams.push(`%${search}%`);
    }
    
    queryText += ` 
      GROUP BY c.id 
      ORDER BY c.updated_at DESC 
      LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}
    `;
    queryParams.push(limit, offset);
    
    const result = await query(queryText, queryParams);
    
    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch clients' 
    });
  }
});

// Get client by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const clientResult = await query(`
      SELECT c.*, 
             COUNT(ec.id) as email_count,
             MAX(ec.sent_at) as last_email_sent
      FROM clients c
      LEFT JOIN email_communications ec ON c.id = ec.client_id
      WHERE c.id = $1
      GROUP BY c.id
    `, [id]);
    
    if (clientResult.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Client not found' 
      });
    }
    
    // Get recent emails for this client
    const emailsResult = await query(`
      SELECT ec.*, et.name as template_name
      FROM email_communications ec
      LEFT JOIN email_templates et ON ec.template_id = et.id
      WHERE ec.client_id = $1
      ORDER BY ec.created_at DESC
      LIMIT 10
    `, [id]);
    
    res.json({
      success: true,
      data: {
        ...clientResult.rows[0],
        recent_emails: emailsResult.rows
      }
    });
  } catch (error) {
    console.error('Error fetching client:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch client' 
    });
  }
});

// Create new client
router.post('/', async (req, res) => {
  try {
    const { name, email, company, phone, notes } = req.body;
    
    // Validation
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: name, email'
      });
    }
    
    // Check if email already exists
    const existingClient = await query('SELECT id FROM clients WHERE email = $1', [email]);
    if (existingClient.rows.length > 0) {
      return res.status(409).json({
        success: false,
        error: 'Client with this email already exists'
      });
    }
    
    const result = await query(`
      INSERT INTO clients (name, email, company, phone, notes, created_by)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [name, email, company, phone, notes, 1]); // TODO: Use actual user ID from auth
    
    res.status(201).json({
      success: true,
      data: result.rows[0],
      message: 'Client created successfully'
    });
  } catch (error) {
    console.error('Error creating client:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create client' 
    });
  }
});

// Update client
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, company, phone, notes } = req.body;
    
    // Check if email is being changed and if it conflicts with another client
    if (email) {
      const existingClient = await query('SELECT id FROM clients WHERE email = $1 AND id != $2', [email, id]);
      if (existingClient.rows.length > 0) {
        return res.status(409).json({
          success: false,
          error: 'Another client with this email already exists'
        });
      }
    }
    
    const result = await query(`
      UPDATE clients 
      SET name = COALESCE($1, name),
          email = COALESCE($2, email),
          company = COALESCE($3, company),
          phone = COALESCE($4, phone),
          notes = COALESCE($5, notes),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $6
      RETURNING *
    `, [name, email, company, phone, notes, id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Client not found' 
      });
    }
    
    res.json({
      success: true,
      data: result.rows[0],
      message: 'Client updated successfully'
    });
  } catch (error) {
    console.error('Error updating client:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update client' 
    });
  }
});

// Delete client
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if client has associated emails
    const emailCheck = await query('SELECT COUNT(*) as count FROM email_communications WHERE client_id = $1', [id]);
    const emailCount = parseInt(emailCheck.rows[0].count);
    
    if (emailCount > 0) {
      return res.status(409).json({
        success: false,
        error: `Cannot delete client with ${emailCount} associated emails. Please delete emails first or archive the client.`
      });
    }
    
    const result = await query('DELETE FROM clients WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Client not found' 
      });
    }
    
    res.json({
      success: true,
      message: 'Client deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting client:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete client' 
    });
  }
});

// Get client communication history
router.get('/:id/emails', async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 20, offset = 0 } = req.query;
    
    const result = await query(`
      SELECT ec.*, et.name as template_name, u.first_name, u.last_name
      FROM email_communications ec
      LEFT JOIN email_templates et ON ec.template_id = et.id
      LEFT JOIN users u ON ec.sender_id = u.id
      WHERE ec.client_id = $1
      ORDER BY ec.created_at DESC
      LIMIT $2 OFFSET $3
    `, [id, limit, offset]);
    
    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    console.error('Error fetching client emails:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch client emails' 
    });
  }
});

module.exports = router;