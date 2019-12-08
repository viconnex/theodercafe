import { fetchRequest } from 'utils/helpers';

export const fetchRequestResponse = async (
  { uri, method, body },
  expectedStatus,
  { enqueueSnackbar, successMessage },
) => {
  let response;
  try {
    response = await fetchRequest(uri, method, body);
  } catch {
    enqueueSnackbar('Une erreur est survenue', { variant: 'error' });
    return null;
  }
  if (response.status !== expectedStatus) {
    enqueueSnackbar('Une erreur est survenue', { variant: 'error' });
    return null;
  }
  if (successMessage) {
    enqueueSnackbar(successMessage, { variant: 'success' });
  }
  return response;
};
