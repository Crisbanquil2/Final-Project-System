import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { post } from '../services/api'
import './loginpage.css'
import backgroundImg from './pictures/background.jpg'

export default function LoginPage() {
  const [isModalOpen, setIsModalOpen] = useState(true)
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isAuthenticated } = useAuth()

  const displaySuccess = success

  useEffect(() => {
    if (!isModalOpen) return
    const id = setTimeout(() => {
      setEmail('')
      setPassword('')
      setConfirmPassword('')
    }, 200)
    return () => clearTimeout(id)
  }, [isModalOpen, mode])

  if (isAuthenticated && isModalOpen) {
    navigate('/dashboard')
    setIsModalOpen(false)
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!email || !password) {
      setError('Email and password are required.')
      return
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailPattern.test(email)) {
      setError('Please enter a valid email address.')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setIsSubmitting(true)
    try {
      await login(email, password)
      const from = location.state?.from?.pathname || '/dashboard'
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRegisterSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!name || !email || !password || !confirmPassword) {
      setError('All fields are required.')
      return
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailPattern.test(email)) {
      setError('Please enter a valid email address.')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setIsSubmitting(true)
    try {
      await post('/register', {
        name: String(name || '').trim(),
        email: String(email || '').trim(),
        password,
        password_confirmation: confirmPassword,
      })

      setSuccess('Registration successful. Please login with your new account.')
      setMode('login')
      setName('')
      setEmail('')
      setPassword('')
      setConfirmPassword('')
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleForgotSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    const safeEmail = String(email || '').trim()
    if (!safeEmail) {
      setError('Email is required.')
      return
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailPattern.test(safeEmail)) {
      setError('Please enter a valid email address.')
      return
    }

    setIsSubmitting(true)
    try {
      await post('/forgot-password', { email: safeEmail })
      setSuccess('Reset link sent. Check your email (including spam) and click the link to set a new password.')
      setMode('login')
    } catch (err) {
      setError(err.message || 'Failed to send reset link.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="login-page">
      <div
        className="login-bg"
        style={{ backgroundImage: `url(${backgroundImg})` }}
      />

      <header className="login-header">
        <span className="login-logo"></span>
        <nav className="login-nav">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#services">Services</a>
          <a href="#contact">Contact</a>
          <button
            type="button"
            className="login-header-btn"
            onClick={() => setIsModalOpen(true)}
          >
            Login
          </button>
        </nav>
      </header>

      {isModalOpen && (
        <div className="login-overlay" role="dialog" aria-modal="true" aria-labelledby="login-title">
          <div
            className="login-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="login-modal-logo">
              <div className="login-logo-icon" aria-hidden="true">
                <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M32 4L8 16v24l24 20 24-20V16L32 4z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" fill="none"/>
                  <path d="M32 20v24M20 28l12-8 12 8M26 40l6-8 6 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  <circle cx="32" cy="28" r="4" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
              </div>
              <span className="login-logo-brand">MEOW</span>
              <p className="login-logo-tagline">Sign in to your account</p>
            </div>

            <div className="login-modal-form-wrap">
              <div className="login-modal-header">
                <h2 id="login-title">
                  {mode === 'login' ? 'Login' : mode === 'register' ? 'Register' : 'Forgot Password'}
                </h2>
                <button
                  type="button"
                  className="login-close"
                  onClick={() => setIsModalOpen(false)}
                  aria-label="Close"
                >
                  ×
                </button>
              </div>

              <form
                key={`login-form-${mode}`}
                className="login-form"
                autoComplete="off"
                onSubmit={
                  mode === 'login'
                    ? handleLoginSubmit
                    : mode === 'register'
                      ? handleRegisterSubmit
                      : handleForgotSubmit
                }
              >
              {mode === 'register' && (
                <div className="login-field">
                  <label htmlFor="register-name">Full Name</label>
                  <div className="login-input-wrap">
                    <input
                      id="register-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      autoComplete="off"
                    />
                  </div>
                </div>
              )}

              <div className="login-field">
                <label htmlFor="login-email">Email</label>
                <div className="login-input-wrap">
                  <input
                    id="login-email"
                    type="email"
                    placeholder=""
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="off"
                  />
                  <span className="login-input-icon" aria-hidden="true">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </span>
                </div>
              </div>

              {mode !== 'forgot' && (
                <div className="login-field">
                  <label htmlFor="login-password">Password</label>
                  <div className="login-input-wrap">
                    <input
                      id="login-password"
                      type="password"
                      placeholder=""
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="off"
                    />
                    <span className="login-input-icon" aria-hidden="true">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </span>
                  </div>
                </div>
              )}

              {mode === 'register' && (
                <div className="login-field">
                  <label htmlFor="register-password-confirm">Confirm Password</label>
                  <div className="login-input-wrap">
                    <input
                      id="register-password-confirm"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      autoComplete="off"
                    />
                  </div>
                </div>
              )}

              {mode !== 'forgot' && (
                <div className="login-options">
                  <label className="login-remember">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span>Remember me</span>
                  </label>
                  <button
                    type="button"
                    className="login-link-button login-forgot"
                    onClick={() => {
                      setMode('forgot')
                      setError('')
                      setSuccess('')
                      setPassword('')
                      setConfirmPassword('')
                    }}
                  >
                    Forgot Password?
                  </button>
                </div>
              )}

              {error && <p className="login-error">{error}</p>}
              {displaySuccess && <p className="login-success">{displaySuccess}</p>}

              <button type="submit" className="login-submit" disabled={isSubmitting}>
                {isSubmitting
                  ? mode === 'login'
                    ? 'Logging in...'
                    : mode === 'register'
                      ? 'Registering...'
                      : 'Sending...'
                  : mode === 'login'
                    ? 'Login'
                    : mode === 'register'
                      ? 'Register'
                      : 'Send Reset Link'}
              </button>

              {mode === 'forgot' ? (
                <p className="login-register">
                  Remembered your password?{' '}
                  <button
                    type="button"
                    className="login-link-button"
                    onClick={() => {
                      setMode('login')
                      setError('')
                      setSuccess('')
                    }}
                  >
                    Back to Login
                  </button>
                </p>
              ) : mode === 'login' ? (
                <p className="login-register">
                  Don&apos;t have an account?{' '}
                  <button
                    type="button"
                    className="login-link-button"
                    onClick={() => {
                      setMode('register')
                      setError('')
                      setSuccess('')
                    }}
                  >
                    Register
                  </button>
                </p>
              ) : (
                <p className="login-register">
                  Already have an account?{' '}
                  <button
                    type="button"
                    className="login-link-button"
                    onClick={() => {
                      setMode('login')
                      setError('')
                      setSuccess('')
                    }}
                  >
                    Login
                  </button>
                </p>
              )}
            </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
