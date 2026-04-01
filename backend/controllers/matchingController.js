const Opportunity = require("../models/opportunity");
const User = require("../models/user");

const normalizeText = (value) => String(value || "").trim().toLowerCase();
const parseCommaValues = (value) =>
  String(value || "")
    .split(",")
    .map((item) => normalizeText(item))
    .filter(Boolean);

// Get match suggestions for a volunteer
exports.getMatchSuggestions = async (req, res) => {
  try {
    const volunteer_id = req.user;

    // Get volunteer details
    const volunteer = await User.findById(volunteer_id);
    if (!volunteer) {
      return res.status(404).json({ message: "Volunteer not found" });
    }

    const volunteerSkills = (volunteer.skills || [])
      .map((skill) => normalizeText(skill))
      .filter(Boolean);
    const volunteerLocationTokens = parseCommaValues(volunteer.location);

    // Fetch open opportunities and score in memory to avoid strict case-sensitive DB filtering.
    const opportunities = await Opportunity.find({ status: "open" })
      .populate("ngo_id", "name email location organization_name organization_description website_url")
      .sort({ createdAt: -1 })
      .limit(100);

    const suggestions = opportunities
      .map((opp) => {
        const requiredSkills = (opp.required_skills || [])
          .map((skill) => normalizeText(skill))
          .filter(Boolean);

        let matchPercentage = 0;
        const reasons = [];

        if (volunteerSkills.length > 0 && requiredSkills.length > 0) {
          const matchedRequiredSkills = requiredSkills.filter((requiredSkill) =>
            volunteerSkills.some((userSkill) => userSkill === requiredSkill)
          );

          const uniqueMatches = [...new Set(matchedRequiredSkills)];
          if (uniqueMatches.length > 0) {
            matchPercentage = Math.round(
              (uniqueMatches.length / requiredSkills.length) * 100
            );
            reasons.push(`${uniqueMatches.length}/${requiredSkills.length} skills match`);
          }
        }

        const oppLocationTokens = parseCommaValues(opp.location);
        if (volunteerLocationTokens.length > 0 && oppLocationTokens.length > 0) {
          const hasLocationOverlap = oppLocationTokens.some((oppToken) =>
            volunteerLocationTokens.includes(oppToken)
          );

          if (hasLocationOverlap) {
            reasons.push("Location match");
          } else if (oppLocationTokens.includes("remote")) {
            reasons.push("Remote opportunity");
          }
        }

        return {
          ...opp.toObject(),
          matchScore: matchPercentage,
          matchReasons: reasons,
        };
      })
      .filter((item) => item.matchScore > 0 || item.matchReasons.length > 0)
      .sort((a, b) => b.matchScore - a.matchScore);

    res.json({
      message: "Match suggestions retrieved",
      suggestions,
      volunteer: {
        name: volunteer.name,
        skills: volunteer.skills,
        location: volunteer.location,
      },
    });
  } catch (error) {
    console.error("Get match suggestions error:", error);
    res.status(500).json({ message: "Error getting match suggestions", error: error.message });
  }
};

// Get match suggestions for an NGO (volunteers who match their opportunities)
exports.getVolunteerMatches = async (req, res) => {
  try {
    const ngo_id = req.user;

    // Get NGO's opportunities
    const opportunities = await Opportunity.find({ ngo_id, status: "open" });

    if (opportunities.length === 0) {
      return res.json({
        message: "No open opportunities found",
        matches: []
      });
    }

    // Collect all required skills from NGO's opportunities
    const allRequiredSkills = [...new Set(
      opportunities.flatMap((opp) => opp.required_skills || [])
    )];

    // Find volunteers who have matching skills
    const skillMatchCriteria = allRequiredSkills.length > 0
      ? { skills: { $in: allRequiredSkills } }
      : {};

    const volunteers = await User.find({
      role: "volunteer",
      ...skillMatchCriteria
    }).select("name email skills location bio");

    // Calculate match scores for each volunteer
    const matches = volunteers.map((volunteer) => {
      let score = 0;
      let matchingOpportunities = [];

      opportunities.forEach((opp) => {
        let oppScore = 0;
        let reasons = [];

        // Skills match
        if (
          volunteer.skills && volunteer.skills.length > 0 &&
          opp.required_skills && opp.required_skills.length > 0
        ) {
          const matchingSkills = volunteer.skills.filter((skill) =>
            opp.required_skills.some((reqSkill) =>
              reqSkill.toLowerCase().includes(skill.toLowerCase()) ||
              skill.toLowerCase().includes(reqSkill.toLowerCase())
            )
          );
          if (matchingSkills.length > 0) {
            oppScore += matchingSkills.length * 15;
            reasons.push(`${matchingSkills.length} skill match(es)`);
          }
        }

        // Location match
        if (volunteer.location && opp.location) {
          if (
            opp.location.toLowerCase().includes(volunteer.location.toLowerCase()) ||
            volunteer.location.toLowerCase().includes(opp.location.toLowerCase())
          ) {
            oppScore += 25;
            reasons.push("Location match");
          }
        }

        if (oppScore > 0) {
          score = Math.max(score, oppScore); // Take the best opportunity match
          matchingOpportunities.push({
            opportunity: opp,
            score: oppScore,
            reasons,
          });
        }
      });

      return {
        volunteer: volunteer.toObject(),
        matchScore: score,
        matchingOpportunities: matchingOpportunities.slice(0, 3), // Top 3 matching opportunities
      };
    });

    // Sort by match score and filter out low matches
    const filteredMatches = matches
      .filter((match) => match.matchScore > 10)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 20); // Top 20 matches

    res.json({
      message: "Volunteer matches retrieved",
      matches: filteredMatches,
    });
  } catch (error) {
    console.error("Get volunteer matches error:", error);
    res.status(500).json({ message: "Error getting volunteer matches", error: error.message });
  }
};

// Contract alias for volunteers: GET /api/match/opportunities
exports.getMatchedOpportunities = exports.getMatchSuggestions;

// Optional advanced endpoint: NGO -> volunteer matches for a specific opportunity
exports.getVolunteersForOpportunity = async (req, res) => {
  try {
    const ngo_id = req.user;
    const { opportunityId } = req.params;

    const opportunity = await Opportunity.findOne({
      _id: opportunityId,
      ngo_id,
      status: "open",
    });

    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    const requiredSkills = opportunity.required_skills || [];
    const volunteers = await User.find({
      role: "volunteer",
      ...(requiredSkills.length > 0 ? { skills: { $in: requiredSkills } } : {}),
    }).select("name email skills location bio");

    const matches = volunteers
      .map((volunteer) => {
        const volunteerSkills = volunteer.skills || [];
        const overlap = volunteerSkills.filter((skill) =>
          requiredSkills.some(
            (requiredSkill) =>
              requiredSkill.toLowerCase().includes(skill.toLowerCase()) ||
              skill.toLowerCase().includes(requiredSkill.toLowerCase())
          )
        );

        const matchScore = requiredSkills.length
          ? Math.round((overlap.length / requiredSkills.length) * 100)
          : 0;

        return {
          volunteer: volunteer.toObject(),
          matchScore,
          matchedSkills: overlap,
        };
      })
      .sort((a, b) => b.matchScore - a.matchScore);

    res.json({
      message: "Volunteer matches retrieved",
      opportunity: {
        _id: opportunity._id,
        title: opportunity.title,
      },
      matches,
    });
  } catch (error) {
    console.error("Get volunteers for opportunity error:", error);
    res.status(500).json({ message: "Error getting volunteer matches", error: error.message });
  }
};
