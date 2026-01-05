import React, { useState, useEffect } from 'react'
import { Mail, Clock, User, Trash2, Eye, Search } from 'lucide-react'

const CommunicationHistory = () => {
  const [emails, setEmails] = useState([])
  const [filteredEmails, setFilteredEmails] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedEmail, setSelectedEmail] = useState(null)
  const [userProfile, setUserProfile] = useState(null)

  // Load user profile and emails from localStorage
  useEffect(() => {
    const profile = localStorage.getItem('icca_user_profile')
    if (profile) {
      setUserProfile(JSON.parse(profile))
    }

    const sentEmails = localStorage.getItem('icca_sent_emails')
    if (sentEmails) {
      const parsed = JSON.parse(sentEmails)
      setEmails(parsed)
      setFilteredEmails(parsed)
    }
  }, [])

  // Filter emails based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredEmails(emails)
    } else {
      const filtered = emails.filter(email =>
        email.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.body.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredEmails(filtered)
    }
  }, [searchTerm, emails])

  const deleteEmail = (emailId) => {
    if (window.confirm('Are you sure you want to delete this email from history?')) {
      const updatedEmails = emails.filter(email => email.id !== emailId)
      setEmails(updatedEmails)
      setFilteredEmails(updatedEmails)
      localStorage.setItem('icca_sent_emails', JSON.stringify(updatedEmails))
      
      if (selectedEmail && selectedEmail.id === emailId) {
        setSelectedEmail(null)
      }
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const getInitials = (email) => {
    return email.split('@')[0].substring(0, 2).toUpperCase()
  }

  if (!userProfile) {
    return (
      <div className="history-container">
        <div className="empty-state">
          <User size={48} />
          <h3>Set up your profile first</h3>
          <p>Go to Settings to set up your profile and start tracking your email history.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="history-container">
      <div className="history-header">
        <div className="header-content">
          <h2>📧 My Email History</h2>
          <p>Your personal email communication history</p>
        </div>
        
        {userProfile && (
          <div className="user-info">
            {userProfile.photo ? (
              <img src={userProfile.photo} alt="Profile" className="user-avatar" />
            ) : (
              <div className="user-avatar-placeholder">
                {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
            <div className="user-details">
              <span className="user-name">{userProfile.name || 'User'}</span>
              <span className="user-email">{userProfile.email}</span>
            </div>
          </div>
        )}
      </div>

      {/* Search Bar */}
      <div className="search-section">
        <div className="search-input-group">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search emails by recipient, subject, or content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="history-content">
        {filteredEmails.length === 0 ? (
          <div className="empty-state">
            {emails.length === 0 ? (
              <>
                <Mail size={48} />
                <h3>No emails sent yet</h3>
                <p>Your sent emails will appear here once you start using the Email Editor.</p>
              </>
            ) : (
              <>
                <Search size={48} />
                <h3>No emails found</h3>
                <p>Try adjusting your search terms.</p>
              </>
            )}
          </div>
        ) : (
          <div className="emails-grid">
            {filteredEmails.map((email) => (
              <div key={email.id} className="email-card">
                <div className="email-header">
                  <div className="recipient-info">
                    <div className="recipient-avatar">
                      {getInitials(email.to)}
                    </div>
                    <div className="recipient-details">
                      <span className="recipient-email">{email.to}</span>
                      <span className="email-date">
                        <Clock size={12} />
                        {formatDate(email.sentAt)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="email-actions">
                    <button
                      onClick={() => setSelectedEmail(email)}
                      className="action-btn view-btn"
                      title="View email"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => deleteEmail(email.id)}
                      className="action-btn delete-btn"
                      title="Delete email"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="email-content">
                  <h4 className="email-subject">{email.subject}</h4>
                  <p className="email-preview">
                    {email.body.substring(0, 120)}
                    {email.body.length > 120 ? '...' : ''}
                  </p>
                </div>

                <div className="email-status">
                  <span className="status-badge sent">
                    ✓ Sent
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Email Detail Modal */}
      {selectedEmail && (
        <div className="modal-overlay" onClick={() => setSelectedEmail(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Email Details</h3>
              <button
                onClick={() => setSelectedEmail(null)}
                className="close-btn"
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="email-detail">
                <div className="detail-row">
                  <strong>To:</strong> {selectedEmail.to}
                </div>
                <div className="detail-row">
                  <strong>Subject:</strong> {selectedEmail.subject}
                </div>
                <div className="detail-row">
                  <strong>Sent:</strong> {formatDate(selectedEmail.sentAt)}
                </div>
                <div className="detail-row message-content">
                  <strong>Message:</strong>
                  <div className="message-body">
                    {selectedEmail.body.split('\n').map((line, index) => (
                      <p key={index}>{line}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .history-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }

        .history-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          flex-wrap: wrap;
          gap: 20px;
        }

        .header-content h2 {
          margin: 0 0 8px 0;
          color: #1e293b;
          font-size: 28px;
        }

        .header-content p {
          margin: 0;
          color: #64748b;
          font-size: 16px;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 12px;
          background: white;
          padding: 12px 16px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
        }

        .user-avatar-placeholder {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #3b82f6;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
        }

        .user-details {
          display: flex;
          flex-direction: column;
        }

        .user-name {
          font-weight: 600;
          color: #1e293b;
          font-size: 14px;
        }

        .user-email {
          color: #64748b;
          font-size: 12px;
        }

        .search-section {
          margin-bottom: 24px;
        }

        .search-input-group {
          position: relative;
          max-width: 400px;
        }

        .search-input-group svg {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
        }

        .search-input {
          width: 100%;
          padding: 12px 12px 12px 44px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 14px;
        }

        .search-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .history-content {
          min-height: 400px;
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          text-align: center;
          color: #64748b;
        }

        .empty-state svg {
          margin-bottom: 16px;
          opacity: 0.5;
        }

        .empty-state h3 {
          margin: 0 0 8px 0;
          color: #374151;
        }

        .empty-state p {
          margin: 0;
          max-width: 400px;
        }

        .emails-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 20px;
        }

        .email-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          border: 1px solid #e2e8f0;
          transition: all 0.2s;
        }

        .email-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          border-color: #cbd5e1;
        }

        .email-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }

        .recipient-info {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
        }

        .recipient-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 600;
          color: #475569;
        }

        .recipient-details {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .recipient-email {
          font-weight: 500;
          color: #1e293b;
          font-size: 14px;
          word-break: break-all;
        }

        .email-date {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #64748b;
          font-size: 12px;
          margin-top: 2px;
        }

        .email-actions {
          display: flex;
          gap: 8px;
        }

        .action-btn {
          padding: 6px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .view-btn {
          background: #f0f9ff;
          color: #0369a1;
        }

        .view-btn:hover {
          background: #e0f2fe;
        }

        .delete-btn {
          background: #fef2f2;
          color: #dc2626;
        }

        .delete-btn:hover {
          background: #fee2e2;
        }

        .email-content {
          margin-bottom: 16px;
        }

        .email-subject {
          margin: 0 0 8px 0;
          color: #1e293b;
          font-size: 16px;
          font-weight: 600;
          line-height: 1.4;
        }

        .email-preview {
          margin: 0;
          color: #64748b;
          font-size: 14px;
          line-height: 1.5;
        }

        .email-status {
          display: flex;
          justify-content: flex-end;
        }

        .status-badge {
          padding: 4px 12px;
          border-radius: 16px;
          font-size: 12px;
          font-weight: 500;
        }

        .status-badge.sent {
          background: #dcfce7;
          color: #166534;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal-content {
          background: white;
          border-radius: 12px;
          max-width: 600px;
          width: 100%;
          max-height: 80vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          border-bottom: 1px solid #e2e8f0;
        }

        .modal-header h3 {
          margin: 0;
          color: #1e293b;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #64748b;
          padding: 0;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
        }

        .close-btn:hover {
          background: #f1f5f9;
        }

        .modal-body {
          padding: 24px;
          overflow-y: auto;
        }

        .detail-row {
          margin-bottom: 16px;
        }

        .detail-row strong {
          color: #374151;
          display: inline-block;
          min-width: 80px;
        }

        .message-content {
          margin-top: 20px;
        }

        .message-body {
          margin-top: 8px;
          padding: 16px;
          background: #f8fafc;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
        }

        .message-body p {
          margin: 0 0 8px 0;
          line-height: 1.6;
        }

        .message-body p:last-child {
          margin-bottom: 0;
        }

        @media (max-width: 768px) {
          .history-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .emails-grid {
            grid-template-columns: 1fr;
          }

          .modal-content {
            margin: 20px;
            max-height: calc(100vh - 40px);
          }
        }
      `}</style>
    </div>
  )
}

export default CommunicationHistory