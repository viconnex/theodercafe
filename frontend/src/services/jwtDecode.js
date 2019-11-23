import jwtDecode from 'jwt-decode';

export const decodeJWT = jwtToken => {
  const decoded = jwtDecode(jwtToken);
  return {
    hasExpired: decoded.exp < new Date().getTime() / 1000,
    role: decoded.role,
  };
};

export const isUser = () => {
  if (!localStorage.jwt_token) return false;
  const decoded = decodeJWT(localStorage.jwt_token);
  return !decoded.hasExpired;
};
