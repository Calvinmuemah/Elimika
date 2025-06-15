const express = require('express');
const {
  createProfile,
  updateProfile,
  getProfile
} = require('../controllers/userProfile');

const router = express.Router();

router.post('/createProfile', createProfile);
router.put('/:id', updateProfile);
router.get('/getProfile/:id', getProfile);


module.exports = router;
