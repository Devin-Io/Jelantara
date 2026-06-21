export const APP_DATA_KEY = 'jelantara-zero-placeholder-v4-data'
const LEGACY_KEYS = ['jelantara-integrated-v3-data', 'jelantara-prototype-data']

function mergeState(fallback, saved = {}) {
  const merged = { ...fallback, ...saved }
  for (const [key, value] of Object.entries(fallback)) {
    if (Array.isArray(value)) merged[key] = Array.isArray(saved[key]) ? saved[key] : value
    else if (value && typeof value === 'object') merged[key] = { ...value, ...(saved[key] || {}) }
    else if (saved[key] === undefined) merged[key] = value
  }
  return merged
}

export function loadAppData(fallback) {
  try {
    const current = localStorage.getItem(APP_DATA_KEY)
    if (current) return mergeState(fallback, JSON.parse(current))
    for (const key of LEGACY_KEYS) {
      const legacy = localStorage.getItem(key)
      if (legacy) return mergeState(fallback, JSON.parse(legacy))
    }
    return fallback
  } catch {
    return fallback
  }
}

export function saveAppData(data) {
  try { localStorage.setItem(APP_DATA_KEY, JSON.stringify(data)) } catch { /* Penyimpanan browser dapat dibatasi. */ }
}

export function clearAppData() {
  try { localStorage.removeItem(APP_DATA_KEY); LEGACY_KEYS.forEach((key)=>localStorage.removeItem(key)) } catch { /* Tidak ada tindakan lanjutan. */ }
}
