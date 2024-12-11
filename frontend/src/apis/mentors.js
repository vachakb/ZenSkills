import { axiosInstance } from "./commons";

/**
 * @typedef {object} GetAllMentorsParams
 * @property {string} search
 * @property {Array.<string>} tags
 * @property {number} noOfMenteesMentored
 */

/**
 * @param params {import("./commons").Pagination | GetAllMentorsParams}
 */
function getAllMentors(params) {
  return axiosInstance.get(`/mentors`, { params: params });
}

function getAllMentorTags() {
  return axiosInstance.get(`/mentors/tags`);
}

function getMentorProfile(mentorId) {
  return axiosInstance.get(`/mentors/${mentorId}`);
}

function getAllReviews(mentorId) {
  return axiosInstance.get(`/mentors/reviews/${mentorId}`);
}

function createReview(mentorId, body) {
  return axiosInstance.post(`/mentors/reviews/${mentorId}`, body);
}

function getMentorsList() {
  return axiosInstance.get("/mentors/list");
}

function createReferral(body) {
  return axiosInstance.post("/mentors/referral", body);
}

export {
  getAllMentors,
  getAllMentorTags,
  getMentorProfile,
  getAllReviews,
  createReview,
  getMentorsList,
  createReferral,
};
