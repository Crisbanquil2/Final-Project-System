import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { post } from '../services/api'
import './loginpage.css'
import backgroundImg from './pictures/background.jpg'

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')
  const emailParam = searchParams.get('email')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (emailParam) setEmail(decodeURIComponent(emailParam))
  }, [emailParam])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!token || !email) {
      setError('Invalid or expired reset link. Request a new one from the login page.')
      return
    }

    if (!password || !passwordConfirmation) {
      setError('Please fill in both password fields.')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    if (password !== passwordConfirmation) {
      setError('Passwords do not match.')
      return
    }

    setIsSubmitting(true)
    try {
      await post('/reset-password', {
        token,
        email: email.trim(),
        password,
        password_confirmation: passwordConfirmation,
      })
      setSuccess(true)
      setTimeout(() => navigate('/', { replace: true }), 800)
    } catch (err) {
      const msg = err.message || ''
      setError(msg.includes('invalid') || msg.includes('expired')
        ? 'This link is invalid or has expired. Use "Forgot Password?" on the login page to get a new link.'
        : msg || 'Failed to reset password. Request a new link from the login page.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!token || !emailParam) {
    return (
      <div className="login-page">
        <div className="login-bg" style={{ backgroundImage: `url(${backgroundImg})` }} />
        <div className="login-overlay">
          <div className="login-modal" style={{ maxWidth: '420px' }}>
            <div className="login-modal-form-wrap">
              <h2 className="login-reset-title">Invalid link</h2>
              <p className="login-error">
                This password reset link is invalid or missing. Please use &quot;Forgot Password?&quot; on the login page to get a new link.
              </p>
              <Link to="/" className="login-submit" style={{ display: 'inline-block', textAlign: 'center', textDecoration: 'none' }}>
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="login-page">
        <div className="login-bg" style={{ backgroundImage: `url(${backgroundImg})` }} />
        <div className="login-overlay">
          <div className="login-modal" style={{ maxWidth: '420px' }}>
            <div className="login-modal-form-wrap">
              <h2 className="login-reset-title">Password updated</h2>
              <p className="login-success">You can now log in with your new password. Redirecting...</p>
              <Link to="/" className="login-submit" style={{ display: 'inline-block', textAlign: 'center', textDecoration: 'none' }}>
                Go to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="login-page">
      <div className="login-bg" style={{ backgroundImage: `url(${backgroundImg})` }} />
      <div className="login-overlay">
        <div className="login-modal" style={{ maxWidth: '420px' }} onClick={(e) => e.stopPropagation()}>
          <div className="login-modal-form-wrap">
            <h2 id="reset-title" className="login-reset-title">Set new password</h2>
            <form className="login-form" onSubmit={handleSubmit} autoComplete="off">
              <div className="login-field">
                <label htmlFor="reset-email">Email</label>
                <div className="login-input-wrap">
                  <input
                    id="reset-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    readOnly
                    autoComplete="off"
                  />
                </div>
              </div>
              <div className="login-field">
                <label htmlFor="reset-password">New password</label>
                <div className="login-input-wrap">
                  <input
                    id="reset-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    autoComplete="new-password"
                  />
                </div>
              </div>
              <div className="login-field">
                <label htmlFor="reset-password-confirm">Confirm password</label>
                <div className="login-input-wrap">
                  <input
                    id="reset-password-confirm"
                    type="password"
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    placeholder="Repeat new password"
                    autoComplete="new-password"
                  />
                </div>
              </div>
              {error && <p className="login-error">{error}</p>}
              <button type="submit" className="login-submit" disabled={isSubmitting}>
                {isSubmitting ? 'Updating...' : 'Update password'}
              </button>
              <p className="login-register">
                <Link to="/" className="login-link-button">
                  Back to Login
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
