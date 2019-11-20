import { API_BASE_URL } from './constants';

export const fetchRequest = async (uri, method, body) => {
  const request = {
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };
  if (body) request['body'] = JSON.stringify(body);
  if (localStorage.jwt_token) request.headers['Authorization'] = 'Bearer ' + localStorage.jwt_token;

  const response = await fetch(API_BASE_URL + uri, request);
  return response;
};
