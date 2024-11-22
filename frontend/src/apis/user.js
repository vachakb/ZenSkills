import { axiosInstance } from "./commons";

function login(user) {
  return axiosInstance.post(`/auth/login`, user);
}

function register(user) {
  return axiosInstance.post(`/auth/register`, user);
}

function sendVerificationEmail(email) {
  return axiosInstance.post(`/auth/verify`, { email });
}

function verificationEmailCallback(token) {
  return axiosInstance.get(`/auth/verify/callback?token=${token}`);
}

function registerUser(userProfile) {
  return axiosInstance.post(`/auth/register-user`, userProfile);
}

function googleCallback(token) {
  return axiosInstance.post(`/auth/google/callback`, {
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
