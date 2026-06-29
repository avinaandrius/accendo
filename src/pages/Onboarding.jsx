import { useState } from 'react'
import { Brain, CalendarDays, Check, ChevronRight, Target } from 'lucide-react'
import { Brand } from '../components/layout'

export default function Onboarding({ profile, onComplete }) {
  const [step, setStep] = useState(0)
  const [weeklyGoal, setWeeklyGoal] = useState(profile.weeklyGoal || 5)
  const [dailyGoal, setDailyGoal] = useState(profile.dailyGoal || 1)
  const [examDate, setExamDate] = useState(profile.examDate || '')
  const screens = [
    {
      icon: Brain,
      eyebrow: 'WELCOME TO ACCENDO',
      title: 'Let’s build your SIE plan.',
      copy: 'A few quick choices will shape your daily study path and readiness score.',
    },
    {
      icon: Target,
      eyebrow: 'YOUR STUDY RHYTHM',
      title: 'What is your daily minimum?',
      copy: 'Small daily reps beat panic-studying. Choose a goal you can keep.',
    },
    {
      icon: CalendarDays,
      eyebrow: 'YOUR FINISH LINE',
      title: 'When is your SIE?',
      copy: 'An estimate is perfectly fine. We’ll use it to keep your pace realistic.',
    },
  ]
  const current = screens[step]
  const Icon = current.icon

  function finish() {
    onComplete({ weeklyGoal, dailyGoal, examDate, onboarded: true })
  }

  return (
    <main className="onboarding-shell">
      <header><Brand /><span>{step + 1} of {screens.length}</span></header>
      <div className="onboarding-progress"><span style={{ width: `${((step + 1) / screens.length) * 100}%` }} /></div>
      <section className="onboarding-card">
        <div className="onboarding-icon"><Icon size={34} /></div>
        <span className="eyebrow">{current.eyebrow}</span>
        <h1>{current.title}</h1>
        <p>{current.copy}</p>
        {step === 0 && (
          <div className="onboarding-benefits">
            <div><Check />Daily bite-sized lessons</div>
            <div><Check />Personal mistake review</div>
            <div><Check />A live SIE readiness score</div>
          </div>
        )}
        {step === 1 && (
          <div className="goal-options">
            {[1, 2, 3].map((goal) => (
              <button className={dailyGoal === goal ? 'selected' : ''} key={goal} onClick={() => { setDailyGoal(goal); setWeeklyGoal(goal * 5) }}>
                <strong>{goal}</strong><span>lesson{goal === 1 ? '' : 's'} / day</span>{goal === 1 && <small>Recommended</small>}
              </button>
            ))}
          </div>
        )}
        {step === 2 && (
          <div className="onboarding-date">
            <label>Planned exam date<input type="date" value={examDate} onChange={(event) => setExamDate(event.target.value)} /></label>
            <button className="skip-date" onClick={() => setExamDate('')}>I haven’t scheduled it yet</button>
          </div>
        )}
        <div className="onboarding-actions">
          {step > 0 && <button className="text-button" onClick={() => setStep(step - 1)}>Back</button>}
          <button className="primary-button" onClick={() => step === screens.length - 1 ? finish() : setStep(step + 1)}>
            {step === screens.length - 1 ? 'Start learning' : 'Continue'} <ChevronRight size={18} />
          </button>
        </div>
      </section>
    </main>
  )
}


