import { useState } from 'react'
import { Bell, BookOpen, Brain, Check, ChevronRight, Gauge, LogOut, ShieldCheck, Sparkles, Star, Target, User } from 'lucide-react'
import { supabase } from '../supabase'
import FeedbackButton from '../components/FeedbackButton'

function Toggle({ value, onChange }) {
  return <button className={`toggle ${value ? 'on' : ''}`} onClick={() => onChange(!value)}><span /></button>
}

const legalDocuments = {
  terms: {
    title: 'Terms of Service',
    updated: 'June 27, 2026',
    sections: [
      ['Overview', 'These Terms govern access to Accendo, an independent educational study platform. By creating an account or using the app, a user agrees to use Accendo lawfully, responsibly, and only for personal study purposes unless written permission is granted.'],
      ['Educational disclaimer', 'Accendo is designed as a study aid. Accendo does not guarantee that any user will pass the SIE, Series 6, Series 7, CFA, CPA, MCAT, LSAT, school exam, or any other examination. Study recommendations, readiness scores, explanations, and AI-generated content are educational estimates, not professional, legal, financial, investment, tax, medical, or academic advice.'],
      ['Independence from exam organizations', 'Accendo is an independent educational platform and is not affiliated with or endorsed by FINRA, CFA Institute, AICPA, LSAC, AAMC, College Board, ACT, or any examination organization unless explicitly stated. All exam names and marks belong to their respective owners.'],
      ['Acceptable use', 'Users may not misuse the app, attempt to disrupt the service, scrape content at scale, upload unlawful material, impersonate another person, share account credentials, reverse engineer protected portions of the product, or use Accendo to create competing question banks without permission.'],
      ['Accounts and security', 'Users are responsible for maintaining the confidentiality of login credentials and for activity under their account. Users should use strong passwords and notify support if they suspect unauthorized access. Future security features may include email verification, two-factor authentication, device history, and logout-all-devices tools.'],
      ['Subscriptions and payments', 'Accendo may offer free and paid plans in the future. Paid features, billing cycles, trials, refunds, promo codes, restore purchases, and cancellation terms will be shown before purchase. App store purchases may also be governed by Apple App Store or Google Play billing rules.'],
      ['Content ownership', 'The app interface, explanations, curriculum structure, generated lessons, trademarks, logos, and original content are owned by Accendo or its licensors. Users retain rights to personal information they provide, subject to the license needed for Accendo to operate the app.'],
      ['AI-generated content', 'AI may be used to generate explanations, quizzes, study recommendations, and tutoring responses. AI-generated content may occasionally be incomplete, outdated, or inaccurate. Users should verify important financial or exam information with official sources and report suspected inaccuracies.'],
      ['Account termination', 'Accendo may suspend or terminate accounts that violate these Terms, create security risk, infringe intellectual property, abuse other users, or misuse the service. Users may request account deletion from Settings.'],
      ['Limitation of liability', 'To the fullest extent permitted by law, Accendo is not liable for indirect, incidental, consequential, special, punitive, or exam-outcome damages, including lost opportunities, failed exams, lost revenue, lost data, or reliance on incorrect study content.'],
      ['Changes to terms', 'Accendo may update these Terms as the product evolves. Material changes should be communicated in-app, by email, or through release notes. Continued use after changes means acceptance of the updated Terms.'],
      ['Contact', 'For legal, support, privacy, or content accuracy concerns, contact the support address listed in the app or on the official Accendo website once published.'],
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    updated: 'June 27, 2026',
    sections: [
      ['Overview', 'This Privacy Policy explains what Accendo may collect, why it is collected, how it is used, and what controls users have. This draft is intended for the MVP and should be reviewed by counsel before public launch.'],
      ['Data collected', 'Accendo may collect account data such as name, username, email, authentication identifiers, exam selection, exam date, daily goals, weekly goals, preferred study time, settings, and support requests. It may also store learning data such as lessons completed, answers submitted, incorrect questions, readiness score inputs, streaks, XP, accuracy, and practice history.'],
      ['Why data is used', 'Data is used to authenticate users, save progress, personalize study recommendations, calculate readiness, maintain streaks, review missed questions, improve app quality, provide support, protect security, and comply with legal or platform obligations.'],
      ['Third parties', 'Accendo currently uses Supabase/Firebase-style infrastructure for authentication and database storage when configured. Future versions may use analytics, crash reporting, payment processors, AI providers, email delivery, or app-store billing providers. Third-party providers should only receive data needed to provide their services.'],
      ['AI usage', 'If AI features are enabled, study activity, missed topics, prompts, or user questions may be sent to an AI provider to generate explanations, quizzes, tutoring, or recommendations. Accendo should avoid sending unnecessary sensitive personal information to AI systems.'],
      ['Analytics', 'Future analytics may measure daily active users, lessons started, lessons completed, questions answered, accuracy by topic, average session length, retention, missed questions, drop-off points, and streak retention. Analytics should be used to improve learning effectiveness and product reliability.'],
      ['Retention', 'Account and progress data may be kept while the account is active. If a user deletes an account or requests deletion, Accendo should delete or de-identify personal data unless retention is required for security, legal compliance, dispute resolution, financial records, or backup integrity.'],
      ['User controls', 'Users may update profile details, notification settings, privacy settings, learning preferences, AI personalization, and appearance settings. Users may request data download, data deletion, or account deletion from Settings.'],
      ['Security', 'Accendo should use reasonable administrative, technical, and organizational safeguards appropriate for a study app, including authenticated access, row-level security, and limited data access. No online service can guarantee absolute security.'],
      ['Children', 'Accendo is intended for users old enough to prepare for securities and other exams. If future versions target younger students, additional child privacy review and parental consent workflows may be required.'],
      ['International users', 'Users may have privacy rights depending on location, including rights to access, correct, delete, export, or restrict use of personal data. Accendo should honor applicable requests where legally required.'],
      ['Contact', 'Privacy questions, account deletion requests, and data requests should be sent through the support channel listed in Settings or on the official Accendo website once published.'],
    ],
  },
}

function daysUntilUsernameChange(profile) {
  if (!profile.usernameLastChangedAt) return 0
  const elapsed = Date.now() - new Date(profile.usernameLastChangedAt).getTime()
  return Math.max(0, 30 - Math.floor(elapsed / (1000 * 60 * 60 * 24)))
}

function LegalDocumentPage({ document, onBack }) {
  return (
    <main className="page settings-page">
      <button className="text-button back-link" onClick={onBack}>← Back to Settings</button>
      <section className="page-title">
        <span className="eyebrow">LEGAL</span>
        <h1>{document.title}</h1>
        <p>Last updated: {document.updated}. Draft for Accendo MVP; review with counsel before launch.</p>
      </section>
      <section className="legal-page">
        {document.sections.map(([heading, copy]) => (
          <article key={heading}>
            <h2>{heading}</h2>
            <p>{copy}</p>
          </article>
        ))}
      </section>
    </main>
  )
}

export default function SettingsPage({ profile, setProfile, onSignOut, session }) {
  const [saved, setSaved] = useState(false)
  const [legalPage, setLegalPage] = useState(null)
  const [usernameDraft, setUsernameDraft] = useState(profile.username || '')
  const [passwordDraft, setPasswordDraft] = useState('')
  const [settingsMessage, setSettingsMessage] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [openCategory, setOpenCategory] = useState('account')
  const usernameWaitDays = daysUntilUsernameChange(profile)
  const canChangeUsername = usernameWaitDays === 0 || usernameDraft === profile.username

  function updateField(field, value) {
    setProfile((current) => ({ ...current, [field]: value }))
    setSaved(false)
  }

  function updateNested(group, field, value) {
    setProfile((current) => ({ ...current, [group]: { ...current[group], [field]: value } }))
    setSaved(false)
  }

  async function saveProfile() {
    if (usernameDraft !== profile.username) {
      if (!canChangeUsername) {
        setSettingsMessage(`You can change your username again in ${usernameWaitDays} day${usernameWaitDays === 1 ? '' : 's'}.`)
        return
      }
      setProfile((current) => ({ ...current, username: usernameDraft, usernameLastChangedAt: new Date().toISOString() }))
    }
    setSaved(true)
    setSettingsMessage('Settings saved.')
  }

  async function sendPasswordReset() {
    if (!supabase || !profile.email) {
      setSettingsMessage('Connect Supabase to send password reset emails.')
      return
    }
    const { error } = await supabase.auth.resetPasswordForEmail(profile.email)
    setSettingsMessage(error ? error.message : 'Password reset email sent.')
  }

  async function changePassword() {
    if (!supabase || !session) {
      setSettingsMessage('Sign in with Supabase to change your password.')
      return
    }
    if (passwordDraft.length < 6) {
      setSettingsMessage('Password must be at least 6 characters.')
      return
    }
    const { error } = await supabase.auth.updateUser({ password: passwordDraft })
    setPasswordDraft('')
    setSettingsMessage(error ? error.message : 'Password updated.')
  }

  async function deleteAccountData() {
    if (!confirmDelete) {
      setConfirmDelete(true)
      setSettingsMessage('Tap Delete account data again to confirm.')
      return
    }
    if (supabase && session) {
      await supabase.from('lesson_progress').delete().eq('user_id', session.user.id)
      await supabase.from('profiles').delete().eq('id', session.user.id)
      setSettingsMessage('Your Accendo profile data was deleted. Full auth-user deletion requires a secure server-side Supabase function before launch.')
      await onSignOut()
      return
    }
    localStorage.removeItem('accendo-profile')
    localStorage.removeItem('examed-profile')
    window.location.reload()
  }

  if (legalPage) return <LegalDocumentPage document={legalDocuments[legalPage]} onBack={() => setLegalPage(null)} />

  return (
    <main className="page settings-page">
      <section className="page-title">
        <span className="eyebrow">YOUR ACCOUNT</span>
        <h1>Settings</h1>
        <p>Control your account, study preferences, privacy, AI settings, legal documents, and data rights.</p>
      </section>
      <section className={`settings-section ${openCategory === 'account' ? 'open' : ''}`}>
        <button className="settings-label settings-category-trigger" onClick={() => setOpenCategory(openCategory === 'account' ? '' : 'account')}><User /><div><h2>Account Settings</h2><p>Profile, username, email, password, and account deletion.</p></div><ChevronRight /></button>
        <div className="settings-form">
          <label>Display name<input value={profile.name} onChange={(e) => updateField('name', e.target.value)} /></label>
          <label>Username<div className="prefixed-input"><span>@</span><input value={usernameDraft} disabled={!canChangeUsername && usernameDraft !== profile.username} onChange={(e) => setUsernameDraft(e.target.value)} /></div><small>{usernameWaitDays ? `Username can be changed again in ${usernameWaitDays} day${usernameWaitDays === 1 ? '' : 's'}.` : 'You can change your username once every 30 days.'}</small></label>
          <label>Email address<input type="email" value={profile.email} onChange={(e) => updateField('email', e.target.value)} /></label>
          <label>Profile picture<input disabled placeholder="Future profile photo upload" /></label>
          <label>New password<input type="password" value={passwordDraft} onChange={(e) => setPasswordDraft(e.target.value)} placeholder="At least 6 characters" /></label>
          <div className="settings-inline-actions">
            <button type="button" onClick={sendPasswordReset}>Send reset email</button>
            <button type="button" onClick={changePassword}>Change password</button>
          </div>
        </div>
      </section>
      <section className={`settings-section ${openCategory === 'study' ? 'open' : ''}`}>
        <button className="settings-label settings-category-trigger" onClick={() => setOpenCategory(openCategory === 'study' ? '' : 'study')}><Target /><div><h2>Study Preferences</h2><p>Make the study path fit your exam and routine.</p></div><ChevronRight /></button>
        <div className="settings-form">
          <label>Current exam<select value={profile.currentExam} onChange={(e) => updateField('currentExam', e.target.value)}><option>SIE</option><option>Series 6</option><option>Series 7</option><option>CFA</option><option>CPA</option><option>MCAT</option><option>LSAT</option></select></label>
          <label>Daily lesson goal<select value={profile.dailyGoal || 1} onChange={(e) => updateField('dailyGoal', Number(e.target.value))}><option value="1">1 lesson per day</option><option value="2">2 lessons per day</option><option value="3">3 lessons per day</option></select></label>
          <label>Weekly lesson goal<select value={profile.weeklyGoal} onChange={(e) => updateField('weeklyGoal', Number(e.target.value))}><option value="3">3 lessons per week</option><option value="5">5 lessons per week</option><option value="7">7 lessons per week</option><option value="10">10 lessons per week</option><option value="15">15 lessons per week</option></select></label>
          <label>Planned exam date<input type="date" value={profile.examDate || ''} onChange={(e) => updateField('examDate', e.target.value)} /></label>
          <label>Preferred study time<select value={profile.preferredStudyTime} onChange={(e) => updateField('preferredStudyTime', e.target.value)}><option>Morning</option><option>Afternoon</option><option>Evening</option><option>Late night</option></select></label>
          <label>Difficulty preference<select value={profile.difficultyPreference} onChange={(e) => updateField('difficultyPreference', e.target.value)}><option>Beginner</option><option>Standard</option><option>Exam Simulation</option></select></label>
          <label>Daily reminder time<input type="time" value={profile.dailyReminderTime} onChange={(e) => updateField('dailyReminderTime', e.target.value)} /></label>
        </div>
      </section>
      <section className={`settings-section ${openCategory === 'notifications' ? 'open' : ''}`}>
        <button className="settings-label settings-category-trigger" onClick={() => setOpenCategory(openCategory === 'notifications' ? '' : 'notifications')}><Bell /><div><h2>Notifications</h2><p>Choose what Accendo can nudge you about.</p></div><ChevronRight /></button>
        <div className="settings-toggles">
          <div><div><strong>Daily reminder</strong><span>A gentle nudge at your preferred study time.</span></div><Toggle value={profile.notificationSettings.dailyReminder} onChange={(value) => updateNested('notificationSettings', 'dailyReminder', value)} /></div>
          <div><div><strong>Weekly progress report</strong><span>A weekly summary of lessons, accuracy, and readiness.</span></div><Toggle value={profile.notificationSettings.weeklyReport} onChange={(value) => updateNested('notificationSettings', 'weeklyReport', value)} /></div>
          <div><div><strong>Streak reminder</strong><span>Reminder before your streak is at risk.</span></div><Toggle value={profile.notificationSettings.streakReminder} onChange={(value) => updateNested('notificationSettings', 'streakReminder', value)} /></div>
          <div><div><strong>Friend activity</strong><span>Future social progress and cheer notifications.</span></div><Toggle value={profile.notificationSettings.friendActivity} onChange={(value) => updateNested('notificationSettings', 'friendActivity', value)} /></div>
          <div><div><strong>Product updates</strong><span>New exams, features, and release notes.</span></div><Toggle value={profile.notificationSettings.productUpdates} onChange={(value) => updateNested('notificationSettings', 'productUpdates', value)} /></div>
        </div>
      </section>
      <section className={`settings-section ${openCategory === 'appearance' ? 'open' : ''}`}>
        <button className="settings-label settings-category-trigger" onClick={() => setOpenCategory(openCategory === 'appearance' ? '' : 'appearance')}><Sparkles /><div><h2>Appearance</h2><p>Light mode, dark mode, and accessibility-friendly display options.</p></div><ChevronRight /></button>
        <div className="settings-form">
          <label>Theme<select value={profile.theme} onChange={(e) => updateField('theme', e.target.value)}><option value="light">Light Mode</option><option value="dark">Dark Mode</option><option value="system">System Theme</option></select></label>
          <label>Button size<select value={profile.accessibilitySettings.largerButtons ? 'large' : 'standard'} onChange={(e) => updateNested('accessibilitySettings', 'largerButtons', e.target.value === 'large')}><option value="standard">Standard</option><option value="large">Larger buttons</option></select></label>
        </div>
        <div className="settings-toggles compact-toggles">
          <div><div><strong>Large text</strong><span>Increase text size throughout the app.</span></div><Toggle value={profile.accessibilitySettings.largeText} onChange={(value) => updateNested('accessibilitySettings', 'largeText', value)} /></div>
          <div><div><strong>High contrast</strong><span>Increase contrast for readability.</span></div><Toggle value={profile.accessibilitySettings.highContrast} onChange={(value) => updateNested('accessibilitySettings', 'highContrast', value)} /></div>
          <div><div><strong>Color blind mode</strong><span>Future color-safe progress indicators.</span></div><Toggle value={profile.accessibilitySettings.colorBlindMode} onChange={(value) => updateNested('accessibilitySettings', 'colorBlindMode', value)} /></div>
        </div>
      </section>
      <section className={`settings-section ${openCategory === 'privacy' ? 'open' : ''}`}>
        <button className="settings-label settings-category-trigger" onClick={() => setOpenCategory(openCategory === 'privacy' ? '' : 'privacy')}><ShieldCheck /><div><h2>Privacy Settings</h2><p>Prepare for friend features while keeping control over what others see.</p></div><ChevronRight /></button>
        <div className="settings-form">
          <label>Public profile<select value={profile.privacySettings.profileVisibility} onChange={(e) => updateNested('privacySettings', 'profileVisibility', e.target.value)}><option>Everyone</option><option>Friends Only</option><option>Private</option></select></label>
          <label>Friend requests<select value={profile.privacySettings.friendRequests} onChange={(e) => updateNested('privacySettings', 'friendRequests', e.target.value)}><option>Anyone</option><option>Friends of Friends</option><option>Nobody</option></select></label>
        </div>
        <div className="settings-toggles compact-toggles">
          {[
            ['showXp', 'Show XP', 'Let others see your XP.'],
            ['showStreak', 'Show streak', 'Let others see your streak.'],
            ['showCompletedLessons', 'Show completed lessons', 'Let others see course progress.'],
            ['showExam', 'Show exam', 'Let others see your current exam.'],
            ['showAchievements', 'Show achievements', 'Let others see earned badges.'],
            ['searchableByUsername', 'Search by username', 'Allow people to find you by username.'],
            ['searchableByEmail', 'Search by email', 'Allow people to find you by email.'],
          ].map(([field, title, copy]) => <div key={field}><div><strong>{title}</strong><span>{copy}</span></div><Toggle value={profile.privacySettings[field]} onChange={(value) => updateNested('privacySettings', field, value)} /></div>)}
        </div>
      </section>
      <section className={`settings-section ${openCategory === 'learning' ? 'open' : ''}`}>
        <button className="settings-label settings-category-trigger" onClick={() => setOpenCategory(openCategory === 'learning' ? '' : 'learning')}><Brain /><div><h2>Learning and AI</h2><p>Control review behavior, study mode, and AI personalization.</p></div><ChevronRight /></button>
        <div className="settings-form">
          <label>Study mode<select value={profile.learningSettings.studyMode} onChange={(e) => updateNested('learningSettings', 'studyMode', e.target.value)}><option>Beginner</option><option>Standard</option><option>Exam Simulation</option></select></label>
        </div>
        <div className="settings-toggles compact-toggles">
          <div><div><strong>Review incorrect answers</strong><span>Save wrong answers into Practice Hub.</span></div><Toggle value={profile.learningSettings.reviewIncorrect} onChange={(value) => updateNested('learningSettings', 'reviewIncorrect', value)} /></div>
          <div><div><strong>Repeat missed questions</strong><span>Surface missed concepts multiple times.</span></div><Toggle value={profile.learningSettings.repeatMissed} onChange={(value) => updateNested('learningSettings', 'repeatMissed', value)} /></div>
          <div><div><strong>Enable AI explanations</strong><span>Use AI-assisted explanations when available.</span></div><Toggle value={profile.learningSettings.aiExplanations} onChange={(value) => updateNested('learningSettings', 'aiExplanations', value)} /></div>
          <div><div><strong>Reduce motion</strong><span>Minimize animations and movement.</span></div><Toggle value={profile.learningSettings.reduceMotion} onChange={(value) => updateNested('learningSettings', 'reduceMotion', value)} /></div>
          <div><div><strong>Personalized explanations</strong><span>AI adapts explanations to your weak topics.</span></div><Toggle value={profile.aiSettings.personalizedExplanations} onChange={(value) => updateNested('aiSettings', 'personalizedExplanations', value)} /></div>
          <div><div><strong>Personalized quizzes</strong><span>AI helps generate targeted practice.</span></div><Toggle value={profile.aiSettings.personalizedQuizzes} onChange={(value) => updateNested('aiSettings', 'personalizedQuizzes', value)} /></div>
          <div><div><strong>AI tutor</strong><span>Future conversational study help.</span></div><Toggle value={profile.aiSettings.aiTutor} onChange={(value) => updateNested('aiSettings', 'aiTutor', value)} /></div>
        </div>
      </section>
      <section className={`settings-section ${openCategory === 'data' ? 'open' : ''}`}>
        <button className="settings-label settings-category-trigger" onClick={() => setOpenCategory(openCategory === 'data' ? '' : 'data')}><Gauge /><div><h2>Progress and Data</h2><p>Manage progress, exports, and deletion rights.</p></div><ChevronRight /></button>
        <div className="settings-link-list">
          <button>Reset all progress <span>Future confirmation flow</span></button>
          <button>Reset one course <span>Future course selector</span></button>
          <button>Archive completed course <span>Future</span></button>
          <button>Export progress <span>Future CSV / JSON export</span></button>
          <button>Download certificate <span>Future</span></button>
          <button>Download my data <span>Future privacy export</span></button>
          <button onClick={deleteAccountData}>Delete my data / account request <span>{confirmDelete ? 'Tap again to confirm' : 'Deletes profile data now; full auth deletion needs backend'}</span></button>
        </div>
      </section>
      <section className={`settings-section ${openCategory === 'subscription' ? 'open' : ''}`}>
        <button className="settings-label settings-category-trigger" onClick={() => setOpenCategory(openCategory === 'subscription' ? '' : 'subscription')}><Star /><div><h2>Subscription</h2><p>Future-proofing for paid plans.</p></div><ChevronRight /></button>
        <div className="settings-link-list">
          <button>Current plan <span>Free MVP</span></button>
          <button>Billing <span>Future</span></button>
          <button>Upgrade <span>Future</span></button>
          <button>Restore purchases <span>Future app-store flow</span></button>
          <button>Promo code <span>Future</span></button>
        </div>
      </section>
      <section className={`settings-section ${openCategory === 'support' ? 'open' : ''}`}>
        <button className="settings-label settings-category-trigger" onClick={() => setOpenCategory(openCategory === 'support' ? '' : 'support')}><BookOpen /><div><h2>Legal and Trust Center</h2><p>Help, trust, disclaimers, content accuracy, and AI transparency.</p></div><ChevronRight /></button>
        <div className="settings-link-list">
          <button>Help Center <span>Future support site</span></button>
          <button>FAQ <span>Future</span></button>
          <button>Contact Support <span>support@example.com placeholder</span></button>
          <FeedbackButton profile={profile} session={session} page="settings" variant="settings" />
          <button>Rate App <span>Future app-store prompt</span></button>
          <button>Educational Disclaimer <span>Study aid only; no exam outcome guarantee</span></button>
          <button>AI Content Disclaimer <span>AI may be inaccurate; verify important facts</span></button>
          <button>Not affiliated with FINRA <span>Independent educational platform</span></button>
          <button>Our educational philosophy <span>Mastery, repetition, and readiness gates</span></button>
          <button>How AI generates explanations <span>AI can be wrong; verify important facts</span></button>
          <button>Report an inaccurate question <span>Future content review queue</span></button>
          <button>Content update history <span>Future release log</span></button>
        </div>
      </section>
      <section className={`settings-section ${openCategory === 'security' ? 'open' : ''}`}>
        <button className="settings-label settings-category-trigger" onClick={() => setOpenCategory(openCategory === 'security' ? '' : 'security')}><ShieldCheck /><div><h2>Security</h2><p>Security controls planned for launch readiness.</p></div><ChevronRight /></button>
        <div className="settings-link-list">
          <button>Email verification <span>Handled through auth provider</span></button>
          <button>Two-factor authentication <span>Future</span></button>
          <button>Recent login history <span>Future</span></button>
          <button>Devices logged in <span>Future</span></button>
          <button>Log out all devices <span>Future auth-provider flow</span></button>
        </div>
      </section>
      <section className={`settings-section ${openCategory === 'legal' ? 'open' : ''}`}>
        <button className="settings-label settings-category-trigger" onClick={() => setOpenCategory(openCategory === 'legal' ? '' : 'legal')}><BookOpen /><div><h2>Legal and About</h2><p>Privacy, terms, disclosures, versioning, and copyright.</p></div><ChevronRight /></button>
        <div className="settings-link-list">
          <button onClick={() => setLegalPage('privacy')}>Privacy Policy <span>Data collection, AI, deletion, retention</span></button>
          <button onClick={() => setLegalPage('terms')}>Terms of Service <span>Use rules, disclaimers, liability</span></button>
          <button>Release Notes <span>Coming soon</span></button>
          <button>Open Source Licenses <span>React, Vite, Supabase client, Lucide</span></button>
          <button>Version Number <span>0.1.0 MVP</span></button>
          <button>Copyright <span>© 2026 Accendo. All rights reserved.</span></button>
        </div>
      </section>
      <div className="settings-actions">
        {(saved || settingsMessage) && <span className="saved-message"><Check size={17} /> {settingsMessage || 'Changes saved'}</span>}
        <button className="primary-button" onClick={saveProfile}>Save changes</button>
      </div>
      <section className="danger-zone">
        <div><LogOut /><div><strong>Sign out</strong><span>You can sign back in at any time.</span></div></div>
        <button onClick={onSignOut}>Sign out</button>
      </section>
    </main>
  )
}
