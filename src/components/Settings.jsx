import React, { useState, useEffect } from 'react'
import { User, Mail, Camera, Save, Check, X } from 'lucide-react'

const Settings = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    photo: null,
    photoPreview: null,
    isVerified: false
  })
  
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState('')

  // Load profile from localStorage on component mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('icca_user_profile')
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile)
      setProfile(parsed)
    }
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProfile(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setMessage('Photo size must be less than 2MB')
        return
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        setMessage('Please select a valid image file')
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        setProfile(prev => ({
          ...prev,
          photo: e.target.result,
          photoPreview: e.target.result
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    setMessage('')

    try {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (profile.email && !emailRegex.test(profile.email)) {
        setMessage('Please enter a valid email address')
        setIsSaving(false)
        return
      }

      // Save to localStorage
      const profileToSave = {
        ...profile,
        lastUpdated: new Date().toISOString()
      }
      
      localStorage.setItem('icca_user_profile', JSON.stringify(profileToSave))
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setMessage('Profile saved successfully!')
      setIsEditing(false)
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000)
      
    } catch (error) {
      setMessage('Failed to save profile. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    // Reload from localStorage
    const savedProfile = localStorage.getItem('icca_user_profile')
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile))
    }
    setIsEditing(false)
    setMessage('')
  }

  const sendVerificationEmail = async () => {
    if (!profile.email) {
      setMessage('Please enter an email address first')
      return
    }

    try {
      setMessage('Sending verification email...')
      
      // Simulate sending verification email
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setMessage('Verification email sent! Check your inbox.')
      
      // For demo purposes, mark as verified after 5 seconds
      setTimeout(() => {
        setProfile(prev => ({ ...prev, isVerified: true }))
        setMessage('Email verified successfully!')
        
        // Save updated profile
        const updatedProfile = { ...profile, isVerified: true }
        localStorage.setItem('icca_user_profile', JSON.stringify(updatedProfile))
      }, 5000)
      
    } catch (error) {
      setMessage('Failed to send verification email')
    }
  }

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h2>⚙️ Settings</h2>
        <p>Manage your profile and preferences</p>
      </div>

      {message && (
        <div className={`message ${message.includes('success') || message.includes('verified') ? 'success' : message.includes('Failed') || message.includes('error') ? 'error' : 'info'}`}>
          {message}
        </div>
      )}

      <div className="settings-card">
        <div className="profile-section">
          <h3>👤 Profile Information</h3>
          
          {/* Profile Photo */}
          <div className="photo-section">
            <div className="photo-container">
              {profile.photoPreview ? (
                <img src={profile.photoPreview} alt="Profile" className="profile-photo" />
              ) : (
                <div className="photo-placeholder">
                  <User size={40} />
                </div>
              )}
            </div>
            
            {isEditing && (
              <div className="photo-upload">
                <label htmlFor="photo-input" className="photo-upload-btn">
                  <Camera size={16} />
                  Change Photo
                </label>
                <input
                  id="photo-input"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  style={{ display: 'none' }}
                />
              </div>
            )}
          </div>

          {/* Name Field */}
          <div className="form-group">
            <label>Full Name</label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className="form-input"
              />
            ) : (
              <div className="form-display">
                {profile.name || 'Not set'}
              </div>
            )}
          </div>

          {/* Email Field */}
          <div className="form-group">
            <label>
              Email Address
              {profile.isVerified && (
                <span className="verified-badge">
                  <Check size={14} />
                  Verified
                </span>
              )}
            </label>
            {isEditing ? (
              <div className="email-input-group">
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email address"
                  className="form-input"
                />
                {profile.email && !profile.isVerified && (
                  <button
                    onClick={sendVerificationEmail}
                    className="verify-btn"
                    type="button"
                  >
                    Verify
                  </button>
                )}
              </div>
            ) : (
              <div className="form-display">
                {profile.email || 'Not set'}
                {profile.email && !profile.isVerified && (
                  <button
                    onClick={sendVerificationEmail}
                    className="verify-btn small"
                    type="button"
                  >
                    Verify Email
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="form-actions">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="btn btn-primary"
                >
                  {isSaving ? (
                    <>Saving...</>
                  ) : (
                    <>
                      <Save size={16} />
                      Save Changes
                    </>
                  )}
                </button>
                <button
                  onClick={handleCancel}
                  className="btn btn-secondary"
                >
                  <X size={16} />
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="btn btn-primary"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .settings-container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }

        .settings-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .settings-header h2 {
          margin: 0 0 8px 0;
          color: #1e293b;
          font-size: 28px;
        }

        .settings-header p {
          margin: 0;
          color: #64748b;
          font-size: 16px;
        }

        .message {
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 20px;
          font-size: 14px;
        }

        .message.success {
          background: #dcfce7;
          color: #166534;
          border: 1px solid #bbf7d0;
        }

        .message.error {
          background: #fef2f2;
          color: #dc2626;
          border: 1px solid #fecaca;
        }

        .message.info {
          background: #dbeafe;
          color: #1d4ed8;
          border: 1px solid #bfdbfe;
        }

        .settings-card {
          background: white;
          border-radius: 12px;
          padding: 30px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border: 1px solid #e2e8f0;
        }

        .profile-section h3 {
          margin: 0 0 24px 0;
          color: #1e293b;
          font-size: 20px;
        }

        .photo-section {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 24px;
        }

        .photo-container {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          overflow: hidden;
          border: 3px solid #e2e8f0;
        }

        .profile-photo {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .photo-placeholder {
          width: 100%;
          height: 100%;
          background: #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748b;
        }

        .photo-upload-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          color: #475569;
          transition: all 0.2s;
        }

        .photo-upload-btn:hover {
          background: #f1f5f9;
          border-color: #cbd5e1;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
          font-weight: 500;
          color: #374151;
          font-size: 14px;
        }

        .verified-badge {
          display: flex;
          align-items: center;
          gap: 4px;
          background: #dcfce7;
          color: #166534;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }

        .form-input {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 14px;
          transition: border-color 0.2s;
        }

        .form-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .form-display {
          padding: 12px 16px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          color: #374151;
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .email-input-group {
          display: flex;
          gap: 8px;
        }

        .verify-btn {
          padding: 8px 16px;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 12px;
          cursor: pointer;
          white-space: nowrap;
          transition: background-color 0.2s;
        }

        .verify-btn:hover {
          background: #2563eb;
        }

        .verify-btn.small {
          padding: 4px 12px;
          font-size: 11px;
        }

        .form-actions {
          display: flex;
          gap: 12px;
          margin-top: 30px;
        }

        .btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
        }

        .btn-primary {
          background: #3b82f6;
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background: #2563eb;
        }

        .btn-primary:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }

        .btn-secondary {
          background: #f8fafc;
          color: #475569;
          border: 1px solid #e2e8f0;
        }

        .btn-secondary:hover {
          background: #f1f5f9;
          border-color: #cbd5e1;
        }
      `}</style>
    </div>
  )
}

export default Settings