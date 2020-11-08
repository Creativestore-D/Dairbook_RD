import axios from "axios";

export const API_URL = process.env.REACT_APP_API_URL+'api/';
export const LOGIN_URL = "login";
// export const LOGIN_URL = "http://localhost:8000/api/login";
export const REGISTER_URL = "register";
export const REQUEST_PASSWORD_URL = "forgot-password";

// export const ME_URL = "http://localhost:8000/api/users/me/";
export const ME_URL = "users/me/";

export function login(email, password) {
  return axios.post(API_URL+LOGIN_URL, { email, password });
}

export function register(email, fullname, username, password) {
  return axios.post(REGISTER_URL, { email, fullname, username, password });
}

export function requestPassword(email) {
  return axios.post(REQUEST_PASSWORD_URL, { email });
}

export function getUserByToken() {
  return axios.get(API_URL+ME_URL);
}
