import { axiosInstance } from "./commons";

function getAllConversations(params) {
  return axiosInstance.get(`/chat/conversations`);
}

export { getAllConversations };
