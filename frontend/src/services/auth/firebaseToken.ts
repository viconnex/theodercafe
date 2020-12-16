import jwtDecode from 'jwt-decode'
import { FIREBASE_JWT_STORAGE_KEY, JWT_STORAGE_KEY } from 'services/auth/setAuth'
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
    localStorage.setItem(FIREBASE_JWT_STORAGE_KEY, token)

    return token
  } catch {
    return null
  }
}

export const isTokenValid = (token: string) => {
  const decoded: { exp?: number } = jwtDecode(token)
  return !decoded.exp || decoded.exp > Date.now() / 1000 + 300
}
