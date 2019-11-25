import { decodeJWT } from 'services/jwtDecode';

const token = localStorage.jwt_token;
const decoded = token ? decodeJWT(token) : null;

const initialState = {
  token: token,
  role: decoded ? decoded.token : null,
  pictureUrl: decoded ? decoded.token : null,
  isAuthenticated: !!token,
};

export const actionTypes = {
  SET_USER: 'SET_USER',
};

export const getUser = store => {
  return store.user;
};

export const userReducers = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_USER: {
      return {
        ...state,
        token: action.payload.token,
        role: action.payload.role,
        pictureUrl: action.payload.pictureUrl,
        isAuthenticated: action.payload.isAuthenticated,
      };
    }
    default: {
      return state;
    }
  }
};

export default userReducers;
