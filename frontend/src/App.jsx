import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
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

  // If not authenticated, show login/signup routes
  if (!isAuthenticated) {
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
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CodeEditorApp user={user} onLogout={handleLogout} />} />
        <Route path="/editor" element={<CodeEditorApp user={user} onLogout={handleLogout} />} />
        <Route path="/snippet" element={<SnippetLoader user={user} onLogout={handleLogout} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
