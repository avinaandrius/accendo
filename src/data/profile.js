import { useEffect, useState } from 'react'

export const starterProfile = {
  name: 'Andrius',
  username: 'andrius_sie',
  email: 'andrius@example.com',
  streak: 4,
  xp: 140,
  weeklyGoal: 5,
  dailyGoal: 1,
  currentExam: 'SIE',
  preferredStudyTime: 'Evening',
  difficultyPreference: 'Standard',
  dailyReminderTime: '19:00',
  theme: 'light',
  usernameLastChangedAt: '',
  notificationSettings: {
    dailyReminder: true,
    weeklyReport: true,
    streakReminder: true,
    friendActivity: false,
    productUpdates: true,
  },
  privacySettings: {
    profileVisibility: 'Private',
    showXp: true,
    showStreak: true,
    showCompletedLessons: false,
    showExam: false,
    showAchievements: true,
    friendRequests: 'Anyone',
    searchableByUsername: true,
    searchableByEmail: false,
  },
  learningSettings: {
    reviewIncorrect: true,
    repeatMissed: true,
    aiExplanations: true,
    studyMode: 'Standard',
    reduceMotion: false,
  },
  accessibilitySettings: {
    largeText: false,
    highContrast: false,
    colorBlindMode: false,
    largerButtons: false,
  },
  aiSettings: {
    personalizedExplanations: true,
    personalizedQuizzes: true,
    aiTutor: true,
  },
  completed: [],
  onboarded: false,
  examDate: '',
  totalQuestions: 0,
  correctAnswers: 0,
  mistakes: [],
  lessonAttempts: {},
  lessonsToday: 0,
  lastStudyDate: '',
}

export function normalizeProfile(profile = {}) {
  return {
    ...starterProfile,
    ...profile,
    completed: Array.isArray(profile.completed) ? profile.completed : [],
    mistakes: Array.isArray(profile.mistakes) ? profile.mistakes : [],
    lessonAttempts: profile.lessonAttempts && typeof profile.lessonAttempts === 'object' ? profile.lessonAttempts : {},
    notificationSettings: { ...starterProfile.notificationSettings, ...(profile.notificationSettings || {}) },
    privacySettings: { ...starterProfile.privacySettings, ...(profile.privacySettings || {}) },
    learningSettings: { ...starterProfile.learningSettings, ...(profile.learningSettings || {}) },
    accessibilitySettings: { ...starterProfile.accessibilitySettings, ...(profile.accessibilitySettings || {}) },
    aiSettings: { ...starterProfile.aiSettings, ...(profile.aiSettings || {}) },
  }
}


export function useStoredProfile() {
  const [profile, setProfile] = useState(() => {
    try {
      const storedProfile = localStorage.getItem('accendo-profile') || localStorage.getItem('examed-profile')
      return normalizeProfile(JSON.parse(storedProfile) || {})
    } catch {
      return starterProfile
    }
  })

  useEffect(() => {
    localStorage.setItem('accendo-profile', JSON.stringify(profile))
  }, [profile])

  return [profile, setProfile]
}
