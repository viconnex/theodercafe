import { WithSnackbarProps } from 'notistack'
import React, { useEffect, useState } from 'react'
import { History } from 'history'

import jwtDecode from 'jwt-decode'
import { API_BASE_URL, GOOGLE_AUTH_URI } from 'utils/constants/apiConstants'
import { signout as firebaseSignout } from 'services/firebase/authentication'
import { fetchRequest } from 'services/api'
import { isNullishCoalesce } from 'typescript'

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

type UserResponse = {
  company: string
  createdAt: string
  email: string
  familyName: string
  givenName: string
  id: 1
  isActive: boolean
  isAdmin: boolean
  isLoginPending: boolean
  pictureUrl: string
  selectedQuestionSet: { id: number; name: string }
}

export type User = {
  id: number
  role: AuthRole
  givenName: string
  familyName: string
  pictureUrl: string | null
  selectedQuestionSet: { id: number; name: string }
}

export const login = () => {
  window.location.href = API_BASE_URL + GOOGLE_AUTH_URI
}

export const decodeJWT = (jwtToken: string) => {
  const decoded = jwtDecode<JwtTokenPayload>(jwtToken)
  return {
    id: decoded.id,
    hasExpired: decoded.exp < new Date().getTime() / 1000,
  }
}

export const useSetUser = ({
  jwtToken,
  setJwtToken,
}: {
  jwtToken: string | null
  setJwtToken: React.Dispatch<React.SetStateAction<string | null>>
}) => {
  const [user, setUser] = useState<User | null>(null)
  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetchRequest({ uri: '/users/me', method: 'GET', body: null, params: null })
      const userResponse = (await response.json()) as UserResponse
      const user = {
        id: userResponse.id,
        role: userResponse.isAdmin ? AuthRole.Admin : AuthRole.NonAdmin,
        givenName: userResponse.givenName,
        familyName: userResponse.familyName,
        pictureUrl: userResponse.pictureUrl,
        selectedQuestionSet: userResponse.selectedQuestionSet,
      }
      setUser(user)
    }

    if (!jwtToken) {
      setUser(null)
      return
    }
    try {
      const userJWT = decodeJWT(jwtToken)
      if (userJWT.hasExpired) {
        setUser(null)
        setJwtToken(null)
      }
      void fetchUser()
    } catch {
      setUser(null)
      setJwtToken(null)
    }
  }, [jwtToken])

  return { user, setUser }
}

export const useSetAuth = ({ enqueueSnackbar }: { enqueueSnackbar: WithSnackbarProps['enqueueSnackbar'] }) => {
  const [jwtToken, setJwtToken] = useState<string | null>(localStorage.getItem(JWT_STORAGE_KEY))

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
      setJwtToken(null)
    } else {
      localStorage.setItem(JWT_STORAGE_KEY, token)
      setJwtToken(token)
      if (firebaseToken !== null) {
        localStorage.setItem(FIREBASE_JWT_STORAGE_KEY, firebaseToken)
      }

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

  return { jwtToken, setJwtToken }
}

export const useLogout = ({
  setUser,
  setJwtToken,
}: {
  setUser: React.Dispatch<React.SetStateAction<User | null>>
  setJwtToken: React.Dispatch<React.SetStateAction<string | null>>
}) => {
  const logout = ({ history }: { history: History }) => {
    localStorage.removeItem(JWT_STORAGE_KEY)
    localStorage.removeItem(FIREBASE_JWT_STORAGE_KEY)
    void firebaseSignout()
    history.go(0)
    setUser(null)
    setJwtToken(null)
  }
  return { logout }
}
