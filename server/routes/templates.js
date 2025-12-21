const express = require('express');
const router = express.Router();
const { query } = require('../database/connection');

// Get all email templates
router.get('/', async (req, res) => {
  try {
    const { category, status } = req.query;
    
    let queryText = `
      SELECT t.*, tc.color as category_color, u.first_name, u.last_name
      FROM email_templates t
      LEFT JOIN template_categories tc ON t.category = tc.name
      LEFT JOIN users u ON t.created_by = u.id
      WHERE 1=1
    `;
    const queryParams = [];
    
    if (category && category !== 'all') {
      queryText += ` AND t.category = $${queryParams.length + 1}`;
      queryParams.push(category);
    }
    
    if (status && status !== 'all') {
      queryText += ` AND t.status = $${queryParams.length + 1}`;
      queryParams.push(status);
    }
    
    queryText += ` ORDER BY t.updated_at DESC`;
    
    const result = await query(queryText, queryParams);
    
    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch templates' 
    });
  }
});

// Get template by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await query(`
      SELECT t.*, tc.color as category_color, u.first_name, u.last_name
      FROM email_templates t
      LEFT JOIN template_categories tc ON t.category = tc.name
      LEFT JOIN users u ON t.created_by = u.id
      WHERE t.id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Template not found' 
      });
    }
    
    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching template:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch template' 
    });
  }
});

// Create new template
router.post('/', async (req, res) => {
  try {
    const {
      name,
      category,
      description,
      subject_template,
      body_template,
      variables,
      status = 'draft'
    } = req.body;
    
    // Validation
    if (!name || !category || !subject_template || !body_template) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: name, category, subject_template, body_template'
      });
    }
    
    const result = await query(`
      INSERT INTO email_templates (name, category, description, subject_template, body_template, variables, status, created_by)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [name, category, description, subject_template, body_template, JSON.stringify(variables || []), status, 1]); // TODO: Use actual user ID from auth
    
    res.status(201).json({
      success: true,
      data: result.rows[0],
      message: 'Template created successfully'
    });
  } catch (error) {
    console.error('Error creating template:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create template' 
    });
  }
});

// Update template
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      category,
      description,
      subject_template,
      body_template,
      variables,
      status
    } = req.body;
    
    const result = await query(`
      UPDATE email_templates 
      SET name = COALESCE($1, name),
          category = COALESCE($2, category),
          description = COALESCE($3, description),
          subject_template = COALESCE($4, subject_template),
          body_template = COALESCE($5, body_template),
          variables = COALESCE($6, variables),
          status = COALESCE($7, status),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $8
      RETURNING *
    `, [name, category, description, subject_template, body_template, 
        variables ? JSON.stringify(variables) : null, status, id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Template not found' 
      });
    }
    
    res.json({
      success: true,
      data: result.rows[0],
      message: 'Template updated successfully'
    });
  } catch (error) {
    console.error('Error updating template:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update template' 
    });
  }
});

// Delete template
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await query('DELETE FROM email_templates WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Template not found' 
      });
    }
    
    res.json({
      success: true,
      message: 'Template deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting template:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete template' 
    });
  }
});

// Get template categories
router.get('/categories/list', async (req, res) => {
  try {
    const result = await query('SELECT * FROM template_categories ORDER BY name');
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch categories' 
    });
  }
});

module.exports = router;