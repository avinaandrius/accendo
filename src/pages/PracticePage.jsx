import { BookOpen, Brain, ChevronRight, Gauge, RotateCcw, Zap } from 'lucide-react'
import { allLessons } from '../data/curriculum'
import { getStudyInsights } from '../utils/study'

export default function PracticePage({ profile, onReview, onStart }) {
  const weakCheckIns = allLessons.filter((lesson) => lesson.isCheckIn && profile.lessonAttempts?.[lesson.id]?.score < (lesson.passingScore || 80))
  const insights = getStudyInsights(profile)
  const topicCounts = profile.mistakes.reduce((groups, mistake) => {
    const topic = mistake.topicTitle || mistake.unitTitle || 'SIE fundamentals'
    groups[topic] = (groups[topic] || 0) + 1
    return groups
  }, {})
  const weakTopics = Object.entries(topicCounts).sort((a, b) => b[1] - a[1])

  return (
    <main className="page">
      <section className="page-title">
        <span className="eyebrow">PRACTICE HUB</span>
        <h1>Review what needs another rep.</h1>
        <p>Every missed question is saved here so weak spots become targeted practice instead of guesswork.</p>
      </section>

      <div className="practice-action-grid">
        <button className="practice-action-card active" onClick={onReview} disabled={profile.mistakes.length === 0}>
          <RotateCcw /><span><strong>Review Mistakes</strong><small>{profile.mistakes.length ? `${profile.mistakes.length} saved questions` : 'No mistakes yet'}</small></span>
        </button>
        <button className="practice-action-card"><BookOpen /><span><strong>Flashcards</strong><small>Premium placeholder · key terms</small></span></button>
        <button className="practice-action-card"><Gauge /><span><strong>Mock Exam</strong><small>Coming soon · timed SIE set</small></span></button>
        <button className="practice-action-card"><Zap /><span><strong>Quick Practice</strong><small>5-minute review sprint</small></span></button>
        <button className="practice-action-card"><Brain /><span><strong>AI Tutor</strong><small>Explain a concept · future</small></span></button>
      </div>

      <section className="practice-hero">
        <div>
          <span className="eyebrow">TODAY'S BEST PRACTICE</span>
          <h2>{insights.weakestTopics.length ? `Sharpen ${insights.weakestTopics[0][0]}` : 'Build recall before the next lesson'}</h2>
          <p>{insights.weakestTopics.length ? 'Your weakest topic is the fastest place to gain readiness.' : 'Quick practice and flashcards will unlock here as your question history grows.'}</p>
        </div>
        <button className="primary-button" disabled={profile.mistakes.length === 0} onClick={onReview}>
          Review mistakes <ChevronRight size={18} />
        </button>
      </section>

      <div className="practice-grid">
        <section className="practice-panel">
          <div className="practice-panel-header">
            <span className="eyebrow">WEAK TOPICS</span>
            <strong>Prioritize these first</strong>
          </div>
          {weakTopics.length ? weakTopics.map(([topic, count]) => (
            <div className="topic-row" key={topic}>
              <div><strong>{topic}</strong><span>{count} missed question{count === 1 ? '' : 's'}</span></div>
              <div className="topic-meter"><span style={{ width: `${Math.min(count * 22, 100)}%` }} /></div>
            </div>
          )) : <p className="empty-state">No weak topics yet. Missed questions will appear here automatically.</p>}
        </section>

        <section className="practice-panel">
          <div className="practice-panel-header">
            <span className="eyebrow">CHECK-IN RETAKES</span>
            <strong>80% required to advance</strong>
          </div>
          {weakCheckIns.length ? weakCheckIns.map((lesson) => (
            <button className="retake-row" key={lesson.id} onClick={() => onStart(lesson)}>
              <span><strong>{lesson.title}</strong><small>Last score: {profile.lessonAttempts[lesson.id].score}%</small></span>
              <ChevronRight size={18} />
            </button>
          )) : <p className="empty-state">No failed check-ins. Keep proving mastery as you move forward.</p>}
        </section>
      </div>
    </main>
  )
}


