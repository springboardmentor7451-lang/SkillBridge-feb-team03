import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "../components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import browseService from "../services/browseService";
import conversationService from "../services/conversationService";

export default function BrowseNGOs() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [ngos, setNgos] = useState([]);
  const [loadingNgos, setLoadingNgos] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    location: '',
  });
  const [sortBy, setSortBy] = useState('newest');
  const [selectedNGO, setSelectedNGO] = useState(null);
  const [showNGOModal, setShowNGOModal] = useState(false);
  const [ngoDetails, setNGODetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [ratings, setRatings] = useState([]);
  const [userRating, setUserRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [submittingRating, setSubmittingRating] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [connectedIds, setConnectedIds] = useState(new Set());

  useEffect(() => {
    if (!loading && user?.role === "volunteer") {
      fetchNGOs();
    }
  }, [user, loading]);

  const fetchNGOs = async (activeFilters = filters, sortOption = sortBy) => {
    try {
      setLoadingNgos(true);
      const response = await browseService.getNGOs({
        search: activeFilters.search,
        location: activeFilters.location,
        sortBy: sortOption,
        limit: 50,
        offset: 0,
      });
      setNgos(response.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load NGOs');
    } finally {
      setLoadingNgos(false);
    }
  };

  const handleFilterChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    fetchNGOs(newFilters, sortBy);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    fetchNGOs(filters, value);
  };

  const fetchNGODetails = async (ngoId) => {
    try {
      setLoadingDetails(true);
      const response = await browseService.getUserProfile(ngoId);
      setNGODetails({
        ...response.user,
        averageRating: response.averageRating,
        ratingCount: response.ratingCount,
      });
      setRatings(response.ratings);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load NGO details');
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleViewDetails = (ngo) => {
    setSelectedNGO(ngo);
    setShowNGOModal(true);
    fetchNGODetails(ngo._id);
    setUserRating(0);
    setFeedbackText('');
  };

  const handleSubmitRating = async () => {
    if (userRating === 0) {
      toast.error('Please select a rating');
      return;
    }

    try {
      setSubmittingRating(true);
      await browseService.submitRating(
        selectedNGO._id,
        userRating,
        feedbackText
      );
      toast.success('Rating submitted successfully!');
      setUserRating(0);
      setFeedbackText('');
      fetchNGODetails(selectedNGO._id);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to submit rating');
    } finally {
      setSubmittingRating(false);
    }
  };

  const handleMessage = async (ngoId) => {
    try {
      setConnecting(true);
      const response = await conversationService.createDirectConversation(ngoId);
      navigate("/chat", {
        state: {
          conversationId: response.data.conversation._id,
        },
      });
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to open message');
    } finally {
      setConnecting(false);
    }
  };

  const getRatingStars = (count) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={`text-lg ${i < count ? 'text-yellow-400' : 'text-gray-300'}`}>
            ★
          </span>
        ))}
      </div>
    );
  };

  const getInitials = (value = "") =>
    String(value)
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "N";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navbar />
      
      <main className="mx-auto max-w-6xl space-y-6 px-4 py-8 md:px-6 md:py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-2"
        >
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Discover NGOs</h1>
          <p className="text-lg text-slate-600">Find organizations working towards causes you care about</p>
        </motion.div>

        {/* Filters & Sort Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-lg shadow-md p-6 mb-8 border border-slate-200"
        >
          <div className="flex flex-col md:flex-row gap-4 items-end justify-between">
            <div className="grid grid-cols-1 md:grid-cols-2 flex-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Search</label>
                <Input
                  placeholder="Search NGO names..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
                <Input
                  placeholder="Filter by location..."
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                />
              </div>
            </div>
            
            {/* Sort Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full md:w-auto">
                  Sort: {sortBy === 'newest' ? 'Newest' : sortBy === 'oldest' ? 'Oldest' : sortBy === 'matchScore' ? 'Best Match' : 'Highest Rated'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleSortChange('newest')} className={sortBy === 'newest' ? 'bg-orange-100' : ''}>
                  Newest
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSortChange('oldest')} className={sortBy === 'oldest' ? 'bg-orange-100' : ''}>
                  Oldest
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSortChange('matchScore')} className={sortBy === 'matchScore' ? 'bg-orange-100' : ''}>
                  Best Match
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSortChange('rating')} className={sortBy === 'rating' ? 'bg-orange-100' : ''}>
                  Highest Rated
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </motion.div>

        {/* NGOs Grid */}
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col gap-6"
          >
            {loadingNgos ? (
              <div className="col-span-full flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-400"></div>
              </div>
            ) : ngos.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-slate-600 text-lg">No NGOs found</p>
              </div>
            ) : (
              ngos.map((ngo, index) => (
                <motion.div
                  key={ngo._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="w-full"
                >
                  <Card className="cursor-pointer overflow-hidden border-slate-200 transition-shadow hover:shadow-lg">
                    <div className="flex flex-col gap-6 p-6 lg:flex-row lg:items-start">
                      <div className="flex w-full items-start gap-4 lg:max-w-[14rem] lg:flex-shrink-0 lg:justify-center">
                        <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 text-xl font-bold text-white shadow-sm lg:h-40 lg:w-40 lg:rounded-3xl">
                          {ngo.profile_picture_url ? (
                            <img
                              src={ngo.profile_picture_url}
                              alt={`${ngo.organization_name} profile`}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            getInitials(ngo.organization_name)
                          )}
                        </div>

                        <div className="min-w-0 flex-1 lg:hidden">
                          {ngo.matchScore > 0 && (
                            <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-800">
                              {ngo.matchScore}% Match
                            </span>
                          )}
                          <h3 className="mt-2 text-xl font-bold text-slate-900">{ngo.organization_name}</h3>
                          <p className="mt-1 text-sm text-slate-500">{ngo.location}</p>
                        </div>
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="hidden lg:block">
                          <div className="mb-3 flex items-center gap-3">
                            {ngo.matchScore > 0 && (
                              <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-800">
                                {ngo.matchScore}% Match
                              </span>
                            )}
                            <p className="text-sm text-slate-500">{ngo.location}</p>
                          </div>
                          <h3 className="text-2xl font-bold text-slate-900">{ngo.organization_name}</h3>
                        </div>

                        <p className="mt-4 max-w-4xl text-slate-600 line-clamp-3">
                          {ngo.organization_description}
                        </p>

                        <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,22rem)] lg:items-start">
                          <div className="space-y-4">
                            {ngo.ratingCount > 0 && (
                              <div className="flex items-center gap-2">
                                <div className="flex gap-0.5">
                                  {getRatingStars(Math.round(ngo.averageRating))}
                                </div>
                                <span className="text-sm text-slate-700">
                                  {ngo.averageRating} ({ngo.ratingCount})
                                </span>
                              </div>
                            )}

                            {ngo.matchedSkills && ngo.matchedSkills.length > 0 && (
                              <div>
                                <p className="mb-2 text-sm font-semibold text-slate-700">Matched Skills</p>
                                <div className="flex flex-wrap gap-2">
                                  {ngo.matchedSkills.map((skill, idx) => (
                                    <span
                                      key={idx}
                                      className="inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-800"
                                    >
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <p className="text-sm font-semibold text-slate-900">Contact</p>
                            <p className="mt-1 text-sm text-slate-700"><span className="font-medium">Email:</span> {ngo.email}</p>
                            {ngo.website_url && (
                              <p className="mt-1 text-sm text-slate-700 break-all">
                                <span className="font-medium">Website:</span> {ngo.website_url}
                              </p>
                            )}

                            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                              <Button 
                                className="flex-1 bg-orange-600 hover:bg-orange-700"
                                onClick={() => handleViewDetails(ngo)}
                              >
                                View Profile
                              </Button>
                              <Button 
                                onClick={() => handleMessage(ngo._id)}
                                disabled={connecting}
                                variant="outline"
                                className="flex-1"
                              >
                                Message
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))
            )}
          </motion.div>
        </AnimatePresence>

        {/* NGO Details Modal */}
        <Dialog open={showNGOModal} onOpenChange={setShowNGOModal}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            {loadingDetails ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-400"></div>
              </div>
            ) : ngoDetails && (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 text-lg font-bold text-white shadow-sm">
                      {ngoDetails.profile_picture_url ? (
                        <img
                          src={ngoDetails.profile_picture_url}
                          alt={`${ngoDetails.organization_name} profile`}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        getInitials(ngoDetails.organization_name)
                      )}
                    </div>
                    <div>
                      <DialogTitle className="text-2xl">{ngoDetails.organization_name}</DialogTitle>
                      <DialogDescription>{ngoDetails.location}</DialogDescription>
                    </div>
                  </div>
                </DialogHeader>

                <div className="space-y-6">
                  {/* Basic Info */}
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">About Organization</h4>
                    <p className="text-slate-700">{ngoDetails.organization_description}</p>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2">
                    <p className="text-slate-700"><span className="font-semibold">Email:</span> {ngoDetails.email}</p>
                    {ngoDetails.website_url && (
                      <p className="text-slate-700">
                        <span className="font-semibold">Website:</span>{' '}
                        <a href={ngoDetails.website_url} target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline">
                          {ngoDetails.website_url}
                        </a>
                      </p>
                    )}
                  </div>

                  {/* Match Score */}
                  {selectedNGO?.matchScore > 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-sm font-semibold text-green-900">Match Score: {selectedNGO.matchScore}%</p>
                      {selectedNGO.matchedSkills && selectedNGO.matchedSkills.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm text-green-800 mb-2">Your Matched Skills:</p>
                          <div className="flex flex-wrap gap-2">
                            {selectedNGO.matchedSkills.map((skill, idx) => (
                              <span key={idx} className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Ratings Section */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-slate-900">Ratings & Reviews</h4>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Overall Rating</p>
                      {ngoDetails.averageRating ? (
                        <div className="mt-2 flex flex-wrap items-center gap-3">
                          <div className="flex gap-0.5">
                            {getRatingStars(Math.round(ngoDetails.averageRating))}
                          </div>
                          <p className="text-sm font-semibold text-slate-800">
                            {ngoDetails.averageRating} out of 5
                          </p>
                          <p className="text-sm text-slate-600">
                            Based on {ngoDetails.ratingCount} review{ngoDetails.ratingCount === 1 ? "" : "s"}
                          </p>
                        </div>
                      ) : (
                        <p className="mt-2 text-sm text-slate-600">No ratings yet</p>
                      )}
                    </div>

                    {/* Rating Form */}
                    <div className="border-t pt-4">
                      <h5 className="font-medium text-slate-900 mb-3">Leave a Review</h5>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium text-slate-700 mb-2">Your Rating</p>
                          <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                onClick={() => setUserRating(star)}
                                className="text-3xl transition-transform hover:scale-110"
                              >
                                <span className={userRating >= star ? 'text-yellow-400' : 'text-gray-300'}>
                                  ★
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-slate-700 mb-1 block">Feedback (Optional)</label>
                          <textarea
                            className="w-full p-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                            rows="3"
                            placeholder="Share your experience..."
                            value={feedbackText}
                            onChange={(e) => setFeedbackText(e.target.value)}
                          />
                        </div>

                        <Button 
                          onClick={handleSubmitRating}
                          disabled={submittingRating || userRating === 0}
                          className="w-full bg-orange-600 hover:bg-orange-700"
                        >
                          {submittingRating ? 'Submitting...' : 'Submit Review'}
                        </Button>
                      </div>
                    </div>

                    {/* Reviews List */}
                    {ratings.length > 0 && (
                      <div className="border-t pt-4 space-y-3">
                        <h5 className="font-medium text-slate-900">Recent Reviews</h5>
                        {ratings.slice(0, 5).map((rating) => (
                          <div key={rating._id} className="bg-slate-50 p-3 rounded-lg">
                            <div className="flex items-center justify-between mb-1">
                              <p className="font-medium text-slate-900">{rating.fromUser.name}</p>
                              <div className="flex gap-0.5">
                                {getRatingStars(rating.rating)}
                              </div>
                            </div>
                            {rating.feedback && (
                              <p className="text-sm text-slate-700">{rating.feedback}</p>
                            )}
                            <p className="text-xs text-slate-500 mt-1">
                              {new Date(rating.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <Button 
                    onClick={() => handleMessage(ngoDetails._id)}
                    disabled={connecting}
                    className="w-full bg-orange-600 hover:bg-orange-700"
                  >
                    Message
                  </Button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
