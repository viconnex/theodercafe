import config from './config.json';

export const API_BASE_URL = config[process.env.NODE_ENV].BACKEND_URL;

export const QUESTION_QUERY = 'questions';
export const QUESTION_VOTE_QUERY = 'vote';
export const CATEGORY_QUERY = 'categories';
