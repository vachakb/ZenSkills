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

function uploadImage(image) {
  const formData = new FormData();
  formData.append("file", image);
  return axiosInstance.post("/image", formData);
}
function uploadDocuments(data) {
  return axiosInstance.post("/file", data);
}

export { API_URL, axiosInstance, uploadImage,uploadDocuments };
