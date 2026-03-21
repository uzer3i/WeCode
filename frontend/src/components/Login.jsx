import { useState } from 'react'
import axios from 'axios'
import './Auth.css'

const Login = ({ onLogin, onSwitchToSignup }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = () => {
    const newErrors = {}
    if (!formData.email) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid'
    if (!formData.password) newErrors.password = 'Password is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setIsLoading(true)
    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', {
        email: formData.email,
        password: formData.password
      })
      
      if (response.data) {
        // Store token and user data locally
        localStorage.setItem('wecode-token', response.data.token)
        localStorage.setItem('wecode-user', JSON.stringify(response.data.user))
        onLogin(response.data.user)
      }
    } catch (error) {
      if (error.response?.data?.message) {
        setErrors({ general: error.response.data.message })
      } else {
        setErrors({ general: 'Login failed. Please try again.' })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  return (
    <div className="auth-page">
      <div className="auth-left">
        <img src="/wecode_logo.png" alt="WeCode" className="auth-logo-img" />
      </div>
      <div className="auth-right">
        <div className="auth-form-container">
          <h2 className="auth-title">Login</h2>
          {errors.general && <div className="error-message">{errors.general}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-field">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter Email"
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>
            <div className="form-field">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter Password"
                className={errors.password ? 'error' : ''}
              />
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>
            <button type="submit" className="auth-submit" disabled={isLoading}>
              {isLoading ? 'Loading...' : 'Login'}
            </button>
          </form>
          <p className="auth-switch">
            Don't have a account? <button onClick={onSwitchToSignup} className="link-btn">Signup</button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login