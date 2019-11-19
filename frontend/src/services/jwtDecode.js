import jwtDecode from 'jwt-decode';

export const decodeJWT = jwtToken => {
  const decoded = jwtDecode(jwtToken);
  return {
    hasExpired: decoded.exp < new Date().getTime() / 1000,
    role: decoded.role,
  };
};
