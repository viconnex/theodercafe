import { WithSnackbarProps } from 'notistack'
import { useEffect } from 'react'
import { decodeJWT } from 'services/jwtDecode'

export const FIREBASE_JWT_STORAGE_KEY = 'firebase_token'
export const JWT_STORAGE_KEY = 'jwt_token'

export const useSetAuth = (
  setPictureUrl: (pictureUrl: number) => void,
  enqueueSnackbar: WithSnackbarProps['enqueueSnackbar'],
) => {
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

      const decoded = decodeJWT(token)
      setPictureUrl(decoded.pictureUrl)

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
