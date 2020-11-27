import { fetchRequest } from 'utils/helpers'

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
    enqueueSnackbar('Une erreur est survenue', { variant: 'error' })
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
