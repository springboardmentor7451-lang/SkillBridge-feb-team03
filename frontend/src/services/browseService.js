import api from "./api";

const browseService = {
  // Get NGOs for volunteers
  getNGOs: async (filters = {}) => {
    const query = new URLSearchParams(filters).toString();
    const response = await api.get(`/browse/ngos?${query}`);
    return response.data;
  },

  // Get Volunteers for NGOs
  getVolunteers: async (filters = {}) => {
    const query = new URLSearchParams(filters).toString();
    const response = await api.get(`/browse/volunteers?${query}`);
    return response.data;
  },

  // Get user profile with ratings
  getUserProfile: async (userId) => {
    const response = await api.get(`/browse/profile/${userId}`);
    return response.data;
  },

  // Create connection
  createConnection: async (toUserId, message = "") => {
    const response = await api.post("/browse/connect", {
      toUserId,
      message,
    });
    return response.data;
  },

  // Accept connection
  acceptConnection: async (fromUserId) => {
    const response = await api.put(`/browse/connect/${fromUserId}`);
    return response.data;
  },

  // Get connections
  getConnections: async (status = "connected") => {
    const response = await api.get(`/browse/connections?status=${status}`);
    return response.data;
  },

  // Submit rating
  submitRating: async (toUserId, rating, feedback = "", opportunityId = null) => {
    const response = await api.post("/browse/rate", {
      toUserId,
      rating,
      feedback,
      opportunityId,
    });
    return response.data;
  },

  // Get ratings for a user
  getRatings: async (userId) => {
    const response = await api.get(`/browse/ratings/${userId}`);
    return response.data;
  },
};

export default browseService;
