const express = require('express');
const { createLearningPath, getLearningPathByProfile, markLessonComplete } = require('../controllers/LearningPath');
const router = express.Router();

router.post('/learningPath', createLearningPath);
router.get('/learningPath/:profileId', getLearningPathByProfile);
router.post('/learningPath/markComplete', markLessonComplete);


module.exports = router;
