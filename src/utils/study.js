import { allLessons } from '../data/curriculum'

export const todayKey = () => new Date().toISOString().slice(0, 10)

export function lessonPassed(profile, lesson) {
  if (!lesson) return true
  if (!lesson.isCheckIn) return profile.completed.includes(lesson.id)
  return (profile.lessonAttempts?.[lesson.id]?.score || 0) >= (lesson.passingScore || 80)
}

export function lessonIsUnlocked(lessonId, profile) {
  const index = allLessons.findIndex((lesson) => lesson.id === lessonId)
  if (index <= 0) return true
  if (profile.completed.includes(lessonId)) return true
  return lessonPassed(profile, allLessons[index - 1])
}

export function getReadiness(profile) {
  const passedCheckIns = allLessons.filter((lesson) => lesson.isCheckIn && lessonPassed(profile, lesson)).length
  const totalCheckIns = allLessons.filter((lesson) => lesson.isCheckIn).length || 1
  const completion = profile.completed.length / allLessons.length
  const checkInMastery = passedCheckIns / totalCheckIns
  const accuracy = profile.totalQuestions ? profile.correctAnswers / profile.totalQuestions : 0
  const consistency = Math.min(profile.streak / 7, 1)
  const mistakeDrag = Math.min(profile.mistakes.length / 12, 0.12)
  return Math.max(0, Math.round((completion * 0.35 + checkInMastery * 0.35 + accuracy * 0.2 + consistency * 0.1 - mistakeDrag) * 100))
}

export function getStudyInsights(profile) {
  const readiness = getReadiness(profile)
  const nextLesson = allLessons.find((lesson) => lessonIsUnlocked(lesson.id, profile) && !profile.completed.includes(lesson.id)) || allLessons[0]
  const courseCompletion = Math.round((profile.completed.length / allLessons.length) * 100)
  const lessonsRemaining = Math.max(allLessons.length - profile.completed.length, 0)
  const accuracy = profile.totalQuestions ? Math.round((profile.correctAnswers / profile.totalQuestions) * 100) : 0
  const checkIns = allLessons.filter((lesson) => lesson.isCheckIn)
  const passedCheckIns = checkIns.filter((lesson) => lessonPassed(profile, lesson)).length
  const topicCounts = profile.mistakes.reduce((groups, mistake) => {
    const topic = mistake.topicTitle || mistake.unitTitle || 'SIE fundamentals'
    groups[topic] = (groups[topic] || 0) + 1
    return groups
  }, {})
  const weakestTopics = Object.entries(topicCounts).sort((a, b) => b[1] - a[1]).slice(0, 4)
  const lessonsToday = profile.lastStudyDate === todayKey() ? profile.lessonsToday : 0
  const dailyProgress = Math.min((lessonsToday / (profile.dailyGoal || 1)) * 100, 100)
  const statusMessage = lessonsRemaining <= 0
    ? 'Your SIE path is complete. Keep readiness sharp with review.'
    : dailyProgress < 100
      ? 'Complete today’s lesson to build exam momentum.'
      : `You’re ${lessonsRemaining} lesson${lessonsRemaining === 1 ? '' : 's'} away from completing the SIE path.`

  return {
    readiness,
    nextLesson,
    courseCompletion,
    lessonsRemaining,
    accuracy,
    checkIns,
    passedCheckIns,
    weakestTopics,
    lessonsToday,
    dailyProgress,
    statusMessage,
  }
}

export function getRecommendation(profile) {
  const readiness = getReadiness(profile)
  const nextLesson = allLessons.find((lesson) => lessonIsUnlocked(lesson.id, profile) && !profile.completed.includes(lesson.id)) || allLessons[0]
  const accuracy = profile.totalQuestions ? profile.correctAnswers / profile.totalQuestions : 1
  const lessonsToday = profile.lastStudyDate === todayKey() ? profile.lessonsToday : 0
  const dailyRemaining = Math.max((profile.dailyGoal || 1) - lessonsToday, 0)

  if (profile.mistakes.length >= 3) {
    return {
      type: 'review',
      title: 'Review mistakes before starting something new',
      copy: 'Your fastest readiness gain is fixing missed concepts while they are still fresh.',
      action: 'Review mistakes',
    }
  }
  if (dailyRemaining > 0) {
    return {
      type: 'lesson',
      lesson: nextLesson,
      title: `Complete ${dailyRemaining} lesson${dailyRemaining === 1 ? '' : 's'} today`,
      copy: `Start with ${nextLesson.title}. Staying consistent matters more than cramming.`,
      action: 'Start next lesson',
    }
  }
  if (accuracy < 0.75 && profile.mistakes.length > 0) {
    return {
      type: 'review',
      title: 'Strengthen accuracy',
      copy: 'Your completion is moving, but the SIE rewards precision. Revisit missed questions next.',
      action: 'Review mistakes',
    }
  }
  return {
    type: 'lesson',
    lesson: nextLesson,
    title: readiness >= 70 ? 'Push toward exam confidence' : 'Keep building the foundation',
    copy: `Your next best step is ${nextLesson.title}.`,
    action: 'Continue',
  }
}

