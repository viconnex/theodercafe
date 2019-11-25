import { combineReducers } from 'redux';
import { userReducers as user } from 'modules/user';

export default combineReducers({ user });
