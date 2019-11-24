import config from './config.json';

export const API_BASE_URL = config[process.env.NODE_ENV].BACKEND_URL;

export const GOOGLE_AUTH_URI = '/auth/google';
