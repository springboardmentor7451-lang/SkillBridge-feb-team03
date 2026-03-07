import api from "./api";

const matchingService = {
  // Get match suggestions for volunteers
  getMatchSuggestions: async () => {
    return api.get("/matching/suggestions");
  },

  // Get volunteer matches for NGOs
  getVolunteerMatches: async () => {
    return api.get("/matching/volunteers");
  },
};

export default matchingService;