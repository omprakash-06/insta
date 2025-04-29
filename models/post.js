const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  username: String,
  userImage: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  postImage: String,
  caption: String,
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('post', postSchema);
