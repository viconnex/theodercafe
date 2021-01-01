import jwtDecode from 'jwt-decode'
import { useEffect } from 'react'
import { FIREBASE_JWT_STORAGE_KEY, JWT_STORAGE_KEY } from 'services/authentication'
import { firebaseAuth } from 'services/firebase/initialiseFirebase'
import { fetchRequest } from 'utils/helpers'

export const getFirebaseToken = async () => {
  const savedFirebaseToken = localStorage.getItem(FIREBASE_JWT_STORAGE_KEY)

  if (savedFirebaseToken && isTokenValid(savedFirebaseToken)) {
    return savedFirebaseToken
  }

  const authToken = localStorage.getItem(JWT_STORAGE_KEY)
  if (!authToken || !isTokenValid(authToken)) {
    return null
  }

  try {
    const response = await fetchRequest({
      uri: '/auth/refresh_firebase_token',
      method: 'GET',
      body: null,
      params: null,
    })
    const { token } = (await response.json()) as { token: string }

    if (!token) {
      return null
    }

    localStorage.setItem(FIREBASE_JWT_STORAGE_KEY, token)
    return token
  } catch {
    return null
  }
}

export const isTokenValid = (token: string) => {
  try {
    const decoded: { exp?: number } = jwtDecode(token)
    return !decoded.exp || decoded.exp > Date.now() / 1000 + 300
  } catch (e) {
    return false
  }
}

export const useFirebaseAuth = (setUid: (uid: string) => void) => {
  useEffect(() => {
    const signin = async () => {
      const token = await getFirebaseToken()
      if (!token) {
        return
      }
      try {
        await firebaseAuth.signInWithCustomToken(token)
      } catch {
        console.log('authentication to firebase failed')
      }
    }
    void signin()
  }, [])

  firebaseAuth.onAuthStateChanged((user) => {
    if (user) {
      setUid(user.uid)
    } else {
      // User is signed out
    }
  })
}
