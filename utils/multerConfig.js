const multer = require('multer');

// Memory storage for posts
const postStorage = multer.memoryStorage();

const uploadPost = multer({
  storage: postStorage,
  fileFilter: (req, file, cb) => {
    const ext = file.originalname.toLowerCase();
    if (ext.endsWith('.jpg') || ext.endsWith('.jpeg') || ext.endsWith('.png') || ext.endsWith('.webp')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed'), false);
    }
  }
});

// Memory storage for stories
const storyStorage = multer.memoryStorage();

const uploadStory = multer({
  storage: storyStorage,
  fileFilter: (req, file, cb) => {
    const ext = file.originalname.toLowerCase();
    if (ext.endsWith('.jpg') || ext.endsWith('.jpeg') || ext.endsWith('.png') || ext.endsWith('.webp')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed'), false);
    }
  }
});

module.exports = { uploadPost, uploadStory };
