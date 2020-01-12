import { API_BASE_URL } from './constants/apiConstants';

export const fetchRequest = async ({ uri, method, body, params }) => {
  const request = {
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };
  if (body) request['body'] = JSON.stringify(body);
  if (localStorage.jwt_token) request.headers['Authorization'] = 'Bearer ' + localStorage.jwt_token;

  const url = new URL(API_BASE_URL + uri);
  if (params) {
    url.search = new URLSearchParams(params).toString();
  }

  const response = await fetch(url, request);

  return response;
};
