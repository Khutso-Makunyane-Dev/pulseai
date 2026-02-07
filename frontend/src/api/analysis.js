import api from "./auth";

/** Send text to AI for analysis */
export const analyzeText = async (text) => {
  const response = await api.post("/analysis/", { text });
  return response.data;
};

/** Fetch user's analysis history */
export const getAnalysisHistory = async () => {
  const response = await api.get("/analysis/history");
  return response.data;
};

/** Get all chats for the user */
export const getChats = async () => {
  const response = await api.get("/analysis/chats");
  return response.data;
};

/** Create a new chat */
export const createChat = async (data) => {
  const response = await api.post("/analysis/chats", data);
  return response.data;
};

/** Get messages for a specific chat */
export const getChatMessages = async (chatId) => {
  const response = await api.get(`/analysis/chats/${chatId}/messages`);
  return response.data.map((msg) => ({
    id: msg.id,
    type: msg.role === "user" ? "user" : "ai",
    text: msg.content,
    created_at: msg.created_at,
  }));
};

/** Send a message in a chat */
export const sendChatMessage = async (chatId, message) => {
  const response = await api.post(`/analysis/chats/${chatId}/messages`, message);
  return response.data;
};

/** Delete a chat */
export const deleteChat = async (chatId) => {
  const response = await api.delete(`/analysis/chats/${chatId}`);
  return response.data;
};
