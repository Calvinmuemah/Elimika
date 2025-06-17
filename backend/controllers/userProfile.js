const UserProfile = require('../models/userProfile');

// create
const createProfile = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id || req.body.userId;

    if (!userId) {
      return res.status(400).json({ message: 'userId missing in token or body' });
    }

    // Pull everything except userId from body
    const { userId: _throwAway, ...profilePayload } = req.body;

    // Upsert = create if none, update if exists
    const profile = await UserProfile.findOneAndUpdate(
      { user: userId },                   // filter
      { ...profilePayload, user: userId },// update
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );

    res.status(200).json(profile);

  } catch (err) {
    console.error('Error in createProfile:', err);
    res.status(500).json({ message: 'Failed to create/update profile', error: err.message });
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