import React, { useState } from 'react'
import { FileText, Eye, CheckCircle, Clock } from 'lucide-react'

const TemplateRepository = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [filter, setFilter] = useState('all')

  const templates = [
    {
      id: 1,
      name: 'Client Follow-up',
      category: 'Follow-up',
      status: 'approved',
      description: 'Standard follow-up email for client communications',
      lastModified: '2024-12-15',
      content: {
        subject: 'Follow-up: Project Status Update',
        body: 'Hi [Client Name],\n\nI hope this email finds you well. I wanted to follow up on our recent discussion regarding [Project Name].\n\n[Add specific details here]\n\nPlease let me know if you have any questions or need additional information.\n\nBest regards,\n[Your Name]'
      }
    },
    {
      id: 2,
      name: 'Cost Clarification',
      category: 'Pricing',
      status: 'approved',
      description: 'Template for clarifying costs and pricing details',
      lastModified: '2024-12-18',
      content: {
        subject: 'Cost Clarification Request',
        body: 'Dear [Client Name],\n\nThank you for your interest in our services. I wanted to provide clarification on the pricing structure for [Service/Project].\n\nPricing Details:\n- [Item 1]: $[Amount]\n- [Item 2]: $[Amount]\n- Total: $[Total Amount]\n\nI\'m happy to discuss this further at your convenience.\n\nBest regards,\n[Your Name]'
      }
    },
    {
      id: 3,
      name: 'Status Update',
      category: 'Updates',
      status: 'approved',
      description: 'Weekly or monthly project status update template',
      lastModified: '2024-12-10',
      content: {
        subject: 'Project Status Update - [Week/Month]',
        body: 'Hi [Client Name],\n\nHere\'s the status update for [Project Name]:\n\nCompleted:\n- [Task 1]\n- [Task 2]\n\nIn Progress:\n- [Task 3]\n\nUpcoming:\n- [Task 4]\n\nNext milestone: [Date]\n\nBest regards,\n[Your Name]'
      }
    },
    {
      id: 4,
      name: 'Service Reminder',
      category: 'Reminders',
      status: 'draft',
      description: 'Reminder for upcoming service renewals or deadlines',
      lastModified: '2024-12-20',
      content: {
        subject: 'Reminder: [Service] Renewal Due',
        body: 'Dear [Client Name],\n\nThis is a friendly reminder that your [Service Name] is due for renewal on [Date].\n\nTo ensure uninterrupted service, please:\n1. Review the attached renewal terms\n2. Confirm your renewal by [Deadline]\n\nPlease let me know if you have any questions.\n\nBest regards,\n[Your Name]'
      }
    },
    {
      id: 5,
      name: 'Meeting Request',
      category: 'Meetings',
      status: 'approved',
      description: 'Professional meeting request template',
      lastModified: '2024-12-12',
      content: {
        subject: 'Meeting Request: [Topic]',
        body: 'Hi [Client Name],\n\nI would like to schedule a meeting to discuss [Topic].\n\nProposed times:\n- [Option 1]\n- [Option 2]\n- [Option 3]\n\nThe meeting will take approximately [Duration] minutes.\n\nPlease let me know which time works best for you.\n\nBest regards,\n[Your Name]'
      }
    },
    {
      id: 6,
      name: 'Urgent Issue Alert',
      category: 'Urgent',
      status: 'approved',
      description: 'Template for urgent client communications',
      lastModified: '2024-12-19',
      content: {
        subject: 'URGENT: [Issue Description]',
        body: 'Dear [Client Name],\n\nI need to bring to your immediate attention an urgent matter regarding [Issue].\n\nSituation:\n[Brief description]\n\nImmediate action required:\n[Action items]\n\nI am available to discuss this at your earliest convenience.\n\nBest regards,\n[Your Name]'
      }
    }
  ]

  const categories = ['all', 'Follow-up', 'Pricing', 'Updates', 'Reminders', 'Meetings', 'Urgent']

  const filteredTemplates = filter === 'all' 
    ? templates 
    : templates.filter(t => t.category === filter)

  return (
    <div className="grid grid-2">
      <div>
        <div className="card">
          <h2 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={20} />
            Email Template Repository
          </h2>

          <div style={{ marginBottom: '20px' }}>
            <label className="form-label">Filter by Category:</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`btn ${filter === cat ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setFilter(cat)}
                  style={{ fontSize: '12px' }}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredTemplates.map(template => (
              <div
                key={template.id}
                style={{
                  padding: '16px',
                  border: selectedTemplate?.id === template.id ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onClick={() => setSelectedTemplate(template)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                  <div>
                    <h3 style={{ fontSize: '16px', marginBottom: '4px' }}>{template.name}</h3>
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>{template.category}</span>
                  </div>
                  <span className={`badge ${template.status === 'approved' ? 'badge-professional' : 'badge-polite'}`}>
                    {template.status === 'approved' ? (
                      <><CheckCircle size={12} style={{ marginRight: '4px' }} /> Approved</>
                    ) : (
                      <><Clock size={12} style={{ marginRight: '4px' }} /> Draft</>
                    )}
                  </span>
                </div>
                <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '8px' }}>
                  {template.description}
                </p>
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                  Last modified: {template.lastModified}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        {selectedTemplate ? (
          <div className="card">
            <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Eye size={18} />
              Template Preview
            </h3>
            
            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ fontSize: '14px', marginBottom: '8px' }}>Template Name</h4>
              <p style={{ fontSize: '16px', fontWeight: '600' }}>{selectedTemplate.name}</p>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ fontSize: '14px', marginBottom: '8px' }}>Category</h4>
              <span className="badge badge-professional">{selectedTemplate.category}</span>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ fontSize: '14px', marginBottom: '8px' }}>Subject Line</h4>
              <div style={{ 
                padding: '12px', 
                backgroundColor: '#f8fafc', 
                borderRadius: '6px',
                fontSize: '14px'
              }}>
                {selectedTemplate.content.subject}
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ fontSize: '14px', marginBottom: '8px' }}>Email Body</h4>
              <div style={{ 
                padding: '12px', 
                backgroundColor: '#f8fafc', 
                borderRadius: '6px',
                fontSize: '13px',
                whiteSpace: 'pre-wrap',
                lineHeight: '1.6'
              }}>
                {selectedTemplate.content.body}
              </div>
            </div>

            <button className="btn btn-primary" style={{ width: '100%' }}>
              Use This Template
            </button>
          </div>
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: '60px 24px', color: '#94a3b8' }}>
            <Eye size={48} style={{ margin: '0 auto 16px' }} />
            <p>Select a template to preview</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default TemplateRepository