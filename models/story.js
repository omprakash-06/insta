const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  username: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  image: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('story', storySchema);
