import axios from "axios";
import { API_URL } from "./commons";

function login(user) {
  return axios.post(`${API_URL}/auth/login`, user);
}

function register(user) {
  return axios.post(`${API_URL}/auth/register`, user);
}

function sendVerificationEmail(email) {
  return axios.post(`${API_URL}/auth/verify`, { email });
}

function verificationEmailCallback(token) {
  return axios.get(`${API_URL}/auth/verify/callback?token=${token}`);
}

function registerUser(userProfile) {
  return axios.post(`${API_URL}/auth/register-user`, userProfile);
}

function googleCallback(token) {
  return axios.post(`${API_URL}/auth/google/callback`, { token: token });
}

export {
  login,
  register,
  sendVerificationEmail,
  verificationEmailCallback,
  registerUser,
  googleCallback,
};
