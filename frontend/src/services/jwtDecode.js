import jwtDecode from 'jwt-decode';

export const decodeJWT = jwtToken => {
  const decoded = jwtDecode(jwtToken);
  return {
    exp: decoded.exp,
    role: decoded.role,
    pictureUrl: decoded.pictureUrl,
  };
};

export const isUser = () => {
  if (!localStorage.jwt_token) return false;
  const decoded = decodeJWT(localStorage.jwt_token);
  return !decoded.hasExpired;
};

export const getPictureUrl = () => {
  if (!localStorage.jwt_token) return null;
  const decoded = decodeJWT(localStorage.jwt_token);
  return decoded.pictureUrl;
};
