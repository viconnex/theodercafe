export const fetchRequest = async (url, method, body) => {
  const request = {
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };
  if (body) request['body'] = JSON.stringify(body);
  if (localStorage.jwt_token) request.headers['Authorization'] = 'Bearer ' + localStorage.jwt_token;

  const response = await fetch(url, request);
  return response;
};
