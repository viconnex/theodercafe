import { useEffect } from 'react'
import { decodeJWT } from 'services/jwtDecode'

export const useSetAuth = (setPictureUrl, enqueueSnackbar) => {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)

    const loginStatus = urlParams.get('login')

    if (!loginStatus) {
      return
    }
    const token = urlParams.get('jwt')

    if (loginStatus !== 'success' || !token) {
      enqueueSnackbar('Il y a eu un problème lors du login', { variant: 'error' })
    } else {
      localStorage.setItem('jwt_token', token)
      const decoded = decodeJWT(token)
      setPictureUrl(decoded.pictureUrl)

      enqueueSnackbar('Hello ou Bonjour ?', {
        variant: 'success',
        autoHideDuration: 3000,
      })
    }

    urlParams.delete('login')
    urlParams.delete('jwt')

    window.history.replaceState({}, '', `${window.location.pathname}?${urlParams}`)
    // eslint-disable-next-line
  }, [])
}
