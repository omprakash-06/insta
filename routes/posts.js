const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const isLoggedIn = require('../utils/authMiddleware');
const { uploadPost, uploadStory } = require("../utils/multerConfig"); // Import multer upload functions

router.get('/feed/:id', isLoggedIn, postController.getFeed);
router.get('/upload', isLoggedIn, postController.showUploadForm);
router.post('/upload', isLoggedIn, uploadPost.single("postImage"), postController.uploadPost);
router.get('/like/:id', isLoggedIn, postController.likePost);
router.get('/add-story', isLoggedIn, postController.showAddStoryForm);
router.post('/add-story', isLoggedIn, uploadStory.single("storyImage"), postController.addStory);

module.exports = router;