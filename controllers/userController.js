const userModel = require("../models/user");
const postModel = require("../models/post");
const bcrypt = require("bcrypt");

exports.getProfile = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.userId);
        if (!user) return res.status(404).send("User not found");

        const posts = await postModel.find({ userId: user._id }).sort({ createdAt: -1 });
        res.render("profile", { user, post: posts });
    } catch (err) {
        console.error("Profile fetch error:", err);
        res.status(500).send("Something went wrong");
    }
};

exports.showEditProfileForm = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.userId);
        if (!user) return res.status(404).send("User not found");

        res.render('edit', { user });
    } catch (err) {
        console.error("Edit form error:", err);
        res.status(500).send("Something went wrong");
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { email, password, username } = req.body;

        // Prevent unauthorized update
        if (req.params.id !== req.user.userId) {
            return res.status(403).send("Unauthorized");
        }

        const updateData = { email, username };

        if (password && password.trim() !== "") {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt);
            updateData.password = hash;
        }

        const updatedUser = await userModel.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!updatedUser) {
            return res.status(404).send("User not found");
        }

        res.redirect("/users/profile/" + req.user.userId);
    } catch (err) {
        console.error("Profile update error:", err);
        res.status(500).send("Something went wrong");
    }
};
