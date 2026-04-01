import api from "./api";

const matchingService = {
  // Milestone 4 contract endpoint
  getVolunteerOpportunityMatches: async () => {
    return api.get("/match/opportunities");
  },

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