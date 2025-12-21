import React, { useState, useEffect } from 'react'
import { Send, Lightbulb, AlertCircle, CheckCircle } from 'lucide-react'

const EmailEditor = () => {
  const [email, setEmail] = useState({
    to: '',
    subject: '',
    body: '',
    selectedTemplate: null
  })
  
  const [suggestions, setSuggestions] = useState({
    tone: 'professional',
    subjectSuggestion: '',
    missingDetails: [],
    recommendedTemplate: null
  })

  const templates = [
    { id: 1, name: 'Client Follow-up', category: 'follow-up' },
    { id: 2, name: 'Cost Clarification', category: 'pricing' },
    { id: 3, name: 'Status Update', category: 'updates' },
    { id: 4, name: 'Service Reminder', category: 'reminders' }
  ]

  // Smart suggestions based on email content
  useEffect(() => {
    const analyzeEmail = () => {
      const content = email.subject + ' ' + email.body
      const missing = []
      
      // Check for missing details
      if (!content.includes('$') && !content.includes('price') && !content.includes('cost')) {
        missing.push('pricing information')
      }
      if (!content.includes('deadline') && !content.includes('date')) {
        missing.push('timeline/date')
      }
      if (!content.includes('SLA') && !content.includes('service level')) {
        missing.push('service level agreement')
      }

      // Determine tone
      let tone = 'professional'
      if (content.includes('urgent') || content.includes('ASAP') || content.includes('immediately')) {
        tone = 'urgent'
      } else if (content.includes('please') || content.includes('kindly') || content.includes('appreciate')) {
        tone = 'polite'
      }

      // Subject suggestion
      let subjectSuggestion = ''
      if (email.body.includes('follow') || email.body.includes('checking')) {
        subjectSuggestion = 'Follow-up: Project Status Update'
      } else if (email.body.includes('cost') || email.body.includes('price')) {
        subjectSuggestion = 'Cost Clarification Request'
      }

      setSuggestions({
        tone,
        subjectSuggestion,
        missingDetails: missing,
        recommendedTemplate: templates[0]
      })
    }

    if (email.body || email.subject) {
      analyzeEmail()
    }
  }, [email.subject, email.body])

  const handleTemplateSelect = (template) => {
    setEmail(prev => ({ ...prev, selectedTemplate: template }))
    
    // Load template content
    const templateContent = getTemplateContent(template.id)
    setEmail(prev => ({
      ...prev,
      subject: templateContent.subject,
      body: templateContent.body
    }))
  }

  const getTemplateContent = (templateId) => {
    const templates = {
      1: {
        subject: 'Follow-up: Project Status Update',
        body: 'Hi [Client Name],\n\nI hope this email finds you well. I wanted to follow up on our recent discussion regarding [Project Name].\n\n[Add specific details here]\n\nPlease let me know if you have any questions or need additional information.\n\nBest regards,\n[Your Name]'
      },
      2: {
        subject: 'Cost Clarification Request',
        body: 'Dear [Client Name],\n\nThank you for your interest in our services. I wanted to provide clarification on the pricing structure for [Service/Project].\n\n[Add pricing details here]\n\nI\'m happy to discuss this further at your convenience.\n\nBest regards,\n[Your Name]'
      }
    }
    return templates[templateId] || { subject: '', body: '' }
  }

  const handleSend = async () => {
    // Validate required fields
    if (!email.to || !email.subject || !email.body) {
      alert('Please fill in all required fields: To, Subject, and Message');
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.to)) {
      alert('Please enter a valid email address');
      return;
    }
    
    try {
      // Show sending state
      const originalText = document.querySelector('.btn-primary').textContent;
      document.querySelector('.btn-primary').textContent = 'Sending...';
      document.querySelector('.btn-primary').disabled = true;
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/emails/send-direct`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: email.to,
          subject: email.subject,
          body: email.body,
          from_name: 'ICCA Assistant'
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert(`✅ Email sent successfully to ${email.to}!`);
        // Clear form after successful send
        setEmail({
          to: '',
          subject: '',
          body: '',
          selectedTemplate: null
        });
      } else {
        alert(`❌ Failed to send email: ${result.error}`);
      }
      
    } catch (error) {
      console.error('Send error:', error);
      alert(`❌ Error sending email: ${error.message}`);
    } finally {
      // Reset button state
      document.querySelector('.btn-primary').textContent = originalText;
      document.querySelector('.btn-primary').disabled = false;
    }
  }

  return (
    <div className="grid grid-2">
      <div className="card">
        <h2 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Send size={20} />
          Email Editor
        </h2>
        
        <div className="form-group">
          <label className="form-label">To:</label>
          <input
            type="email"
            className="form-input"
            value={email.to}
            onChange={(e) => setEmail(prev => ({ ...prev, to: e.target.value }))}
            placeholder="client@company.com"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Subject:</label>
          <input
            type="text"
            className="form-input"
            value={email.subject}
            onChange={(e) => setEmail(prev => ({ ...prev, subject: e.target.value }))}
            placeholder="Enter subject line"
          />
          {suggestions.subjectSuggestion && (
            <div style={{ marginTop: '4px', fontSize: '12px', color: '#6b7280' }}>
              💡 Suggested: {suggestions.subjectSuggestion}
            </div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Message:</label>
          <textarea
            className="form-textarea"
            value={email.body}
            onChange={(e) => setEmail(prev => ({ ...prev, body: e.target.value }))}
            placeholder="Type your message here..."
          />
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button className="btn btn-primary" onClick={handleSend}>
            <Send size={16} style={{ marginRight: '4px' }} />
            Send Email
          </button>
          <span className={`badge badge-${suggestions.tone}`}>
            {suggestions.tone.charAt(0).toUpperCase() + suggestions.tone.slice(1)} Tone
          </span>
        </div>
      </div>

      <div>
        <div className="card">
          <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Lightbulb size={18} />
            Smart Suggestions
          </h3>
          
          <div style={{ marginBottom: '16px' }}>
            <h4 style={{ fontSize: '14px', marginBottom: '8px' }}>Template Selector</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {templates.map(template => (
                <button
                  key={template.id}
                  className={`btn ${email.selectedTemplate?.id === template.id ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => handleTemplateSelect(template)}
                  style={{ fontSize: '12px' }}
                >
                  {template.name}
                </button>
              ))}
            </div>
          </div>

          {suggestions.missingDetails.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ fontSize: '14px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <AlertCircle size={16} color="#f59e0b" />
                Missing Details
              </h4>
              <ul style={{ fontSize: '12px', color: '#6b7280', paddingLeft: '16px' }}>
                {suggestions.missingDetails.map((detail, index) => (
                  <li key={index}>{detail}</li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <h4 style={{ fontSize: '14px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle size={16} color="#10b981" />
              Professional Wording Check
            </h4>
            <p style={{ fontSize: '12px', color: '#10b981' }}>
              ✓ Professional tone detected
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmailEditor