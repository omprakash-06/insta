const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/create', authController.showSignupForm);
router.post('/create', authController.createUser);
router.get('/login', authController.showLoginForm);
router.post('/login', authController.loginUser);
router.get('/logout', authController.logoutUser);

module.exports = router;