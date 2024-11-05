import Cookies from 'js-cookie'

export const AUTH_COOKIE_NAME = 'auth_token'
export const SESSION_COOKIE_NAME = 'session_id'
export const USER_PREFERENCES_COOKIE = 'user_prefs'

interface AuthCookie {
  token: string;
  username: string;
  tempId: string;
  avatarUrl: string;
  avatarType: string;
  role: string;
}

interface UserPreferences {
  theme: 'light' | 'dark';
  notifications: boolean;
  language: string;
}

export function setAuthCookie(data: AuthCookie) {
  Cookies.set(AUTH_COOKIE_NAME, JSON.stringify(data), { 
    expires: 30,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  })
}

export function getAuthCookie(): AuthCookie | null {
  const cookie = Cookies.get(AUTH_COOKIE_NAME)
  if (!cookie) return null

  try {
    return JSON.parse(cookie)
  } catch {
    return null
  }
}

export function removeAuthCookie() {
  Cookies.remove(AUTH_COOKIE_NAME)
}

export function setUserPreferences(prefs: UserPreferences) {
  Cookies.set(USER_PREFERENCES_COOKIE, JSON.stringify(prefs), { 
    expires: 365, // 1 year
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  })
}

export function getUserPreferences(): UserPreferences | null {
  const prefs = Cookies.get(USER_PREFERENCES_COOKIE)
  if (!prefs) return null

  try {
    return JSON.parse(prefs)
  } catch {
    return null
  }
}

export function getSessionId(): string | undefined {
  return Cookies.get(SESSION_COOKIE_NAME)
} 