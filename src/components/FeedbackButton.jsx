import { useMemo, useState } from 'react'
import { Check, MessageSquare, Send, X } from 'lucide-react'
import { supabase } from '../supabase'

const feedbackCategories = [
  { value: 'bug', label: 'Bug' },
  { value: 'confusing_lesson', label: 'Confusing lesson' },
  { value: 'feature_request', label: 'Feature request' },
  { value: 'general_comment', label: 'General comment' },
]

function saveLocalFeedback(entry) {
  const current = JSON.parse(localStorage.getItem('accendo-feedback') || '[]')
  localStorage.setItem('accendo-feedback', JSON.stringify([entry, ...current].slice(0, 100)))
}

export default function FeedbackButton({ profile, session, page = 'unknown', variant = 'topbar' }) {
  const [open, setOpen] = useState(false)
  const [category, setCategory] = useState('bug')
  const [message, setMessage] = useState('')
  const [context, setContext] = useState('')
  const [status, setStatus] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const selectedLabel = useMemo(
    () => feedbackCategories.find((item) => item.value === category)?.label || 'Feedback',
    [category],
  )

  const mailtoHref = useMemo(() => {
    const subject = encodeURIComponent(`Accendo feedback: ${selectedLabel}`)
    const body = encodeURIComponent([
      message,
      '',
      context ? `Context: ${context}` : '',
      `Page: ${page}`,
      profile?.email ? `User email: ${profile.email}` : '',
    ].filter(Boolean).join('\n'))
    return `mailto:support@example.com?subject=${subject}&body=${body}`
  }, [context, message, page, profile?.email, selectedLabel])

  async function submitFeedback(event) {
    event.preventDefault()
    if (!message.trim()) {
      setStatus('Add a quick note so we know what to improve.')
      return
    }

    const entry = {
      id: crypto.randomUUID?.() || String(Date.now()),
      category,
      message: message.trim(),
      context: context.trim(),
      page,
      userEmail: profile?.email || session?.user?.email || '',
      userName: profile?.name || '',
      userAgent: navigator.userAgent,
      createdAt: new Date().toISOString(),
    }

    setSubmitting(true)
    let sentToCloud = false
    if (supabase && session) {
      const { error } = await supabase.from('feedback').insert({
        user_id: session.user.id,
        category: entry.category,
        message: entry.message,
        context: entry.context || null,
        page: entry.page,
        user_agent: entry.userAgent,
      })
      sentToCloud = !error
    }

    saveLocalFeedback(entry)
    setSubmitting(false)
    setStatus(sentToCloud ? 'Feedback sent. Thank you — this helps shape Accendo.' : 'Feedback saved locally. You can also email it with the link below.')
    setMessage('')
    setContext('')
  }

  return (
    <>
      <button
        className={variant === 'settings' ? '' : 'feedback-trigger'}
        type="button"
        onClick={() => {
          setOpen(true)
          setStatus('')
        }}
      >
        {variant === 'settings' ? (
          <>Send Feedback <span>Bugs, confusing lessons, ideas, or comments</span></>
        ) : (
          <><MessageSquare size={18} /><span>Feedback</span></>
        )}
      </button>

      {open && (
        <div className="feedback-overlay" role="presentation">
          <section className="feedback-modal" role="dialog" aria-modal="true" aria-labelledby="feedback-title">
            <button className="feedback-close" type="button" aria-label="Close feedback form" onClick={() => setOpen(false)}>
              <X size={19} />
            </button>
            <div className="feedback-modal-header">
              <span className="eyebrow">HELP IMPROVE ACCENDO</span>
              <h2 id="feedback-title">Send feedback</h2>
              <p>Tell us what felt broken, confusing, useful, or missing. Short notes are perfect.</p>
            </div>
            <form className="feedback-form" onSubmit={submitFeedback}>
              <label>
                What type of feedback is this?
                <select value={category} onChange={(event) => setCategory(event.target.value)}>
                  {feedbackCategories.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                </select>
              </label>
              <label>
                What should we know?
                <textarea
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="Example: The explanation for Treasury STRIPS felt confusing."
                  rows="5"
                />
              </label>
              <label>
                Where did it happen? <span>Optional</span>
                <input
                  value={context}
                  onChange={(event) => setContext(event.target.value)}
                  placeholder="Lesson, question, screen, or anything you remember"
                />
              </label>
              {status && (
                <div className="feedback-status">
                  <Check size={17} />
                  <span>{status}</span>
                </div>
              )}
              <div className="feedback-actions">
                <a href={mailtoHref}>Email instead</a>
                <button className="primary-button" type="submit" disabled={submitting}>
                  <Send size={17} />
                  {submitting ? 'Sending...' : 'Submit feedback'}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </>
  )
}
