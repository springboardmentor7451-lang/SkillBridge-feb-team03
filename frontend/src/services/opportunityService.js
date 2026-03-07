import api from "./api";

const opportunityService = {
  // Create new opportunity (NGO only)
  createOpportunity: async (opportunityData) => {
    return api.post("/opportunities", opportunityData);
  },

  // Get all opportunities
  getAllOpportunities: async (filters = {}) => {
    const params = new URLSearchParams();

    if (filters.skills) params.append('skills', filters.skills);
    if (filters.location) params.append('location', filters.location);
    if (filters.duration) params.append('duration', filters.duration);
    if (filters.status) params.append('status', filters.status);

    const queryString = params.toString();
    const url = queryString ? `/opportunities?${queryString}` : '/opportunities';

    return api.get(url);
  },

  // Get single opportunity by ID
  getOpportunityById: async (id) => {
    return api.get(`/opportunities/${id}`);
  },

  // Get logged-in NGO's opportunities
  getMyOpportunities: async () => {
    return api.get("/opportunities/my");
  },

  // Update opportunity (NGO owner only)
  updateOpportunity: async (id, opportunityData) => {
    return api.put(`/opportunities/${id}`, opportunityData);
  },

  // Delete opportunity (NGO owner only)
  deleteOpportunity: async (id) => {
    return api.delete(`/opportunities/${id}`);
  },
};

export default opportunityService;
