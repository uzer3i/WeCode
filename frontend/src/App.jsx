import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import Login from './components/Login'
import Signup from './components/Signup'
import CodeEditorApp from './components/CodeEditorApp'
import SnippetLoader from './components/SnippetLoader'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)

  const handleLogin = (userData) => {
    setIsAuthenticated(true)
    setUser(userData)
    localStorage.setItem('wecode-user', JSON.stringify(userData))
  }

  const handleSignup = (userData) => {
    setIsAuthenticated(true)
    setUser(userData)
    localStorage.setItem('wecode-user', JSON.stringify(userData))
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setUser(null)
    localStorage.removeItem('wecode-user')
    localStorage.removeItem('wecode-token')
  }

  useEffect(() => {
    const savedUser = localStorage.getItem('wecode-user')
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        setUser(userData)
        setIsAuthenticated(true)
      } catch (parseError) {
        console.error('Error parsing user data:', parseError)
        localStorage.removeItem('wecode-user')
        localStorage.removeItem('wecode-token')
      }
    }
  }, [])

  return (
    <Router>
      <Routes>
        {/* Public routes - always accessible */}
        <Route path="/login" element={
          isAuthenticated ? 
          <Navigate to="/" replace /> : 
          <LoginWrapper onLogin={handleLogin} />
        } />
        
        <Route path="/signup" element={
          isAuthenticated ? 
          <Navigate to="/" replace /> : 
          <SignupWrapper onSignup={handleSignup} />
        } />

        {/* Protected routes - require authentication */}
        <Route path="/" element={
          isAuthenticated ? 
          <CodeEditorApp user={user} onLogout={handleLogout} /> : 
          <Navigate to="/login" replace />
        } />
        
        <Route path="/editor" element={
          isAuthenticated ? 
          <CodeEditorApp user={user} onLogout={handleLogout} /> : 
          <Navigate to="/login" replace />
        } />
        
        <Route path="/snippet" element={
          isAuthenticated ? 
          <SnippetLoader user={user} onLogout={handleLogout} /> : 
          <Navigate to="/login" replace />
        } />

        {/* Catch all route */}
        <Route path="*" element={
          isAuthenticated ? 
          <Navigate to="/" replace /> : 
          <Navigate to="/login" replace />
        } />
      </Routes>
    </Router>
  )
}

// Wrapper components to handle navigation
function LoginWrapper({ onLogin }) {
  const navigate = useNavigate()
  return <Login onLogin={onLogin} onSwitchToSignup={() => navigate('/signup')} />
}

function SignupWrapper({ onSignup }) {
  const navigate = useNavigate()
  return <Signup onSignup={onSignup} onSwitchToLogin={() => navigate('/login')} />
}

export default App
