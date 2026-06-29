export function normalizePhoneNumber(value) {
  const trimmed = String(value || '').trim()
  if (!trimmed) return ''

  const hasPlus = trimmed.startsWith('+')
  const digits = trimmed.replace(/\D/g, '')

  if (hasPlus) return `+${digits}`
  if (digits.length === 10) return `+1${digits}`
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`
  return `+${digits}`
}

export function isValidPhoneNumber(value) {
  return /^\+[1-9]\d{9,14}$/.test(normalizePhoneNumber(value))
}
