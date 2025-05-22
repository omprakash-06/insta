const userModel = require("../models/user");
const postModel = require("../models/post");
const storyModel = require("../models/story");
const { uploadPost, uploadStory } = require("../utils/multerConfig"); // Import multer configurations

exports.getFeed = async (req, res) => {
    const feedId = req.params.id;

    if (feedId !== req.user.userId) {
        return res.status(403).send("Access denied");
    }

    const user = await userModel.findById(feedId);
    const posts = await postModel.find({ userId: user._id }).sort({ createdAt: -1 });
    const stories = await storyModel.find({ userId: user._id }).sort({ createdAt: -1 });
    res.render("feed", { user, posts, stories });
};

exports.showUploadForm = async (req, res) => {
    const user = await userModel.findById(req.user.userId);
    res.render("upload", { user });
};

exports.uploadPost = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.userId);
    const { caption } = req.body;

    const post = await postModel.create({
      username: user.username,
      userImage: '/images/default-user.jpg', // Optional: make dynamic later
      userId: user._id,
      postImage: req.file.buffer, // 🧠 Memory buffer instead of file path
      caption
    });

    user.posts.push(post._id);
    await user.save();
    res.redirect("/posts/feed/" + req.user.userId);
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).send("Failed to upload post");
  }
};


exports.likePost = async (req, res) => {
    const postId = req.params.id;
    const userId = req.user.userId;

    const post = await postModel.findById(postId);

    if (!post) {
        return res.status(404).send("Post not found");
    }

    if (post.likes.includes(userId)) {
        // Unlike the post
        post.likes = post.likes.filter(id => id.toString() !== userId.toString());
    } else {
        // Like the post
        post.likes.push(userId);
    }

    await post.save();
    res.redirect("/posts/feed/" + userId);
};

exports.showAddStoryForm = async (req, res) => {
  const user = await userModel.findById(req.user.userId);
  res.render("addStory",{user});
};

exports.addStory = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.userId);

    await storyModel.create({
      username: user.username,
      userId: user._id,
      image: req.file.buffer // 🧠 Memory buffer
    });

    res.redirect("/posts/feed/" + req.user.userId);
  } catch (err) {
    console.error("Story Upload Error:", err);
    res.status(500).send("Failed to upload story");
  }
};
