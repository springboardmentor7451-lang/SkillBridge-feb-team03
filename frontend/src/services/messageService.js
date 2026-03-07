import api from "./api";

const messageService = {
  // Send a message
  sendMessage: async (conversationId, content) => {
    return api.post("/messages", {
      conversation_id: conversationId,
      content,
    });
  },

  // Get messages for a conversation
  getMessages: async (conversationId) => {
    return api.get(`/messages/conversation/${conversationId}`);
  },

  // Mark messages as read
  markMessagesAsRead: async (conversationId) => {
    return api.put(`/messages/conversation/${conversationId}/read`);
  },
};

export default messageService;