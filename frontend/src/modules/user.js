const initialState = {
  token: null,
  email: null,
};

export const actionTypes = {
  SET_USER: 'SET_USER',
};

export const userReducers = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_USER: {
      return {
        ...state,
        token: action.payload.token,
        email: action.payload.email,
      };
    }
    default: {
      return state;
    }
  }
};

export default userReducers;
