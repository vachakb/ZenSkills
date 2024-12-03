import { axiosInstance } from "./commons";

function getAllConversations() {
  return axiosInstance.get("/chat/conversations");
}

function saveAttachment(file) {
  const formData = new FormData();
  formData.append("attachment", file);
  return axiosInstance.post("/chat/attachment", formData);
}

function downloadAttachment(id) {
  return axiosInstance.get("/chat/attachment/" + id, { responseType: "blob" });
}

export { getAllConversations, saveAttachment, downloadAttachment };
