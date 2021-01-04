import { WithSnackbarProps } from 'notistack'
import { useEffect } from 'react'
import { History } from 'history'

import jwtDecode from 'jwt-decode'
import { firebaseAuth } from 'services/firebase/initialiseFirebase'
import { API_BASE_URL, GOOGLE_AUTH_URI } from 'utils/constants/apiConstants'

export const FIREBASE_JWT_STORAGE_KEY = 'firebase_token'
export const JWT_STORAGE_KEY = 'jwt_token'

export enum AuthRole {
  Admin = 'admin',
  NonAdmin = 'nonAdmin',
}

export type JwtTokenPayload = {
  id: number
  email: string
  exp: number
  role: AuthRole
  givenName: string
  familyName: string
  pictureUrl: string | null
}

export type User = {
  id: number
  hasExpired: boolean
  role: AuthRole
  givenName: string
  familyName: string
  pictureUrl: string | null
}

export const login = () => {
  window.location.href = API_BASE_URL + GOOGLE_AUTH_URI
}

export const decodeJWT = (jwtToken: string): User => {
  const decoded = jwtDecode<JwtTokenPayload>(jwtToken)
  return {
    id: decoded.id,
    hasExpired: decoded.exp < new Date().getTime() / 1000,
    role: decoded.role,
    givenName: decoded.givenName,
    familyName: decoded.familyName,
    pictureUrl: decoded.pictureUrl,
  }
}

export const getUser = () => {
  const token = localStorage.getItem(JWT_STORAGE_KEY)
  if (!token) {
    return null
  }
  try {
    const user = decodeJWT(token)
    return !user.hasExpired ? user : null
  } catch {
    return null
  }
}

export const useSetAuth = (setUser: (user: User) => void, enqueueSnackbar: WithSnackbarProps['enqueueSnackbar']) => {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)

    const loginStatus = urlParams.get('login')

    if (!loginStatus) {
      return
    }
    const token = urlParams.get(JWT_STORAGE_KEY)
    const firebaseToken = urlParams.get(FIREBASE_JWT_STORAGE_KEY)

    if (loginStatus !== 'success' || !token) {
      enqueueSnackbar('Il y a eu un problème lors du login', { variant: 'error' })
    } else {
      localStorage.setItem(JWT_STORAGE_KEY, token)
      if (firebaseToken !== null) {
        localStorage.setItem(FIREBASE_JWT_STORAGE_KEY, firebaseToken)
      }

      setUser(decodeJWT(token))

      enqueueSnackbar('Hello ou Bonjour ?', {
        variant: 'success',
        autoHideDuration: 3000,
      })
    }

    urlParams.delete('login')
    urlParams.delete(JWT_STORAGE_KEY)
    urlParams.delete(FIREBASE_JWT_STORAGE_KEY)

    if (Array.from(urlParams).length) {
      window.history.replaceState({}, '', `${window.location.pathname}?${urlParams}`)
    } else {
      window.history.replaceState({}, '', window.location.pathname)
    }

    // eslint-disable-next-line
  }, [])
}

export const logout = (history: History) => {
  localStorage.removeItem(JWT_STORAGE_KEY)
  localStorage.removeItem(FIREBASE_JWT_STORAGE_KEY)
  void firebaseAuth.signOut()
  history.go(0)
}
