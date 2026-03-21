import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Login'
import Signup from './components/Signup'
import CodeEditorApp from './components/CodeEditorApp'
import './App.css'

function App() {
  console.log('App component rendering')
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
      const userData = JSON.parse(savedUser)
      setUser(userData)
      setIsAuthenticated(true)
    }
  }, [])

  // If not authenticated, show login/signup routes
  console.log('Authentication state:', isAuthenticated)
  if (!isAuthenticated) {
    console.log('Showing unauthenticated routes')
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} onSwitchToSignup={() => window.location.href = '/signup'} />} />
          <Route path="/signup" element={<Signup onSignup={handleSignup} onSwitchToLogin={() => window.location.href = '/login'} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    )
  }

  // If authenticated, show the code editor
  console.log('Showing authenticated routes')
  return (
    <Router>
      <Routes>
        <Route path="/editor" element={<CodeEditorApp user={user} onLogout={handleLogout} />} />
        <Route path="/" element={<CodeEditorApp user={user} onLogout={handleLogout} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
