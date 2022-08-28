import jwtDecode from 'jwt-decode'
import { useEffect } from 'react'
import { FIREBASE_JWT_STORAGE_KEY, User } from 'services/authentication'
import { firebaseAuth } from 'services/firebase/initialiseFirebase'
import { fetchRequest } from 'services/api'
import { IS_LIVE_ACTIVATED_BY_DEFAULT } from 'components/Questioning/AsakaiQuestioning'
import { WithSnackbarProps } from 'notistack'

export const getFirebaseToken = async () => {
  const savedFirebaseToken = localStorage.getItem(FIREBASE_JWT_STORAGE_KEY)

  if (savedFirebaseToken && isTokenValid(savedFirebaseToken)) {
    return savedFirebaseToken
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

export const signin = async (enqueueSnackbar?: WithSnackbarProps['enqueueSnackbar']) => {
  const token = await getFirebaseToken()
  if (!token) {
    return
  }
  try {
    await firebaseAuth.signInWithCustomToken(token)
  } catch (e) {
    console.log('authentication to firebase failed', e)
    if (enqueueSnackbar) {
      enqueueSnackbar('Live indisponible', { variant: 'error' })
    }
  }
}

export const signout = async () => {
  await firebaseAuth.signOut()
}

export const useFirebaseAuth = (
  setUid: (uid: string | null) => void,
  user: User | null,
  enqueueSnackbar?: WithSnackbarProps['enqueueSnackbar'],
) => {
  useEffect(() => {
    if (!user || !IS_LIVE_ACTIVATED_BY_DEFAULT) {
      return
    }
    void signin(enqueueSnackbar)
  }, [user])

  firebaseAuth.onAuthStateChanged((newUser) => {
    if (newUser) {
      setUid(newUser.uid)
    } else {
      setUid(null)
    }
  })
}
