const UserProfile   = require('../models/userProfile');
const LearningPath  = require('../models/LearningPath');
const { generateLearningPlan } = require('../services/aiPlanner');


exports.createLearningPath = async (req, res) => {
  try {
    const { profileId } = req.body;

    // 1. Fetch profile
    const profile = await UserProfile.findById(profileId);
    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    // 2. Generate plan with LLM
    const plan = await generateLearningPlan(profile);

    // 3. Persist
    const lpDoc = await LearningPath.create({
      ownerProfile: profile._id,
      careerGoal:   plan.careerGoal,
      totalWeeks:   plan.totalWeeks,
      lessons:      plan.lessons
    });

    res.status(201).json(lpDoc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to generate learning path', error: err.message });
  }
};

// getting learning paths
// controllers/learningPathController.js
exports.etLearningPathByProfile = async (req, res) => {
  try {
    const profileId = req.params.profileId;

    // 1️⃣  Find the path by ownerProfile
    const path = await LearningPath.findOne({ ownerProfile: profileId });
    if (!path) {
      return res.status(404).json({ message: 'No learning path found for this profile' });
    }

    // 2️⃣  Return the full learning‑path document
    res.status(200).json(path);
  } catch (err) {
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


