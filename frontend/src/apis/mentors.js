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

export { getAllMentors, getAllMentorTags, getMentorProfile };
