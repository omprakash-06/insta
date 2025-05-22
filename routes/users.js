const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const isLoggedIn = require('../utils/authMiddleware');

router.get('/profile/:id', isLoggedIn, userController.getProfile);
router.get('/edit/profile/:id', isLoggedIn, userController.showEditProfileForm);
router.post('/update/profile/:id', isLoggedIn, userController.updateProfile);

module.exports = router;