import { axiosInstance } from "./commons";

function getMentorsToVerify() {
  return axiosInstance.get("/admin/mentors");
}

function verifyMentor(id) {
  return axiosInstance.put(`/admin/mentor/${id}/verify`);
}

function deleteMentor(id) {
  return axiosInstance.delete(`/admin/mentor/${id}`);
}

export { getMentorsToVerify, verifyMentor, deleteMentor };
