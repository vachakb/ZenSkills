import { axiosInstance } from "./commons";
function createJob(job){
    return axiosInstance.post(`/jobs`,job);
  }
  export {createJob};