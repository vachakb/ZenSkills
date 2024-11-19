import axios from "axios";
import { API_URL } from "./constants";

function login(user) {
  return axios.post(`${API_URL}/auth/login`, user);
}

function register(user) {
  return axios.post(`${API_URL}/auth/register`, user);
}

function registerUser(userProfile) {
  return axios.post(`${API_URL}/auth/register-user`, userProfile);
}

function googleCallback(token) {
  return axios.post(`${API_URL}/auth/google/callback`, { token: token });
}

export { login, register, registerUser, googleCallback };
