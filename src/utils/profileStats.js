export function getXpLevel(xp) {
  const level = Math.floor(xp / 100) + 1
  const currentLevelXp = xp % 100
  return {
    level,
    currentLevelXp,
    nextLevelXp: 100,
    label: level < 3 ? 'Foundation Builder' : level < 6 ? 'SIE Climber' : 'Exam-Ready Grinder',
  }
}
