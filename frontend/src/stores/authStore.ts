import Cookies from 'js-cookie'
import { create } from 'zustand'

const ACCESS_TOKEN = 'thisisjustarandomstring'
const USER_INFO = 'auth_user_info'

interface AuthUser {
  accountNo: string
  email: string
  firstName?: string
  lastName?: string
  role: string[]
  exp: number
}

interface AuthState {
  auth: {
    user: AuthUser | null
    setUser: (user: AuthUser | null) => void
    accessToken: string
    setAccessToken: (accessToken: string) => void
    resetAccessToken: () => void
    reset: () => void
  }
}

export const useAuthStore = create<AuthState>()((set) => {
  const cookieState = Cookies.get(ACCESS_TOKEN)
  const initToken = cookieState ? JSON.parse(cookieState) : ''
  let initUser: AuthUser | null = null
  try {
    const saved = localStorage.getItem(USER_INFO)
    initUser = saved ? (JSON.parse(saved) as AuthUser) : null
  } catch {
    initUser = null
  }
  return {
    auth: {
      user: initUser,
      setUser: (user) =>
        set((state) => {
          try {
            if (user) {
              localStorage.setItem(USER_INFO, JSON.stringify(user))
            } else {
              localStorage.removeItem(USER_INFO)
            }
          } catch {}
          return { ...state, auth: { ...state.auth, user } }
        }),
      accessToken: initToken,
      setAccessToken: (accessToken) =>
        set((state) => {
          Cookies.set(ACCESS_TOKEN, JSON.stringify(accessToken))
          return { ...state, auth: { ...state.auth, accessToken } }
        }),
      resetAccessToken: () =>
        set((state) => {
          Cookies.remove(ACCESS_TOKEN)
          return { ...state, auth: { ...state.auth, accessToken: '' } }
        }),
      reset: () =>
        set((state) => {
          Cookies.remove(ACCESS_TOKEN)
          try {
            localStorage.removeItem(USER_INFO)
          } catch {}
          return {
            ...state,
            auth: { ...state.auth, user: null, accessToken: '' },
          }
        }),
    },
  }
})

// export const useAuth = () => useAuthStore((state) => state.auth)
