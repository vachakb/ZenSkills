import { axiosInstance } from "./commons";

function getAllAvailableChatUsers() {
  return axiosInstance.get("/chat/users");
}

function getAllConversations() {
  return axiosInstance.get("/chat/conversations");
}

function createConversation(body) {
  return axiosInstance.post("/chat/conversation", body);
}

function saveAttachment(file) {
  const formData = new FormData();
  formData.append("attachment", file);
  return axiosInstance.post("/chat/attachment", formData);
}

function downloadAttachment(id) {
  return axiosInstance.get("/chat/attachment/" + id, { responseType: "blob" });
}

export {
  getAllAvailableChatUsers,
  getAllConversations,
  createConversation,
  saveAttachment,
  downloadAttachment,
};
