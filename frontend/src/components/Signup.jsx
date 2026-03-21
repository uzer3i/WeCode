import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from "react-router-dom"
import './Auth.css'

const Signup = ({ onSignup, onSwitchToLogin }) => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name) newErrors.name = 'Name is required'

    if (!formData.email) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = 'Email is invalid'

    if (!formData.password) newErrors.password = 'Password is required'
    else if (formData.password.length < 6)
      newErrors.password = 'Min 6 characters'

    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    try {
      const response = await axios.post(
        'http://localhost:3000/api/auth/register',
        {
          name: formData.name,
          email: formData.email,
          password: formData.password
        }
      )

      if (response.data) {
        // Store token and user
        localStorage.setItem('wecode-token', response.data.token)
        localStorage.setItem('wecode-user', JSON.stringify(response.data.user))

        onSignup(response.data.user)

        // ✅ Redirect to home page
        navigate("/login")
      }

    } catch (error) {
      if (error.response?.data?.message) {
        setErrors({ general: error.response.data.message })
      } else {
        setErrors({ general: 'Signup failed. Please try again.' })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-left">
        <img src="/wecode_logo.png" alt="WeCode" className="auth-logo-img" />
      </div>

      <div className="auth-right">
        <div className="auth-form-container">
          <h2 className="auth-title">Signup</h2>

          {errors.general && (
            <div className="error-message">{errors.general}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-field">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter Name"
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>

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

            <div className="form-field">
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                className={errors.confirmPassword ? 'error' : ''}
              />
              {errors.confirmPassword && (
                <span className="error-text">{errors.confirmPassword}</span>
              )}
            </div>

            <button type="submit" className="auth-submit" disabled={isLoading}>
              {isLoading ? 'Loading...' : 'Signup'}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account?{" "}
            <button onClick={onSwitchToLogin} className="link-btn">
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup