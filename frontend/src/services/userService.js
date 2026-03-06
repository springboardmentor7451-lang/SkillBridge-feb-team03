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
};

export default userService;
