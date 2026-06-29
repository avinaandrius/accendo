import { useState } from 'react'
import { BookOpen, ChevronRight, Flame, Gauge } from 'lucide-react'
import { Brand } from '../components/layout'
import { hasSupabaseConfig, supabase, supabaseConfigError } from '../supabase'

export default function AuthScreen({ onDemo }) {
  const [mode, setMode] = useState('signup')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(event) {
    event.preventDefault()
    if (!hasSupabaseConfig) {
      setMessage('Connect Supabase to enable real accounts, or enter the demo.')
      return
    }
    setBusy(true)
    setMessage('')
    const result = mode === 'signup'
      ? await supabase.auth.signUp({
          email,
          password,
          options: { data: { name: name || 'SIE Candidate' } },
        })
      : await supabase.auth.signInWithPassword({ email, password })
    setBusy(false)
    if (result.error) setMessage(result.error.message)
    else if (mode === 'signup' && !result.data.session) {
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
          <p>Short lessons, active recall, and steady momentum—built around the SIE.</p>
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
          <span className="eyebrow">{mode === 'signup' ? 'START YOUR STUDY PATH' : 'WELCOME BACK'}</span>
          <h2>{mode === 'signup' ? 'Create your account' : 'Sign in to Accendo'}</h2>
          <p>{mode === 'signup' ? 'Your first lesson is only a minute away.' : 'Pick up where you left off.'}</p>
          <form onSubmit={submit}>
            {mode === 'signup' && <label>Name<input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" /></label>}
            <label>Email<input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" /></label>
            <label>Password<input required minLength="6" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" /></label>
            {message && <div className="auth-message">{message}</div>}
            <button className="primary-button auth-submit" disabled={busy}>{busy ? 'One moment…' : mode === 'signup' ? 'Create account' : 'Sign in'}<ChevronRight size={18} /></button>
          </form>
          <button className="auth-switch" onClick={() => { setMode(mode === 'signup' ? 'signin' : 'signup'); setMessage('') }}>
            {mode === 'signup' ? 'Already have an account? Sign in' : 'New to Accendo? Create an account'}
          </button>
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


