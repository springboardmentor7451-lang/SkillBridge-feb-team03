import api from "./api";

const applicationService = {
  // Apply to an opportunity
  applyToOpportunity: async (opportunityId, coverLetter = "") => {
    console.log("applicationService.applyToOpportunity called with:", { opportunityId, coverLetter });
    const result = await api.post("/applications", {
      opportunity_id: opportunityId,
      cover_letter: coverLetter,
    });
    console.log("applicationService.applyToOpportunity result:", result);
    return result;
  },

  // Get volunteer's applications
  getMyApplications: async () => {
    return api.get("/applications/my");
  },

  // Get NGO's applications
  getNGOApplications: async () => {
    return api.get("/applications/ngo");
  },

  // Get opportunity's applications (NGO only)
  getOpportunityApplications: async (opportunityId) => {
    return api.get(`/applications/opportunity/${opportunityId}`);
  },

  // Update application status (NGO only)
  updateApplicationStatus: async (applicationId, status) => {
    return api.put(`/applications/${applicationId}`, { status });
  },
};

export default applicationService;
