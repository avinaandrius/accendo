import { useEffect, useMemo, useState } from 'react'
import { AlertCircle, CheckCircle, Mail, RefreshCw } from 'lucide-react'
import { Brand } from '../components/layout'
import { getAuthRedirectTo, hasSupabaseConfig, supabase } from '../supabase'

function readAuthError() {
  const search = new URLSearchParams(window.location.search)
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''))
  return (
    search.get('error_description') ||
    hash.get('error_description') ||
    search.get('error') ||
    hash.get('error') ||
    ''
  )
}

export default function AuthCallback({ onSession }) {
  const [status, setStatus] = useState('checking')
  const [message, setMessage] = useState('Confirming your email and preparing your study path…')
  const [email, setEmail] = useState(() => localStorage.getItem('accendo-pending-email') || '')
  const [busy, setBusy] = useState(false)

  const friendlyError = useMemo(() => {
    if (!message) return 'This verification link could not be used.'
    if (message.toLowerCase().includes('expired')) return 'This verification link expired. Send yourself a fresh confirmation email.'
    return message
  }, [message])

  useEffect(() => {
    let cancelled = false

    async function finishVerification() {
      if (!hasSupabaseConfig || !supabase) {
        setStatus('error')
        setMessage('Supabase is not connected yet.')
        return
      }

      const authError = readAuthError()
      if (authError) {
        setStatus('error')
        setMessage(authError)
        return
      }

      const code = new URLSearchParams(window.location.search).get('code')
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (error && !cancelled) {
          setStatus('error')
          setMessage(error.message)
          return
        }
      }

      const { data, error } = await supabase.auth.getSession()
      if (cancelled) return

      if (error) {
        setStatus('error')
        setMessage(error.message)
        return
      }

      if (data.session) {
        localStorage.removeItem('accendo-pending-email')
        localStorage.removeItem('accendo-pending-phone')
        onSession(data.session)
        setStatus('success')
        setMessage('Email verified. Taking you to Accendo…')
        window.history.replaceState({}, '', '/')
        return
      }

      setStatus('signin')
      setMessage('Email verified. Please sign in to continue.')
      window.history.replaceState({}, '', '/')
    }

    finishVerification()
    return () => {
      cancelled = true
    }
  }, [onSession])

  async function resendConfirmation() {
    if (!email) {
      setStatus('error')
      setMessage('Enter your email address so Accendo can resend the confirmation link.')
      return
    }
    setBusy(true)
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: { emailRedirectTo: getAuthRedirectTo() },
    })
    setBusy(false)
    setStatus(error ? 'error' : 'sent')
    setMessage(error ? error.message : 'Confirmation email resent. Check your inbox and spam folder.')
  }

  const isError = status === 'error'
  const isSuccess = status === 'success'

  return (
    <main className="auth-shell auth-callback-shell">
      <section className="auth-panel">
        <div className="auth-card auth-callback-card">
          <Brand />
          <div className={`auth-confirmation-icon ${isError ? 'error' : isSuccess ? 'success' : ''}`}>
            {isError ? <AlertCircle /> : isSuccess ? <CheckCircle /> : <Mail />}
          </div>
          <span className="eyebrow">EMAIL VERIFICATION</span>
          <h2>{isError ? 'Verification link problem' : isSuccess ? 'Email verified' : 'Finishing sign in'}</h2>
          <p>{isError ? friendlyError : message}</p>

          {isError && (
            <div className="auth-callback-resend">
              <label>Email address<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" /></label>
              <button className="primary-button auth-submit" onClick={resendConfirmation} disabled={busy}>
                <RefreshCw size={17} />
                {busy ? 'Sending…' : 'Resend confirmation email'}
              </button>
            </div>
          )}

          {status === 'signin' && (
            <button className="primary-button auth-submit" onClick={() => window.location.assign('/')}>Go to sign in</button>
          )}
        </div>
      </section>
    </main>
  )
}
