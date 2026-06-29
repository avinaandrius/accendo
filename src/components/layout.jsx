import { Bell, ChevronRight, Flame, Gauge, Home, RotateCcw, Settings, Star, Target, Zap } from 'lucide-react'
import { getXpLevel } from '../utils/profileStats'
import FeedbackButton from './FeedbackButton'

export function Brand({ compact = false }) {
  return (
    <div className="brand">
      <div className="brand-mark">
        <img src="/accendo-logo.png" alt="Accendo logo" />
      </div>
      {!compact && <span className="brand-name">Accendo</span>}
    </div>
  )
}

const primaryNavigation = [
  { id: 'home', label: 'Learn', icon: Home },
  { id: 'practice', label: 'Practice', icon: RotateCcw },
  { id: 'progress', label: 'Progress', icon: Gauge },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export function Sidebar({ page, setPage, profile }) {
  return (
      <aside className="sidebar">
        <div className="sidebar-top">
          <Brand />
        </div>
        <nav>
          {primaryNavigation.map(({ id, label, icon: Icon }) => (
            <button
              className={page === id ? 'active' : ''}
              key={id}
              onClick={() => setPage(id)}
            >
              <Icon size={21} strokeWidth={2.2} />
              <span>{label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-card">
          <div className="sidebar-card-icon"><Target size={21} /></div>
          <p>Exam day</p>
          <strong>Set your date</strong>
          <button onClick={() => setPage('settings')}>Add date <ChevronRight size={15} /></button>
        </div>
        <div className="sidebar-footer">
          <div className="avatar avatar-small">{profile.name?.[0]?.toUpperCase() || 'E'}</div>
          <div>
            <strong>{profile.name}</strong>
            <span>SIE candidate</span>
          </div>
          <ChevronRight size={18} />
        </div>
      </aside>
  )
}

export function BottomNavigation({ page, setPage }) {
  return (
    <nav className="bottom-navigation" aria-label="Primary navigation">
      {primaryNavigation.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          className={page === id ? 'active' : ''}
          aria-current={page === id ? 'page' : undefined}
          onClick={() => setPage(id)}
        >
          <Icon size={23} strokeWidth={2.2} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  )
}

export function Topbar({ profile, session, page }) {
  const xpLevel = getXpLevel(profile.xp)
  return (
    <header className="topbar">
      <div className="mobile-brand"><Brand compact /></div>
      <div className="topbar-stats">
        <FeedbackButton profile={profile} session={session} page={page} />
        <div className="stat-pill fire"><Flame size={19} fill="currentColor" /> <strong>{profile.streak}</strong><span>day streak</span></div>
        <div className="stat-pill level"><Star size={17} fill="currentColor" /> <strong>Lv {xpLevel.level}</strong><span>{xpLevel.label}</span></div>
        <div className="stat-pill xp"><Zap size={18} fill="currentColor" /> <strong>{profile.xp}</strong><span>XP</span></div>
        <button className="icon-button" aria-label="Notifications"><Bell size={20} /></button>
      </div>
    </header>
  )
}
