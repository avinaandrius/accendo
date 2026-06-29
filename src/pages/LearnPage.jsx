import { BookOpen, Brain, Check, ChevronRight, Lock, RotateCcw, Zap } from 'lucide-react'
import { allLessons, curriculum } from '../data/curriculum'
import { getRecommendation, getReadiness, getStudyInsights, lessonIsUnlocked } from '../utils/study'
import { getXpLevel } from '../utils/profileStats'

export default function LearnPage({ profile, onStart, onReview }) {
  const completedCount = profile.completed.length
  const insights = getStudyInsights(profile)
  const nextLesson = insights.nextLesson
  const nextUnit = curriculum.find((unit) => unit.lessons.some((item) => item.id === nextLesson.id)) || curriculum[0]
  const readiness = insights.readiness
  const xpLevel = getXpLevel(profile.xp)
  const recommendation = getRecommendation(profile)
  const lessonsToday = insights.lessonsToday
  const dailyProgress = insights.dailyProgress

  return (
    <main className="page">
      <section className="welcome hero-status">
        <div className="hero-copy">
          <span className="eyebrow">GOOD EVENING, {profile.name}</span>
          <h1>{insights.statusMessage}</h1>
          <p>{readiness >= 75 ? 'You’re trending toward test-ready. Keep accuracy high and review mistakes.' : `You’re ${insights.lessonsRemaining} lesson${insights.lessonsRemaining === 1 ? '' : 's'} away from completing the SIE path.`}</p>
          <button className="primary-button hero-primary" onClick={() => onStart(nextLesson)}>
            Start next lesson <ChevronRight size={18} />
          </button>
        </div>
        <div className="readiness">
          <div className="readiness-ring" style={{ background: `conic-gradient(var(--green) 0 ${readiness}%, #e2ded4 ${readiness}% 100%)` }}>
            <span>{readiness}%</span>
          </div>
          <div>
            <span>Exam readiness</span>
            <strong>Building momentum</strong>
          </div>
        </div>
      </section>

      <section className="study-dashboard">
        <div className="goal-card">
          <div className="goal-card-header">
            <span className="eyebrow">TODAY'S GOAL</span>
            <strong>{lessonsToday}/{profile.dailyGoal || 1} lessons</strong>
          </div>
          <div className="soft-progress"><span style={{ width: `${dailyProgress}%` }} /></div>
          <p>{dailyProgress >= 100 ? 'Goal complete. Nice controlled reps today.' : 'Finish your daily goal to protect the habit.'}</p>
        </div>
        <div className="goal-card">
          <div className="goal-card-header">
            <span className="eyebrow">XP LEVEL</span>
            <strong>Level {xpLevel.level}</strong>
          </div>
          <div className="soft-progress purple"><span style={{ width: `${xpLevel.currentLevelXp}%` }} /></div>
          <p>{xpLevel.nextLevelXp - xpLevel.currentLevelXp} XP until {xpLevel.label} grows stronger.</p>
        </div>
        <div className="goal-card">
          <div className="goal-card-header">
            <span className="eyebrow">COURSE</span>
            <strong>{insights.courseCompletion}%</strong>
          </div>
          <div className="soft-progress orange"><span style={{ width: `${insights.courseCompletion}%` }} /></div>
          <p>{completedCount} of {allLessons.length} lessons and check-ins complete.</p>
        </div>
        <div className="goal-card">
          <div className="goal-card-header">
            <span className="eyebrow">READINESS</span>
            <strong>{readiness}/100</strong>
          </div>
          <div className="soft-progress teal"><span style={{ width: `${readiness}%` }} /></div>
          <p>Driven by completion, accuracy, check-ins, streaks, and mistake review.</p>
        </div>
      </section>

      <section className="recommendation-card">
        <div className="recommendation-icon"><Brain size={23} /></div>
        <div>
          <span className="eyebrow">PERSONALIZED STUDY RECOMMENDATION</span>
          <h2>{recommendation.title}</h2>
          <p>{recommendation.copy}</p>
        </div>
        <button onClick={() => recommendation.type === 'review' ? onReview() : onStart(recommendation.lesson || nextLesson)}>
          {recommendation.action} <ChevronRight size={17} />
        </button>
      </section>

      {profile.mistakes.length > 0 && (
        <button className="mistake-review-card" onClick={onReview}>
          <div><RotateCcw size={22} /></div>
          <span><small>MISTAKE REVIEW</small><strong>{profile.mistakes.length} concept{profile.mistakes.length === 1 ? '' : 's'} ready to retry</strong></span>
          <ChevronRight size={19} />
        </button>
      )}

      <section className="continue-card">
        <div className="continue-icon"><BookOpen size={28} /></div>
        <div className="continue-copy">
          <span className="eyebrow">UP NEXT · UNIT {nextUnit.unit}</span>
          <h2>{nextLesson.title}</h2>
          <p>{nextLesson.isCheckIn ? `${nextLesson.detail}. Passing score: ${nextLesson.passingScore}%` : nextLesson.detail}</p>
        </div>
        <div className="continue-action">
          <span><Zap size={16} fill="currentColor" /> +{nextLesson.xp} XP</span>
          <button onClick={() => onStart(nextLesson)}>Start lesson <ChevronRight size={18} /></button>
        </div>
      </section>

      <div className="section-heading">
        <div>
          <span className="eyebrow">THE ESSENTIALS</span>
          <h2>Your learning path</h2>
        </div>
        <p>{completedCount} of {allLessons.length} lessons complete</p>
      </div>

      <div className="units">
        {curriculum.map((unit) => (
          <section className="unit" key={unit.unit}>
            <div className="unit-header" style={{ '--unit-color': unit.color }}>
              <div className="unit-number">0{unit.unit}</div>
              <div>
                <span>UNIT {unit.unit}</span>
                <h3>{unit.title}</h3>
                <p>{unit.description}</p>
              </div>
              <div className="unit-progress">
                <strong>{unit.lessons.filter((l) => profile.completed.includes(l.id)).length}/{unit.lessons.length}</strong>
                <span>complete</span>
              </div>
              <div className="unit-progress-line"><span style={{ width: `${(unit.lessons.filter((l) => profile.completed.includes(l.id)).length / unit.lessons.length) * 100}%` }} /></div>
            </div>
            <div className="lesson-list">
              {unit.lessons.map((lesson, lessonIndex) => {
                const complete = profile.completed.includes(lesson.id)
                const locked = !lessonIsUnlocked(lesson.id, profile)
                const attemptScore = profile.lessonAttempts?.[lesson.id]?.score
                return (
                  <button
                    className={`lesson-row ${complete ? 'complete' : ''} ${locked ? 'locked' : ''}`}
                    key={lesson.id}
                    onClick={() => !locked && onStart(lesson)}
                  >
                    <div className="lesson-state" style={{ '--unit-color': unit.color }}>
                      {complete ? <Check size={20} /> : locked ? <Lock size={17} /> : lessonIndex + 1}
                    </div>
                    <div className="lesson-copy">
                      <strong>{lesson.title}{lesson.isCheckIn ? ' · Check-In' : ''}</strong>
                      <span>{locked ? 'Pass the previous check-in or complete the previous lesson to unlock' : attemptScore && lesson.isCheckIn && attemptScore < 80 ? `Last score ${attemptScore}%. Retake to reach 80%.` : lesson.detail}</span>
                    </div>
                    <span className={`status-chip ${complete ? 'done' : locked ? 'locked' : 'available'}`}>{complete ? 'Completed' : locked ? 'Locked' : 'Available'}</span>
                    <span className="lesson-xp"><Zap size={14} /> {lesson.isCheckIn ? `${lesson.questions.length} Q` : `${lesson.xp} XP`}</span>
                    <ChevronRight className="lesson-arrow" size={19} />
                  </button>
                )
              })}
            </div>
          </section>
        ))}
      </div>
    </main>
  )
}

