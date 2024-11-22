/**
 * @typedef {object} Pagination
 * @property {number} page
 * @property {number} perPage
 */

import axios from "axios";

// TODO put into env
const API_URL = "http://localhost:5000";

const axiosInstance = axios.create({
  withCredentials: true,
  baseURL: API_URL + "/api",
});

export { API_URL, axiosInstance };
