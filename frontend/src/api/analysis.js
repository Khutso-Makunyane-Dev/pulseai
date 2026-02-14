import api from "./auth";

/** Send text to AI for analysis */
export const analyzeText = async (text, chatId = null) => {
  const response = await api.post("/analysis/", { text, chat_id: chatId });
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
  return response.data.map((msg) => {
    // If content is already an object (backend already parsed it)
    if (typeof msg.content === 'object' && msg.content !== null) {
      return {
        id: msg.id,
        type: msg.role === "user" ? "user" : "ai",
        ...msg.content,
        created_at: msg.created_at,
      };
    }
    
    // Otherwise, try to parse it as JSON string
    let parsedContent = { text: msg.content };
    try {
      if (msg.content.startsWith('{') || msg.content.startsWith('[')) {
        parsedContent = JSON.parse(msg.content);
      }
    } catch (e) {
      // Not JSON, keep as text
    }

    return {
      id: msg.id,
      type: msg.role === "user" ? "user" : "ai",
      text: parsedContent.text || msg.content,
      summary: parsedContent.summary,
      sentiment: parsedContent.sentiment,
      topics: parsedContent.topics,
      feedback: parsedContent.feedback,
      risk: parsedContent.risk,
      created_at: msg.created_at,
    };
  });
};

/** Send a message in a chat */
export const sendChatMessage = async (chatId, message) => {
  const payload = {
    role: message.role,
    content: message.role === "ai" && typeof message.content === 'object'
      ? message.content
      : message.content,
    risk: message.risk || 0
  };
  
  const response = await api.post(`/analysis/chats/${chatId}/messages`, payload);
  return response.data;
};

/** Delete a chat */
export const deleteChat = async (chatId) => {
  const response = await api.delete(`/analysis/chats/${chatId}`);
  return response.data;
};

/** Update chat title */
export const updateChatTitle = async (chatId, title) => {
  const response = await api.patch(`/analysis/chats/${chatId}/title`, { title });
  return response.data;
};