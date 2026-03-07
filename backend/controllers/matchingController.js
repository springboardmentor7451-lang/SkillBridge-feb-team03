const Opportunity = require("../models/opportunity");
const User = require("../models/user");
const mongoose = require("mongoose");

// Get match suggestions for a volunteer
exports.getMatchSuggestions = async (req, res) => {
  try {
    const volunteer_id = req.user;

    // Get volunteer details
    const volunteer = await User.findById(volunteer_id);
    if (!volunteer) {
      return res.status(404).json({ message: "Volunteer not found" });
    }

    const { skills, location } = volunteer;

    // Build match criteria
    let matchCriteria = {
      status: "open"
    };

    // Skills matching: opportunities that have at least one matching skill
    if (skills && skills.length > 0) {
      matchCriteria.required_skills = { $in: skills };
    }

    // Location matching: exact match or similar locations
    if (location && location.trim()) {
      matchCriteria.$or = [
        { location: new RegExp(location.trim(), 'i') },
        { location: new RegExp('remote', 'i') } // Always include remote opportunities
      ];
    }

    console.log('Match criteria:', matchCriteria);

    // Find matching opportunities
    const opportunities = await Opportunity.find(matchCriteria)
      .populate("ngo_id", "organization_name location contact_email")
      .sort({ createdAt: -1 })
      .limit(10); // Limit to top 10 matches

    // Calculate match scores
    const suggestions = opportunities.map(opp => {
      let score = 0;
      let reasons = [];

      // Skills match score
      if (skills && skills.length > 0 && opp.required_skills && opp.required_skills.length > 0) {
        const matchingSkills = skills.filter(skill =>
          opp.required_skills.some(reqSkill =>
            reqSkill.toLowerCase().includes(skill.toLowerCase()) ||
            skill.toLowerCase().includes(reqSkill.toLowerCase())
          )
        );
        if (matchingSkills.length > 0) {
          score += matchingSkills.length * 20; // 20 points per matching skill
          reasons.push(`${matchingSkills.length} skill match(es)`);
        }
      }

      // Location match score
      if (location && opp.location) {
        if (opp.location.toLowerCase().includes(location.toLowerCase()) ||
            location.toLowerCase().includes(opp.location.toLowerCase())) {
          score += 30; // 30 points for location match
          reasons.push('Location match');
        } else if (opp.location.toLowerCase().includes('remote')) {
          score += 15; // 15 points for remote opportunities
          reasons.push('Remote opportunity');
        }
      }

      // Recency bonus
      const daysSincePosted = Math.floor((Date.now() - new Date(opp.createdAt)) / (1000 * 60 * 60 * 24));
      if (daysSincePosted <= 7) {
        score += 10; // 10 points for recent postings
        reasons.push('Recently posted');
      }

      return {
        ...opp.toObject(),
        matchScore: score,
        matchReasons: reasons
      };
    });

    // Sort by match score (highest first)
    suggestions.sort((a, b) => b.matchScore - a.matchScore);

    res.json({
      message: "Match suggestions retrieved",
      suggestions,
      volunteer: {
        name: volunteer.name,
        skills: volunteer.skills,
        location: volunteer.location
      }
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
      opportunities.flatMap(opp => opp.required_skills || [])
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
    const matches = volunteers.map(volunteer => {
      let score = 0;
      let matchingOpportunities = [];

      opportunities.forEach(opp => {
        let oppScore = 0;
        let reasons = [];

        // Skills match
        if (volunteer.skills && volunteer.skills.length > 0 &&
            opp.required_skills && opp.required_skills.length > 0) {
          const matchingSkills = volunteer.skills.filter(skill =>
            opp.required_skills.some(reqSkill =>
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
          if (opp.location.toLowerCase().includes(volunteer.location.toLowerCase()) ||
              volunteer.location.toLowerCase().includes(opp.location.toLowerCase())) {
            oppScore += 25;
            reasons.push('Location match');
          }
        }

        if (oppScore > 0) {
          score = Math.max(score, oppScore); // Take the best opportunity match
          matchingOpportunities.push({
            opportunity: opp,
            score: oppScore,
            reasons
          });
        }
      });

      return {
        volunteer: volunteer.toObject(),
        matchScore: score,
        matchingOpportunities: matchingOpportunities.slice(0, 3) // Top 3 matching opportunities
      };
    });

    // Sort by match score and filter out low matches
    const filteredMatches = matches
      .filter(match => match.matchScore > 10)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 20); // Top 20 matches

    res.json({
      message: "Volunteer matches retrieved",
      matches: filteredMatches
    });
  } catch (error) {
    console.error("Get volunteer matches error:", error);
    res.status(500).json({ message: "Error getting volunteer matches", error: error.message });
  }
};