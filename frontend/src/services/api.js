import { JWT_STORAGE_KEY } from 'services/authentication'
import { API_BASE_URL } from 'utils/constants/apiConstants'

export const fetchRequestResponse = async (
  { uri, method, body, params },
  expectedStatus,
  { enqueueSnackbar, successMessage },
) => {
  let response
  try {
    response = await fetchRequest({ uri, method, body, params })
  } catch {
    enqueueSnackbar('Problème de connexion au serveur', { variant: 'error' })
    return null
  }
  if (response.status === 401) {
    localStorage.removeItem('jwt_token')
    enqueueSnackbar("Vous n'êtes plus connecté", { variant: 'error' })
    return null
  }

  if (!response || response.status !== expectedStatus) {
    enqueueSnackbar('Une erreur est survenue', { variant: 'error' })
    return null
  }
  if (successMessage) {
    enqueueSnackbar(successMessage, { variant: 'success' })
  }
  return response
}

export const fetchRequest = async ({ uri, method, body, params }) => {
  const request = {
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }
  if (body) {
    request['body'] = JSON.stringify(body)
  }
  const token = localStorage.getItem(JWT_STORAGE_KEY)
  if (token) {
    request.headers['Authorization'] = 'Bearer ' + token
  }

  const url = new URL(API_BASE_URL + uri)
  if (params) {
    url.search = new URLSearchParams(params).toString()
  }

  const response = await fetch(url, request)

  return response
}
