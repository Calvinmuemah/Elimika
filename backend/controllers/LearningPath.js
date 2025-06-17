const mongoose = require('mongoose')
const UserProfile   = require('../models/userProfile');
const LearningPath  = require('../models/LearningPath');
const { generateLearningPlan } = require('../services/aiPlanner');


exports.createLearningPath = async (req, res) => {
  try {
    const { profileId } = req.body;

    const profile = await UserProfile.findById(profileId);
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    // --- ADD THESE LOGS ---
    console.log('Profile object before modifications:', JSON.stringify(profile, null, 2));
    console.log('Value of profile.user:', profile.user);
    // --- END ADDED LOGS ---

    const plan = await generateLearningPlan(profile);

    const lpDoc = await LearningPath.create({
      ownerProfile: profile._id,
      careerGoal:    plan.careerGoal,
      totalWeeks:    plan.totalWeeks,
      lessons:       plan.lessons
    });

    profile.currentLearningPathId = lpDoc._id;
    profile.isOnboarded = true;

    // --- ADD THESE LOGS ---
    console.log('Profile object before save (after modifications):', JSON.stringify(profile, null, 2));
    console.log('Value of profile.user just before save:', profile.user);
    // --- END ADDED LOGS ---

    await profile.save();

    res.status(201).json(lpDoc);
  } catch (err) {
    console.error('Error in createLearningPath:', err);
    res.status(500).json({ message: 'Failed to generate learning path', error: err.message });
  }
};
// getting learning paths
exports.getLearningPathByProfile = async (req, res) => {
  try {
    const profileId = req.params.profileId;
    console.log('Backend Controller: Received profileId:', profileId); // Add this

    // Ensure profileId is a string and looks like a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(profileId)) {
        console.error('Backend Controller: Invalid profileId format:', profileId);
        return res.status(400).json({ message: 'Invalid Profile ID format' });
    }

    const profile = await UserProfile.findById(profileId).populate('currentLearningPathId');

    console.log('Backend Controller: Fetched profile:', profile ? profile._id : 'null'); // Add this
    if (profile) {
        console.log('Backend Controller: Populated currentLearningPathId:', profile.currentLearningPathId ? profile.currentLearningPathId._id : 'null/not populated'); // Add this
    }

    if (!profile || !profile.currentLearningPathId) {
      return res.status(404).json({ message: 'No learning path found for this profile' });
    }

    res.status(200).json(profile.currentLearningPathId);
  } catch (err) {
    console.error('Backend Controller: Error fetching learning path:', err); // Add this
    res.status(500).json({ message: 'Failed to fetch learning path', error: err.message });
  }
};
// mark as complete
exports.markLessonComplete = async (req, res) => {
  const { profileId, week, topic } = req.body;

  try {
    const profile = await UserProfile.findById(profileId);
    const pathId = profile?.currentLearningPathId;

    if (!pathId) return res.status(404).json({ message: 'No learning path assigned' });

    const path = await LearningPath.findById(pathId);
    path.completedLessons.push({ week, topic });
    await path.save();

    res.status(200).json({ message: 'Topic marked as complete' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update progress', error: err.message });
  }
};


