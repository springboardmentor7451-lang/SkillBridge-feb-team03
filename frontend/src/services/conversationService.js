import api from "./api";

const conversationService = {
  // Get user's conversations
  getUserConversations: async () => {
    return api.get("/conversations");
  },

  // Get single conversation with messages
  getConversation: async (conversationId) => {
    return api.get(`/conversations/${conversationId}`);
  },

  // Close conversation
  closeConversation: async (conversationId) => {
    return api.put(`/conversations/${conversationId}/close`);
  },
};

export default conversationService;