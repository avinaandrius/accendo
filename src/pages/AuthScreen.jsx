import { useEffect, useState } from 'react'
import { BookOpen, ChevronRight, Flame, Gauge, Mail } from 'lucide-react'
import { Brand } from '../components/layout'
import { getAuthRedirectTo, hasSupabaseConfig, supabase, supabaseConfigError } from '../supabase'
import { isValidPhoneNumber, normalizePhoneNumber } from '../utils/phone'

export default function AuthScreen({ onDemo }) {
  const [mode, setMode] = useState('signup')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('error')
  const [busy, setBusy] = useState(false)
  const [signupSent, setSignupSent] = useState(false)

  useEffect(() => {
    const storedMessage = localStorage.getItem('accendo-auth-message')
    if (storedMessage) {
      setMode('signin')
      setMessageType('error')
      setMessage(storedMessage)
      localStorage.removeItem('accendo-auth-message')
    }
  }, [])

  async function resendConfirmation() {
    if (!hasSupabaseConfig || !email) {
      setMessageType('error')
      setMessage('Enter your email address so Accendo can resend the confirmation link.')
      return
    }
    setBusy(true)
    setMessage('')
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: { emailRedirectTo: getAuthRedirectTo() },
    })
    setBusy(false)
    setMessageType(error ? 'error' : 'success')
    setMessage(error ? error.message : 'Confirmation email resent. Check your inbox and spam folder.')
  }

  async function submit(event) {
    event.preventDefault()
    if (!hasSupabaseConfig) {
      setMessageType('error')
      setMessage('Connect Supabase to enable real accounts, or enter the demo.')
      return
    }
    setBusy(true)
    setMessage('')
    const normalizedPhoneNumber = normalizePhoneNumber(phoneNumber)

    if (mode === 'signup' && !isValidPhoneNumber(normalizedPhoneNumber)) {
      setBusy(false)
      setMessageType('error')
      setMessage('Enter a valid phone number, preferably in E.164 format like +13125551234.')
      return
    }

    if (mode === 'signup') {
      const { data: available, error: availabilityError } = await supabase.rpc('is_phone_number_available', {
        phone_number_to_check: normalizedPhoneNumber,
      })
      if (availabilityError) {
        setBusy(false)
        setMessageType('error')
        setMessage('Accendo could not verify that phone number yet. Please try again.')
        return
      }
      if (available === false) {
        setBusy(false)
        setMessageType('error')
        setMessage('An account already exists with this phone number. Please sign in instead.')
        return
      }
    }

    const result = mode === 'signup'
      ? await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: name || 'SIE Candidate',
              full_name: name || 'SIE Candidate',
              phone_number: normalizedPhoneNumber,
            },
            emailRedirectTo: getAuthRedirectTo(),
          },
        })
      // True phone OTP login requires enabling Supabase phone auth and configuring an SMS provider.
      // Until that is configured, Accendo keeps email/password login as the supported login method.
      : await supabase.auth.signInWithPassword({ email, password })
    setBusy(false)
    if (result.error) {
      setMessageType('error')
      setMessage(result.error.message)
    } else if (mode === 'signup' && !result.data.session) {
      localStorage.setItem('accendo-pending-email', email)
      localStorage.setItem('accendo-pending-phone', normalizedPhoneNumber)
      setSignupSent(true)
      setMessageType('success')
      setMessage('Check your email to confirm your account.')
    }
  }

  return (
    <main className="auth-shell">
      <section className="auth-story">
        <Brand />
        <div className="auth-story-copy">
          <span className="eyebrow">SIE EXAM PREP</span>
          <h1>Make exam prep feel winnable.</h1>
          <p>Short lessons, active recall, and steady momentum — built around the SIE.</p>
          <div className="auth-proof">
            <div><BookOpen /><span><strong>Focused lessons</strong>Master one concept at a time.</span></div>
            <div><Flame /><span><strong>Daily momentum</strong>Build a study rhythm that sticks.</span></div>
            <div><Gauge /><span><strong>Visible progress</strong>Know exactly where you stand.</span></div>
          </div>
        </div>
        <small>Accendo is an independent study tool and is not affiliated with FINRA.</small>
      </section>
      <section className="auth-panel">
        <div className="auth-card">
          <div className="auth-mobile-brand"><Brand /></div>
          {signupSent ? (
            <div className="auth-confirmation-state">
              <div className="auth-confirmation-icon"><Mail /></div>
              <span className="eyebrow">CHECK YOUR EMAIL</span>
              <h2>Confirm your Accendo account</h2>
              <p>We sent a verification link to <strong>{email}</strong>. Open it on this device to finish signing in and continue to onboarding.</p>
              {message && <div className={`auth-message ${messageType === 'success' ? 'success' : ''}`}>{message}</div>}
              <button className="primary-button auth-submit" type="button" onClick={resendConfirmation} disabled={busy}>
                {busy ? 'Sending…' : 'Resend confirmation email'}
              </button>
              <button className="auth-switch" type="button" onClick={() => { setSignupSent(false); setMode('signin'); setMessage('') }}>
                Already verified? Sign in
              </button>
            </div>
          ) : (
            <>
              <span className="eyebrow">{mode === 'signup' ? 'START YOUR STUDY PATH' : 'WELCOME BACK'}</span>
              <h2>{mode === 'signup' ? 'Create your account' : 'Sign in to Accendo'}</h2>
              <p>{mode === 'signup' ? 'Your first lesson is only a minute away.' : 'Pick up where you left off.'}</p>
              <form onSubmit={submit}>
                {mode === 'signup' && <label>Name<input required value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" /></label>}
                <label>Email<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" /></label>
                {mode === 'signup' && <label>Phone number<input required type="tel" inputMode="tel" value={phoneNumber} onChange={(event) => setPhoneNumber(event.target.value)} placeholder="+13125551234" /><small>Used to help keep one Accendo account per person.</small></label>}
                <label>Password<input required minLength="6" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 6 characters" /></label>
                {message && <div className={`auth-message ${messageType === 'success' ? 'success' : ''}`}>{message}</div>}
                <button className="primary-button auth-submit" disabled={busy}>{busy ? 'One moment…' : mode === 'signup' ? 'Create account' : 'Sign in'}<ChevronRight size={18} /></button>
              </form>
              <button className="auth-switch" onClick={() => { setMode(mode === 'signup' ? 'signin' : 'signup'); setMessage(''); setSignupSent(false) }}>
                {mode === 'signup' ? 'Already have an account? Sign in' : 'New to Accendo? Create an account'}
              </button>
            </>
          )}
          {!hasSupabaseConfig && (
            <div className="demo-entry">
              <span>{supabaseConfigError}</span>
              <button onClick={onDemo}>Explore the working demo</button>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
