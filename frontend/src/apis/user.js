import { API_URL, axiosInstance } from "./commons";

function login(user) {
  return axiosInstance.post(`${API_URL}/auth/login`, user);
}

function register(user) {
  return axiosInstance.post(`${API_URL}/auth/register`, user);
}

function sendVerificationEmail(email) {
  return axiosInstance.post(`${API_URL}/auth/verify`, { email });
}

function verificationEmailCallback(token) {
  return axiosInstance.get(`${API_URL}/auth/verify/callback?token=${token}`);
}

function registerUser(userProfile) {
  return axiosInstance.post(`${API_URL}/auth/register-user`, userProfile);
}

function googleCallback(token) {
  return axiosInstance.post(`${API_URL}/auth/google/callback`, {
    token: token,
  });
}

export {
  login,
  register,
  sendVerificationEmail,
  verificationEmailCallback,
  registerUser,
  googleCallback,
};
