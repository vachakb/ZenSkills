import { axiosInstance } from "./commons";
function editProfile(userId,data){
    return axiosInstance.post(`/mentees/${menteeId}/edit`,data);
  }
  export { editProfile};
