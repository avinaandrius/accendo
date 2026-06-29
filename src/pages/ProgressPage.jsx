import { Flame, Gauge, ShieldCheck, Target, Zap } from 'lucide-react'
import { allLessons } from '../data/curriculum'
import { getReadiness, getStudyInsights, lessonPassed } from '../utils/study'
import { getXpLevel } from '../utils/profileStats'

export default function ProgressPage({ profile }) {
  const totalLessons = allLessons.length
  const insights = getStudyInsights(profile)
  const checkIns = insights.checkIns
  const passedCheckIns = insights.passedCheckIns
  const readiness = insights.readiness
  const accuracy = insights.accuracy
  const xpLevel = getXpLevel(profile.xp)
  const lessonsToday = insights.lessonsToday
  const dailyProgress = insights.dailyProgress
  return (
    <main className="page">
      <section className="page-title">
        <span className="eyebrow">YOUR MOMENTUM</span>
        <h1>Progress</h1>
        <p>Your readiness score changes as you complete lessons, pass check-ins, improve accuracy, keep streaks, and clear mistakes.</p>
      </section>
      <div className="metric-grid">
        <div className="metric-card readiness-metric"><Gauge /><span>SIE readiness</span><strong>{readiness}%</strong><small>Completion, accuracy, and consistency</small></div>
        <div className="metric-card warm"><Flame /><span>Current streak</span><strong>{profile.streak} days</strong><small>Personal best: 4 days</small></div>
        <div className="metric-card purple"><Zap /><span>XP level</span><strong>Level {xpLevel.level}</strong><small>{xpLevel.nextLevelXp - xpLevel.currentLevelXp} XP to next level</small></div>
        <div className="metric-card green"><Target /><span>Question accuracy</span><strong>{accuracy}%</strong><small>{profile.mistakes.length} mistakes to review</small></div>
      </div>
      <section className="readiness-panel">
        <div>
          <span className="eyebrow">PASS READINESS</span>
          <h2>{readiness >= 75 ? 'You are trending toward test-ready.' : readiness >= 45 ? 'You are building the base.' : 'Start with consistency and core concepts.'}</h2>
          <p>Accendo estimates readiness from completed SIE lessons, 80%+ check-in mastery, question accuracy, streak consistency, and unresolved mistakes.</p>
        </div>
        <div className="readiness-bars">
          <div><span>Lessons completed</span><strong>{Math.round((profile.completed.length / totalLessons) * 100)}%</strong><div><i style={{ width: `${(profile.completed.length / totalLessons) * 100}%` }} /></div></div>
          <div><span>Check-in mastery</span><strong>{passedCheckIns}/{checkIns.length}</strong><div><i style={{ width: `${(passedCheckIns / checkIns.length) * 100}%` }} /></div></div>
          <div><span>Question accuracy</span><strong>{accuracy}%</strong><div><i style={{ width: `${accuracy}%` }} /></div></div>
          <div><span>Daily goal</span><strong>{lessonsToday}/{profile.dailyGoal || 1}</strong><div><i style={{ width: `${dailyProgress}%` }} /></div></div>
          <div><span>Mistake review</span><strong>{Math.max(100 - profile.mistakes.length * 8, 0)}%</strong><div><i style={{ width: `${Math.max(100 - profile.mistakes.length * 8, 0)}%` }} /></div></div>
        </div>
      </section>
      <section className="progress-focus-grid">
        <div className="focus-card">
          <span className="eyebrow">RECOMMENDED NEXT</span>
          <h2>{insights.weakestTopics.length ? 'Review your weakest topic' : insights.nextLesson.title}</h2>
          <p>{insights.weakestTopics.length ? `${insights.weakestTopics[0][0]} has ${insights.weakestTopics[0][1]} missed question${insights.weakestTopics[0][1] === 1 ? '' : 's'} waiting in Practice.` : `${insights.nextLesson.detail} is your next unlocked lesson.`}</p>
        </div>
        <div className="focus-card">
          <span className="eyebrow">WEAKEST TOPICS</span>
          {insights.weakestTopics.length ? insights.weakestTopics.map(([topic, count]) => (
            <div className="mini-topic" key={topic}><strong>{topic}</strong><span>{count} misses</span></div>
          )) : <p>No weak topics yet. Keep answering questions to reveal your study pattern.</p>}
        </div>
      </section>
      <section className="progress-panel">
        <div>
          <span className="eyebrow">THIS WEEK</span>
          <h2>Study activity</h2>
        </div>
        <div className="week-bars">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
            <div key={`${day}-${index}`}>
              <div className={`bar ${index < profile.streak ? 'filled' : ''}`} style={{ height: `${index < profile.streak ? [42, 68, 54, 86][index] : 12}%` }} />
              <span>{day}</span>
            </div>
          ))}
        </div>
      </section>
      <section className="achievement-panel">
        <div className="achievement-icon"><ShieldCheck /></div>
        <div><span className="eyebrow">LATEST ACHIEVEMENT</span><h2>Momentum Maker</h2><p>Completed lessons on four consecutive days.</p></div>
        <span className="achievement-date">Unlocked today</span>
      </section>
    </main>
  )
}

