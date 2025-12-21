import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './components/Login'
import Signup from './components/Signup'
import EmailEditor from './components/EmailEditor'
import TemplateRepository from './components/TemplateRepository'
import CommunicationHistory from './components/CommunicationHistory'
import { LogOut, User } from 'lucide-react'

function Navigation() {
  const location = useLocation()
  const { user, logout } = useAuth()
  
  const handleLogout = () => {
    logout()
  }
  
  return (
    <nav className="nav">
      <div className="nav-container">
        <div className="nav-brand">ICCA</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div className="nav-links">
            <Link 
              to="/" 
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              Email Editor
            </Link>
            <Link 
              to="/templates" 
              className={`nav-link ${location.pathname === '/templates' ? 'active' : ''}`}
            >
              Templates
            </Link>
            <Link 
              to="/history" 
              className={`nav-link ${location.pathname === '/history' ? 'active' : ''}`}
            >
              History
            </Link>
          </div>
          
          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b' }}>
                <User size={16} />
                <span style={{ fontSize: '14px' }}>
                  {user.first_name} {user.last_name}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="btn btn-secondary"
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '4px',
                  fontSize: '12px',
                  padding: '6px 12px'
                }}
              >
                <LogOut size={14} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

function MainApp() {
  return (
    <div className="App">
      <Navigation />
      <div className="container">
        <Routes>
          <Route path="/" element={
            <ProtectedRoute>
              <EmailEditor />
            </ProtectedRoute>
          } />
          <Route path="/templates" element={
            <ProtectedRoute>
              <TemplateRepository />
            </ProtectedRoute>
          } />
          <Route path="/history" element={
            <ProtectedRoute>
              <CommunicationHistory />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected routes */}
          <Route path="/*" element={<MainApp />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App