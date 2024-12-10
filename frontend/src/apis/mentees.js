import { axiosInstance } from "./commons";
function editProfile(menteeId,data){
    return axiosInstance.post(`/mentees/${menteeId}/edit`,data);
  }
  export { editProfile};
