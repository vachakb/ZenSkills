import { axiosInstance } from "./commons";
function totalMenteeMentored(id) {
    return axiosInstance.get(`/mentorstat/totalMenteeMentored`);
  }
  function menteesMentoredMonthWise() {
    return axiosInstance.get("/mentorStat/menteesMentoredMonthWise");
  }
  function newMenteesMentoredPerMonth() {
    return axiosInstance.get("/mentorStat/newMenteesMentoredPerMonth");
  }
  function getMentorRating() {
    return axiosInstance.get("/mentorStat/mentorRating");
  }
  function getTotalSessions(){
    return axiosInstance.get("/mentorStat/totalSessionsConducted");
  }
  function getSessionDistribution() {
    return axiosInstance.get("/mentorStat/sessionDistribution");
  }
  
  export { totalMenteeMentored,menteesMentoredMonthWise,newMenteesMentoredPerMonth,getMentorRating,getTotalSessions,getSessionDistribution };