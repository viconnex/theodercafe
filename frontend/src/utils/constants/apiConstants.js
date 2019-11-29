import config from 'utils/config.json';

export const API_BASE_URL = config[process.env.NODE_ENV].BACKEND_URL;

export const GOOGLE_AUTH_URI = '/auth/google';

export const USER_TO_QUESTIONS_URI = 'user_to_question_choices';
