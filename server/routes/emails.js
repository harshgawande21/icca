const express = require('express');
const { Resend } = require('resend');
const router = express.Router();
const { query } = require('../database/connection');

// Initialize Resend (free tier: 3000 emails/month)
const resend = new Resend(process.env.RESEND_API_KEY || 're_demo_key');

// Get all email communications
router.get('/', async (req, res) => {
  try {
    const { status, client_id, limit = 50, offset = 0 } = req.query;
    
    let queryText = `
      SELECT 
        ec.*,
        c.name as client_name,
        c.company as client_company,
        et.name as template_name,
        u.first_name as sender_first_name,
        u.last_name as sender_last_name
      FROM email_communications ec
      LEFT JOIN clients c ON ec.client_id = c.id
      LEFT JOIN email_templates et ON ec.template_id = et.id
      LEFT JOIN users u ON ec.sender_id = u.id
      WHERE 1=1
    `;
    const queryParams = [];
    
    if (status && status !== 'all') {
      queryText += ` AND ec.status = $${queryParams.length + 1}`;
      queryParams.push(status);
    }
    
    if (client_id) {
      queryText += ` AND ec.client_id = $${queryParams.length + 1}`;
      queryParams.push(client_id);
    }
    
    queryText += ` ORDER BY ec.created_at DESC LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
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
    console.error('Error fetching emails:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch emails' 
    });
  }
});

// Get email by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await query(`
      SELECT 
        ec.*,
        c.name as client_name,
        c.company as client_company,
        c.email as client_email,
        et.name as template_name,
        u.first_name as sender_first_name,
        u.last_name as sender_last_name
      FROM email_communications ec
      LEFT JOIN clients c ON ec.client_id = c.id
      LEFT JOIN email_templates et ON ec.template_id = et.id
      LEFT JOIN users u ON ec.sender_id = u.id
      WHERE ec.id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Email not found' 
      });
    }
    
    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching email:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch email' 
    });
  }
});

// Create new email communication
router.post('/', async (req, res) => {
  try {
    const {
      client_id,
      template_id,
      recipient_email,
      subject,
      body,
      tone,
      notes,
      metadata,
      scheduled_at
    } = req.body;
    
    // Validation
    if (!recipient_email || !subject || !body) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: recipient_email, subject, body'
      });
    }
    
    const result = await query(`
      INSERT INTO email_communications 
      (client_id, template_id, sender_id, recipient_email, subject, body, tone, notes, metadata, scheduled_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `, [client_id, template_id, 1, recipient_email, subject, body, tone, notes, 
        metadata ? JSON.stringify(metadata) : null, scheduled_at]); // TODO: Use actual user ID from auth
    
    res.status(201).json({
      success: true,
      data: result.rows[0],
      message: 'Email created successfully'
    });
  } catch (error) {
    console.error('Error creating email:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create email' 
    });
  }
});

// Update email communication
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      subject,
      body,
      status,
      tone,
      notes,
      metadata,
      sent_at,
      scheduled_at
    } = req.body;
    
    const result = await query(`
      UPDATE email_communications 
      SET subject = COALESCE($1, subject),
          body = COALESCE($2, body),
          status = COALESCE($3, status),
          tone = COALESCE($4, tone),
          notes = COALESCE($5, notes),
          metadata = COALESCE($6, metadata),
          sent_at = COALESCE($7, sent_at),
          scheduled_at = COALESCE($8, scheduled_at),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $9
      RETURNING *
    `, [subject, body, status, tone, notes, 
        metadata ? JSON.stringify(metadata) : null, sent_at, scheduled_at, id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Email not found' 
      });
    }
    
    res.json({
      success: true,
      data: result.rows[0],
      message: 'Email updated successfully'
    });
  } catch (error) {
    console.error('Error updating email:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update email' 
    });
  }
});

// Send email directly (new endpoint for direct sending)
router.post('/send-direct', async (req, res) => {
  try {
    const { to, subject, body, from_name = 'ICCA Assistant' } = req.body;
    
    // Validation
    if (!to || !subject || !body) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: to, subject, body'
      });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email address format'
      });
    }
    
    try {
      // Send email using Resend
      const emailData = await resend.emails.send({
        from: `${from_name} <onboarding@resend.dev>`, // Resend's verified domain
        to: [to],
        subject: subject,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="color: #1e293b; margin: 0;">📧 Message from ICCA</h2>
              <p style="color: #64748b; margin: 5px 0 0 0; font-size: 14px;">Intelligent Client Communication Assistant</p>
            </div>
            <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
              ${body.replace(/\n/g, '<br>')}
            </div>
            <div style="margin-top: 20px; padding: 15px; background: #f1f5f9; border-radius: 8px; font-size: 12px; color: #64748b;">
              <p style="margin: 0;">This email was sent via ICCA (Intelligent Client Communication Assistant)</p>
            </div>
          </div>
        `,
        text: body
      });
      
      // Save to database
      const dbResult = await query(`
        INSERT INTO email_communications 
        (sender_id, recipient_email, subject, body, status, sent_at, metadata)
        VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, $6)
        RETURNING *
      `, [
        1, // Default sender ID (since no auth)
        to,
        subject,
        body,
        'sent',
        JSON.stringify({ 
          resend_id: emailData.data?.id,
          sent_via: 'resend',
          from_name: from_name
        })
      ]);
      
      res.json({
        success: true,
        message: 'Email sent successfully!',
        data: {
          email_id: dbResult.rows[0].id,
          resend_id: emailData.data?.id,
          recipient: to,
          subject: subject
        }
      });
      
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      
      // Handle specific Resend errors
      if (emailError.message?.includes('API key')) {
        return res.status(500).json({
          success: false,
          error: 'Email service not configured. Please contact administrator.'
        });
      }
      
      return res.status(500).json({
        success: false,
        error: 'Failed to send email: ' + (emailError.message || 'Unknown error')
      });
    }
    
  } catch (error) {
    console.error('Error in send-direct:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to process email sending request' 
    });
  }
});

// Send email (mark as sent)
router.post('/:id/send', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await query(`
      UPDATE email_communications 
      SET status = 'sent',
          sent_at = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND status IN ('draft', 'pending')
      RETURNING *
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Email not found or already sent' 
      });
    }
    
    // TODO: Integrate with actual email service (SendGrid, AWS SES, etc.)
    
    res.json({
      success: true,
      data: result.rows[0],
      message: 'Email sent successfully'
    });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to send email' 
    });
  }
});

// Delete email communication
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await query('DELETE FROM email_communications WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Email not found' 
      });
    }
    
    res.json({
      success: true,
      message: 'Email deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting email:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete email' 
    });
  }
});

// Get email analytics
router.get('/:id/analytics', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await query(`
      SELECT * FROM email_analytics 
      WHERE communication_id = $1 
      ORDER BY created_at DESC
    `, [id]);
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching email analytics:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch email analytics' 
    });
  }
});

// Smart suggestions endpoint
router.post('/analyze', async (req, res) => {
  try {
    const { subject, body, recipient_email } = req.body;
    
    // Simple AI-like analysis (can be enhanced with actual AI/ML)
    const content = (subject + ' ' + body).toLowerCase();
    const suggestions = {
      tone: 'professional',
      missingDetails: [],
      recommendedTemplate: null,
      subjectSuggestion: ''
    };
    
    // Tone detection
    if (content.includes('urgent') || content.includes('asap') || content.includes('immediately')) {
      suggestions.tone = 'urgent';
    } else if (content.includes('please') || content.includes('kindly') || content.includes('appreciate')) {
      suggestions.tone = 'polite';
    }
    
    // Missing details detection
    if (!content.includes('$') && !content.includes('price') && !content.includes('cost')) {
      suggestions.missingDetails.push('pricing information');
    }
    if (!content.includes('deadline') && !content.includes('date')) {
      suggestions.missingDetails.push('timeline/date');
    }
    if (!content.includes('sla') && !content.includes('service level')) {
      suggestions.missingDetails.push('service level agreement');
    }
    
    // Subject suggestions
    if (content.includes('follow') || content.includes('checking')) {
      suggestions.subjectSuggestion = 'Follow-up: Project Status Update';
    } else if (content.includes('cost') || content.includes('price')) {
      suggestions.subjectSuggestion = 'Cost Clarification Request';
    }
    
    res.json({
      success: true,
      data: suggestions
    });
  } catch (error) {
    console.error('Error analyzing email:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to analyze email' 
    });
  }
});

module.exports = router;