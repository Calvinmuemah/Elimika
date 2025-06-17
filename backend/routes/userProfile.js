// routes/userProfile.js
const express = require('express');
const {
  createProfile,
  updateProfile,
  getProfile
} = require('../controllers/userProfile');
const protect = require('../middlewares/authToken');   // <- import your JWT middleware

const router = express.Router();

// Attach `protect` BEFORE the handler:
router.post('/createProfile', protect, createProfile);
router.put('/:id', protect, updateProfile);
router.get('/getProfile/:id', protect, getProfile);

module.exports = router;


// const express = require('express');
// const router = express.Router();
// const { protect } = require('../middlewares/authToken');
// const {
//   createProfile,           
//   updateProfile,
//   getProfile,
//   updateOnboardingProfile  
// } = require('../controllers/userProfile');
// router.post('/createProfile', protect, createProfile); 
// // router.put('/onboarding', protect, updateOnboardingProfile);
// router.get('/getProfile/:id', getProfile); 
// router.put('/:id', updateProfile);
// module.exports = router;
