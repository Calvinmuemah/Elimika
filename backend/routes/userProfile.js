// const express = require('express');
// const {
//   createProfile,
//   updateProfile,
//   getProfile
// } = require('../controllers/userProfile');

// const router = express.Router();

// router.post('/createProfile', createProfile);
// router.put('/:id', updateProfile);
// router.get('/getProfile/:id', getProfile);


// module.exports = router;

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createProfile,           
  updateProfile,
  getProfile,
  updateOnboardingProfile  
} = require('../controllers/userProfileController');
router.post('/createProfile', protect, createProfile); 
router.put('/onboarding', protect, updateOnboardingProfile);
router.get('/getProfile/:id', getProfile); 
router.put('/:id', updateProfile);
module.exports = router;
