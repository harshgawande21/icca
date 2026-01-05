import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom'
import { Settings as SettingsIcon } from 'lucide-react'

import EmailEditor from './components/EmailEditor'
import TemplateRepository from './components/TemplateRepository'
import CommunicationHistory from './components/CommunicationHistory'
import Settings from './components/Settings'

function Navigation() {
  const location = useLocation()
  
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
            <Link 
              to="/settings" 
              className={`nav-link ${location.pathname === '/settings' ? 'active' : ''}`}
              title="Settings"
            >
              <SettingsIcon size={18} />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <div className="container">
          <Routes>
            <Route path="/" element={<EmailEditor />} />
            <Route path="/templates" element={<TemplateRepository />} />
            <Route path="/history" element={<CommunicationHistory />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App