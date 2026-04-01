import api from "./api";

const userService = {
  // Get logged-in user profile
  getProfile: async () => {
    return api.get("/users/me");
  },

  // Update user profile
  updateProfile: async (userData) => {
    return api.put("/users/me", userData);
  },

  changePassword: async (payload) => {
    return api.put("/users/me/password", payload);
  },

  requestEmailChange: async (payload) => {
    return api.post("/users/me/email-request", payload);
  },

  deleteAccount: async () => {
    return api.delete("/users/me");
  },
};

export default userService;
