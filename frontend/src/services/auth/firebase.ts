import jwtDecode from 'jwt-decode'

export const getOrRefreshFirebaseToken = () => {
  if (!localStorage.jwt_token) {
    return
  }
}

export const isTokenValid = (token: string) => {
  const decoded = jwtDecode(token) as { exp: number }
  return decoded.exp >= new Date().getTime() / 1000
}
