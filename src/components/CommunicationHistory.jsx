import React, { useState } from 'react'
import { Mail, Clock, CheckCircle, AlertCircle, Eye, Search } from 'lucide-react'

const CommunicationHistory = () => {
  const [selectedEmail, setSelectedEmail] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const emailHistory = [
    {
      id: 1,
      to: 'john.doe@techcorp.com',
      subject: 'Follow-up: Project Status Update',
      status: 'sent',
      sentDate: '2024-12-21 09:30',
      template: 'Client Follow-up',
      notes: 'Client responded positively, meeting scheduled for next week',
      content: 'Hi John,\n\nI hope this email finds you well. I wanted to follow up on our recent discussion regarding the website redesign project...',
      category: 'Follow-up'
    },
    {
      id: 2,
      to: 'sarah.wilson@startup.io',
      subject: 'Cost Clarification Request',
      status: 'sent',
      sentDate: '2024-12-20 14:15',
      template: 'Cost Clarification',
      notes: 'Awaiting client response on pricing approval',
      content: 'Dear Sarah,\n\nThank you for your interest in our services. I wanted to provide clarification on the pricing structure...',
      category: 'Pricing'
    },
    {
      id: 3,
      to: 'mike.chen@enterprise.com',
      subject: 'Project Status Update - Week 3',
      status: 'sent',
      sentDate: '2024-12-19 16:45',
      template: 'Status Update',
      notes: 'Weekly update sent as scheduled',
      content: 'Hi Mike,\n\nHere\'s the status update for the Enterprise Dashboard project...',
      category: 'Updates'
    },
    {
      id: 4,
      to: 'lisa.brown@consulting.com',
      subject: 'Reminder: Service Renewal Due',
      status: 'pending',
      sentDate: '2024-12-21 11:00',
      template: 'Service Reminder',
      notes: 'Scheduled to send tomorrow morning',
      content: 'Dear Lisa,\n\nThis is a friendly reminder that your consulting service is due for renewal...',
      category: 'Reminders'
    },
    {
      id: 5,
      to: 'david.kim@agency.co',
      subject: 'Meeting Request: Q1 Planning',
      status: 'sent',
      sentDate: '2024-12-18 10:20',
      template: 'Meeting Request',
      notes: 'Meeting confirmed for Dec 23rd at 2 PM',
      content: 'Hi David,\n\nI would like to schedule a meeting to discuss Q1 planning and strategy...',
      category: 'Meetings'
    },
    {
      id: 6,
      to: 'emma.davis@retail.com',
      subject: 'URGENT: Server Maintenance Window',
      status: 'sent',
      sentDate: '2024-12-17 08:00',
      template: 'Urgent Issue Alert',
      notes: 'Client acknowledged, maintenance completed successfully',
      content: 'Dear Emma,\n\nI need to bring to your immediate attention an urgent server maintenance...',
      category: 'Urgent'
    }
  ]

  const filteredEmails = emailHistory.filter(email => {
    const matchesSearch = email.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         email.notes.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || email.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusIcon = (status) => {
    switch (status) {
      case 'sent':
        return <CheckCircle size={16} color="#10b981" />
      case 'pending':
        return <Clock size={16} color="#f59e0b" />
      case 'failed':
        return <AlertCircle size={16} color="#ef4444" />
      default:
        return <Mail size={16} color="#6b7280" />
    }
  }

  const getStatusBadge = (status) => {
    const badges = {
      sent: 'badge-professional',
      pending: 'badge-polite',
      failed: 'badge-urgent'
    }
    return badges[status] || 'badge-professional'
  }

  return (
    <div className="grid grid-2">
      <div>
        <div className="card">
          <h2 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Mail size={20} />
            Client Communication History
          </h2>

          <div style={{ marginBottom: '20px' }}>
            <div className="form-group">
              <div style={{ position: 'relative' }}>
                <Search size={16} style={{ 
                  position: 'absolute', 
                  left: '12px', 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  color: '#6b7280'
                }} />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Search emails..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ paddingLeft: '40px' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['all', 'sent', 'pending', 'failed'].map(status => (
                <button
                  key={status}
                  className={`btn ${statusFilter === status ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setStatusFilter(status)}
                  style={{ fontSize: '12px' }}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredEmails.map(email => (
              <div
                key={email.id}
                style={{
                  padding: '16px',
                  border: selectedEmail?.id === email.id ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onClick={() => setSelectedEmail(email)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '14px', marginBottom: '4px', fontWeight: '600' }}>
                      {email.subject}
                    </h3>
                    <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                      To: {email.to}
                    </p>
                    <p style={{ fontSize: '11px', color: '#94a3b8' }}>
                      {email.sentDate} • Template: {email.template}
                    </p>
                  </div>
                  <span className={`badge ${getStatusBadge(email.status)}`} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {getStatusIcon(email.status)}
                    {email.status.charAt(0).toUpperCase() + email.status.slice(1)}
                  </span>
                </div>
                
                {email.notes && (
                  <div style={{ 
                    marginTop: '8px', 
                    padding: '8px', 
                    backgroundColor: '#f8fafc', 
                    borderRadius: '4px',
                    fontSize: '12px',
                    color: '#64748b'
                  }}>
                    📝 {email.notes}
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredEmails.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
              <Mail size={32} style={{ margin: '0 auto 12px' }} />
              <p>No emails found matching your criteria</p>
            </div>
          )}
        </div>
      </div>

      <div>
        {selectedEmail ? (
          <div className="card">
            <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Eye size={18} />
              Email Details
            </h3>
            
            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ fontSize: '14px', marginBottom: '8px' }}>Subject</h4>
              <p style={{ fontSize: '16px', fontWeight: '600' }}>{selectedEmail.subject}</p>
            </div>

            <div className="grid grid-2" style={{ marginBottom: '16px' }}>
              <div>
                <h4 style={{ fontSize: '14px', marginBottom: '8px' }}>Recipient</h4>
                <p style={{ fontSize: '14px' }}>{selectedEmail.to}</p>
              </div>
              <div>
                <h4 style={{ fontSize: '14px', marginBottom: '8px' }}>Status</h4>
                <span className={`badge ${getStatusBadge(selectedEmail.status)}`} style={{ display: 'flex', alignItems: 'center', gap: '4px', width: 'fit-content' }}>
                  {getStatusIcon(selectedEmail.status)}
                  {selectedEmail.status.charAt(0).toUpperCase() + selectedEmail.status.slice(1)}
                </span>
              </div>
            </div>

            <div className="grid grid-2" style={{ marginBottom: '16px' }}>
              <div>
                <h4 style={{ fontSize: '14px', marginBottom: '8px' }}>Sent Date</h4>
                <p style={{ fontSize: '14px' }}>{selectedEmail.sentDate}</p>
              </div>
              <div>
                <h4 style={{ fontSize: '14px', marginBottom: '8px' }}>Template Used</h4>
                <span className="badge badge-professional">{selectedEmail.template}</span>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ fontSize: '14px', marginBottom: '8px' }}>Email Content</h4>
              <div style={{ 
                padding: '12px', 
                backgroundColor: '#f8fafc', 
                borderRadius: '6px',
                fontSize: '13px',
                whiteSpace: 'pre-wrap',
                lineHeight: '1.6',
                maxHeight: '200px',
                overflowY: 'auto'
              }}>
                {selectedEmail.content}
              </div>
            </div>

            {selectedEmail.notes && (
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ fontSize: '14px', marginBottom: '8px' }}>Notes</h4>
                <div style={{ 
                  padding: '12px', 
                  backgroundColor: '#fef3c7', 
                  borderRadius: '6px',
                  fontSize: '13px',
                  color: '#92400e'
                }}>
                  📝 {selectedEmail.notes}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn btn-secondary" style={{ fontSize: '12px' }}>
                Reply
              </button>
              <button className="btn btn-secondary" style={{ fontSize: '12px' }}>
                Forward
              </button>
              <button className="btn btn-secondary" style={{ fontSize: '12px' }}>
                Add Note
              </button>
            </div>
          </div>
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: '60px 24px', color: '#94a3b8' }}>
            <Eye size={48} style={{ margin: '0 auto 16px' }} />
            <p>Select an email to view details</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default CommunicationHistory