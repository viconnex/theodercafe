import { JWT_STORAGE_KEY } from 'services/authentication'
import { API_BASE_URL, USER_TO_QUESTIONS_CHOICES_URI, USER_TO_QUESTIONS_VOTES_URI } from 'utils/constants/apiConstants'

export const fetchRequestResponse = async (
  { uri, method, body, params },
  expectedStatus,
  { enqueueSnackbar, successMessage },
) => {
  let response
  try {
    response = await fetchRequest({ uri, method, body, params })
  } catch {
    if (enqueueSnackbar) {
      enqueueSnackbar("Une erreur s'est produite 🦦", { variant: 'error' })
    }
    return null
  }
  if (response.status === 401) {
    localStorage.removeItem('jwt_token')
    enqueueSnackbar("Vous n'êtes plus connecté", { variant: 'error' })
    return null
  }

  if (!response || response.status !== expectedStatus) {
    enqueueSnackbar("Le serveur n'est pas d'accord avec cette requête", { variant: 'error' })
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

export const postChoice = async (questionId, choice, enqueueSnackbar, successMessage) => {
  const uri = `/${USER_TO_QUESTIONS_CHOICES_URI}/${questionId}/choice`
  const body = { choice }

  await fetchRequestResponse({ uri, method: 'PUT', body, params: null }, 200, {
    enqueueSnackbar,
    successMessage,
  })
}

export const postVote = async (questionId, isUpVote, enqueueSnackbar, successMessage) => {
  const uri = `/${USER_TO_QUESTIONS_VOTES_URI}/${questionId}/vote`
  const body = isUpVote !== null ? { isUpVote } : undefined

  await fetchRequestResponse({ uri, method: isUpVote !== null ? 'PUT' : 'DELETE', body, params: null }, 200, {
    enqueueSnackbar,
    successMessage,
  })
}
