import { Suspense, lazy, useEffect, useState } from 'react'
import { normalizeProfile, starterProfile, useStoredProfile } from './data/profile'
import { Brand, BottomNavigation, Sidebar, Topbar } from './components/layout'
import { hasSupabaseConfig, supabase } from './supabase'
import AuthScreen from './pages/AuthScreen'
import AuthCallback from './pages/AuthCallback'
import Onboarding from './pages/Onboarding'

const LearnPage = lazy(() => import('./pages/LearnPage'))
const PracticePage = lazy(() => import('./pages/PracticePage'))
const ProgressPage = lazy(() => import('./pages/ProgressPage'))
const SettingsPage = lazy(() => import('./pages/SettingsPage'))
const LessonPage = lazy(() => import('./pages/LessonPage'))

const todayKey = () => new Date().toISOString().slice(0, 10)

function PageLoader({ label = 'Loading your study path…' }) {
  return <div className="app-loading"><Brand /><span>{label}</span></div>
}

function createMistakeReviewLesson(mistakes) {
  return {
    id: 'mistake-review',
    title: 'Mistake Review',
    detail: 'Retry concepts that need another look',
    xp: 0,
    questions: mistakes,
    reviewMode: true,
  }
}

export default function App() {
  const [profile, setProfile] = useStoredProfile()
  const [session, setSession] = useState(null)
  const [authReady, setAuthReady] = useState(!hasSupabaseConfig)
  const [cloudReady, setCloudReady] = useState(!hasSupabaseConfig)
  const [cloudError, setCloudError] = useState('')
  const [demoMode, setDemoMode] = useState(false)
  const [page, setPage] = useState('home')
  const [lesson, setLesson] = useState(null)

  useEffect(() => {
    const applyTheme = () => {
      const systemDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches
      const resolvedTheme = profile.theme === 'system' ? (systemDark ? 'dark' : 'light') : profile.theme || 'light'
      document.documentElement.dataset.theme = resolvedTheme
      document.documentElement.classList.toggle('large-text', Boolean(profile.accessibilitySettings?.largeText))
      document.documentElement.classList.toggle('high-contrast', Boolean(profile.accessibilitySettings?.highContrast))
      document.documentElement.classList.toggle('larger-buttons', Boolean(profile.accessibilitySettings?.largerButtons))
      document.documentElement.classList.toggle('reduce-motion', Boolean(profile.learningSettings?.reduceMotion))
    }
    applyTheme()
    const media = window.matchMedia?.('(prefers-color-scheme: dark)')
    media?.addEventListener?.('change', applyTheme)
    return () => media?.removeEventListener?.('change', applyTheme)
  }, [profile.theme, profile.accessibilitySettings, profile.learningSettings])

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setCloudReady(!data.session)
      setAuthReady(true)
    })
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setCloudReady(!nextSession)
      setCloudError('')
      setAuthReady(true)
    })
    return () => data.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!session || !supabase) return
    async function loadCloudProfile() {
      setCloudReady(false)
      setCloudError('')
      const [{ data: cloudProfile, error: profileError }, { data: progress, error: progressError }, { allLessons }] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', session.user.id).maybeSingle(),
        supabase.from('lesson_progress').select('lesson_id, score').eq('user_id', session.user.id),
        import('./data/curriculum'),
      ])
      if (profileError || progressError) {
        setCloudError(profileError?.message || progressError?.message || 'Accendo could not load your saved progress.')
        setCloudReady(true)
        return
      }
      if (cloudProfile) {
        const appSettings = cloudProfile.app_settings || {}
        setProfile(normalizeProfile({
          name: cloudProfile.name,
          username: cloudProfile.username || '',
          email: cloudProfile.email || session.user.email,
          phoneNumber: cloudProfile.phone_number || session.user.user_metadata?.phone_number || '',
          streak: cloudProfile.streak,
          xp: cloudProfile.xp,
          dailyGoal: cloudProfile.daily_goal || 1,
          weeklyGoal: cloudProfile.weekly_goal,
          completed: (progress || [])
            .filter((item) => {
              const savedLesson = allLessons.find((lessonItem) => lessonItem.id === item.lesson_id)
              return savedLesson && (!savedLesson.isCheckIn || (item.score || 0) >= (savedLesson.passingScore || 80))
            })
            .map((item) => item.lesson_id),
          onboarded: cloudProfile.onboarded,
          examDate: cloudProfile.exam_date || '',
          totalQuestions: cloudProfile.total_questions || 0,
          correctAnswers: cloudProfile.correct_answers || 0,
          mistakes: cloudProfile.mistakes || [],
          lessonsToday: cloudProfile.lessons_today || 0,
          lastStudyDate: cloudProfile.last_study_date || '',
          lessonAttempts: cloudProfile.lesson_attempts || {},
          currentExam: appSettings.currentExam,
          preferredStudyTime: appSettings.preferredStudyTime,
          difficultyPreference: appSettings.difficultyPreference,
          dailyReminderTime: appSettings.dailyReminderTime,
          theme: appSettings.theme,
          usernameLastChangedAt: appSettings.usernameLastChangedAt,
          notificationSettings: appSettings.notificationSettings,
          privacySettings: appSettings.privacySettings,
          learningSettings: appSettings.learningSettings,
          accessibilitySettings: appSettings.accessibilitySettings,
          aiSettings: appSettings.aiSettings,
        }))
      } else {
        const newProfile = {
          ...starterProfile,
          name: session.user.user_metadata?.name || 'SIE Candidate',
          email: session.user.email,
          phoneNumber: session.user.user_metadata?.phone_number || '',
          username: session.user.email?.split('@')[0] || '',
          xp: 0,
          streak: 0,
          completed: [],
        }
        setProfile(newProfile)
        const { error: profileInsertError } = await supabase.from('profiles').insert({
          id: session.user.id,
          name: newProfile.name,
          full_name: newProfile.name,
          username: newProfile.username,
          email: newProfile.email,
          phone_number: newProfile.phoneNumber || null,
          daily_goal: newProfile.dailyGoal,
          weekly_goal: newProfile.weeklyGoal,
          app_settings: {
            currentExam: newProfile.currentExam,
            preferredStudyTime: newProfile.preferredStudyTime,
            difficultyPreference: newProfile.difficultyPreference,
            dailyReminderTime: newProfile.dailyReminderTime,
            theme: newProfile.theme,
            usernameLastChangedAt: newProfile.usernameLastChangedAt,
            notificationSettings: newProfile.notificationSettings,
            privacySettings: newProfile.privacySettings,
            learningSettings: newProfile.learningSettings,
            accessibilitySettings: newProfile.accessibilitySettings,
            aiSettings: newProfile.aiSettings,
          },
        })
        if (profileInsertError) {
          if (profileInsertError.code === '23505' && profileInsertError.message?.includes('phone')) {
            localStorage.setItem('accendo-auth-message', 'An account already exists with this phone number. Please sign in instead.')
            await supabase.auth.signOut()
            setSession(null)
            setCloudReady(true)
            return
          }
          throw profileInsertError
        }
      }
      setCloudReady(true)
    }
    loadCloudProfile().catch((error) => {
      setCloudError(error.message || 'Accendo could not load your saved progress.')
      setCloudReady(true)
    })
  }, [session, setProfile])

  async function persistProfileToCloud(nextProfile) {
    if (!session || !supabase) return
    await supabase.from('profiles').upsert({
      id: session.user.id,
      name: nextProfile.name,
      full_name: nextProfile.name,
      username: nextProfile.username || null,
      email: nextProfile.email,
      phone_number: nextProfile.phoneNumber || session.user.user_metadata?.phone_number || null,
      xp: nextProfile.xp,
      streak: nextProfile.streak,
      daily_goal: nextProfile.dailyGoal,
      weekly_goal: nextProfile.weeklyGoal,
      exam_date: nextProfile.examDate || null,
      onboarded: nextProfile.onboarded,
      total_questions: nextProfile.totalQuestions,
      correct_answers: nextProfile.correctAnswers,
      mistakes: nextProfile.mistakes,
      lessons_today: nextProfile.lessonsToday,
      last_study_date: nextProfile.lastStudyDate || null,
      lesson_attempts: nextProfile.lessonAttempts,
      app_settings: {
        currentExam: nextProfile.currentExam,
        preferredStudyTime: nextProfile.preferredStudyTime,
        difficultyPreference: nextProfile.difficultyPreference,
        dailyReminderTime: nextProfile.dailyReminderTime,
        theme: nextProfile.theme,
        usernameLastChangedAt: nextProfile.usernameLastChangedAt,
        notificationSettings: nextProfile.notificationSettings,
        privacySettings: nextProfile.privacySettings,
        learningSettings: nextProfile.learningSettings,
        accessibilitySettings: nextProfile.accessibilitySettings,
        aiSettings: nextProfile.aiSettings,
      },
      updated_at: new Date().toISOString(),
    })
  }

  useEffect(() => {
    if (!session || !supabase) return
    if (!cloudReady || cloudError) return
    const timer = setTimeout(() => {
      supabase.from('profiles').upsert({
        id: session.user.id,
        name: profile.name,
        full_name: profile.name,
        username: profile.username || null,
        email: profile.email,
        phone_number: profile.phoneNumber || session.user.user_metadata?.phone_number || null,
        xp: profile.xp,
        streak: profile.streak,
        daily_goal: profile.dailyGoal,
        weekly_goal: profile.weeklyGoal,
        exam_date: profile.examDate || null,
        onboarded: profile.onboarded,
        total_questions: profile.totalQuestions,
        correct_answers: profile.correctAnswers,
        mistakes: profile.mistakes,
        lessons_today: profile.lessonsToday,
        last_study_date: profile.lastStudyDate || null,
        lesson_attempts: profile.lessonAttempts,
        app_settings: {
          currentExam: profile.currentExam,
          preferredStudyTime: profile.preferredStudyTime,
          difficultyPreference: profile.difficultyPreference,
          dailyReminderTime: profile.dailyReminderTime,
          theme: profile.theme,
          usernameLastChangedAt: profile.usernameLastChangedAt,
          notificationSettings: profile.notificationSettings,
          privacySettings: profile.privacySettings,
          learningSettings: profile.learningSettings,
          accessibilitySettings: profile.accessibilitySettings,
          aiSettings: profile.aiSettings,
        },
        updated_at: new Date().toISOString(),
      })
    }, 500)
    return () => clearTimeout(timer)
  }, [profile, session, cloudReady, cloudError])

  function completeLesson(result) {
    const { lesson: completedLesson, correct, total, wrongAnswers, reviewedKeys } = result
    const reviewMode = completedLesson.reviewMode
    const score = Math.round((correct / total) * 100)
    const passedGate = !completedLesson.isCheckIn || score >= (completedLesson.passingScore || 80)
    const wrongKeys = new Set(wrongAnswers.map((item) => item.key))
    function buildNextProfile(current) {
      const today = todayKey()
      const studiedToday = current.lastStudyDate === today
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayKey = yesterday.toISOString().slice(0, 10)
      const nextLessonsToday = studiedToday ? current.lessonsToday + 1 : 1
      const nextStreak = studiedToday
        ? current.streak
        : current.lastStudyDate === yesterdayKey
          ? current.streak + 1
          : 1
      const retainedMistakes = reviewMode
        ? current.mistakes.filter((item) => !reviewedKeys.includes(item.key) || wrongKeys.has(item.key))
        : current.mistakes.filter((item) => item.lessonId !== completedLesson.id)
      const nextMistakes = [...retainedMistakes, ...wrongAnswers.filter((item) => !retainedMistakes.some((old) => old.key === item.key))]
      if (reviewMode) {
        return {
          ...current,
          streak: nextStreak,
          totalQuestions: current.totalQuestions + total,
          correctAnswers: current.correctAnswers + correct,
          mistakes: nextMistakes,
          lessonsToday: nextLessonsToday,
          lastStudyDate: today,
        }
      }
      const alreadyComplete = current.completed.includes(completedLesson.id)
      return {
        ...current,
        xp: current.xp + (passedGate ? (alreadyComplete ? Math.round(completedLesson.xp / 4) : completedLesson.xp) : 0),
        streak: nextStreak,
        completed: alreadyComplete || !passedGate ? current.completed : [...current.completed, completedLesson.id],
        totalQuestions: current.totalQuestions + total,
        correctAnswers: current.correctAnswers + correct,
        mistakes: nextMistakes,
        lessonAttempts: {
          ...current.lessonAttempts,
          [completedLesson.id]: {
            correct,
            total,
            score,
            passed: passedGate,
            completedAt: new Date().toISOString(),
          },
        },
        lessonsToday: nextLessonsToday,
        lastStudyDate: today,
      }
    }
    const nextProfile = buildNextProfile(profile)
    setProfile(nextProfile)
    if (session && supabase && !reviewMode) {
      supabase.from('lesson_progress').upsert({
        user_id: session.user.id,
        lesson_id: completedLesson.id,
        score,
        completed_at: new Date().toISOString(),
      })
    }
    persistProfileToCloud(nextProfile)
  }

  function completeOnboarding(details) {
    const nextProfile = { ...profile, ...details, onboarded: true }
    setProfile(nextProfile)
    persistProfileToCloud(nextProfile)
  }

  async function signOut() {
    if (supabase && session) await supabase.auth.signOut()
    setDemoMode(false)
    setPage('home')
  }

  if (window.location.pathname === '/auth/callback') return <AuthCallback onSession={setSession} />
  if (!authReady) return <PageLoader />
  if (!session && !demoMode) return <AuthScreen onDemo={() => setDemoMode(true)} />
  if (session && !cloudReady) return <PageLoader label="Preparing your study plan…" />
  if (cloudError) {
    return (
      <main className="app-loading">
        <Brand />
        <span>Accendo could not load your saved progress. {cloudError}</span>
        <button className="primary-button" onClick={() => window.location.reload()}>Try again</button>
      </main>
    )
  }
  if (!profile.onboarded) {
    return <Onboarding profile={profile} onComplete={completeOnboarding} />
  }

  if (lesson) {
    return (
      <Suspense fallback={<PageLoader label="Opening lesson…" />}>
        <LessonPage lesson={lesson} reviewMode={lesson.reviewMode} onExit={() => setLesson(null)} onComplete={completeLesson} />
      </Suspense>
    )
  }

  const reviewMistakes = () => {
    if (profile.mistakes.length > 0) setLesson(createMistakeReviewLesson(profile.mistakes))
  }

  return (
    <div className="app-shell">
      <Sidebar page={page} setPage={setPage} profile={profile} />
      <div className="content-shell">
        <Topbar profile={profile} session={session} page={page} />
        <Suspense fallback={<PageLoader label="Loading page…" />}>
          {page === 'home' && <LearnPage profile={profile} onStart={setLesson} onReview={reviewMistakes} />}
          {page === 'practice' && <PracticePage profile={profile} onStart={setLesson} onReview={reviewMistakes} />}
          {page === 'progress' && <ProgressPage profile={profile} />}
          {page === 'settings' && <SettingsPage profile={profile} setProfile={setProfile} onSignOut={signOut} session={session} />}
        </Suspense>
      </div>
      <BottomNavigation page={page} setPage={setPage} />
    </div>
  )
}

