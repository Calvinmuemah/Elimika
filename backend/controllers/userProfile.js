const UserProfile = require('../models/userProfile');

// create
const createProfile = async (req, res) => {
  try {
    // 1. Get the user ID from the authenticated request
    // IMPORTANT: This assumes your route for createProfile has the 'protect' middleware
    const userId = req.user.id; // From your JWT payload, set by authMiddleware

    // 2. Ensure a profile for this user doesn't already exist to prevent duplicates
    // While updateOnboardingProfile with upsert handles this better,
    // if createProfile must exist, it should check.
    const existingProfile = await UserProfile.findOne({ user: userId });
    if (existingProfile) {
      return res.status(409).json({ message: 'Profile already exists for this user. Please update instead.' });
    }

    // 3. Create the profile, associating it with the authenticated user's ID
    const profileData = {
      user: userId, // Explicitly link to the authenticated user
      ...req.body, // Include other data from the request body
      // Ensure that req.body does NOT contain a 'user' field that might conflict
      // or override the userId you're setting here.
    };

    const profile = await UserProfile.create(profileData);

    // Optional: If this is meant to be the first time a user creates a profile
    // after registration, you might want to mark them as 'onboarded' here.
    // However, it's generally cleaner to do this in the `updateOnboardingProfile`
    // function using `upsert: true`, as it handles both creation and updates.
    /*
    const user = await User.findById(userId);
    if (user && !user.isOnboarded) {
        user.isOnboarded = true;
        await user.save();
    }
    */

    res.status(201).json(profile); // Return the created profile

  } catch (err) {
    console.error('Error in createProfile:', err);
    // Specifically check for duplicate key errors for better response
    if (err.code === 11000 && err.keyPattern && err.keyPattern.user === 1) {
      return res.status(409).json({ message: 'A profile already exists for this user.', error: err.message });
    }
    res.status(500).json({ message: 'Failed to create profile', error: err.message });
  }
};

// update
const updateProfile = async (req, res) => {
  try {
    const profile = await UserProfile.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    res.status(200).json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update profile', error: err.message });
  }
};

// get profile by ID
const getProfile = async (req, res) => {
  try {
    const profile = await UserProfile.findById(req.params.id).populate(
      'currentLearningPathId',
      'title description'
    );

    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    res.status(200).json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch profile', error: err.message });
  }
};

module.exports = {
  createProfile,
  updateProfile,
  getProfile
};