import { axiosInstance } from "./commons";

export function getUserAnalytics() {
  return axiosInstance.get("/admin/analytics/users");
}

export function getSessionAnalytics() {
  return axiosInstance.get("/admin/analytics/sessions");
}

export function getWorkshopAnalytics() {
  return axiosInstance.get("/admin/analytics/workshops");
}

export function getMentorsToVerify() {
  return axiosInstance.get("/admin/mentors");
}

export function verifyMentor(id) {
  return axiosInstance.put(`/admin/mentor/${id}/verify`);
}

export function deleteMentor(id) {
  return axiosInstance.delete(`/admin/mentor/${id}`);
}
