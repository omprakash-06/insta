const userModel = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.showSignupForm = (req, res) => {
    res.render("signUp", { error: null });
};

exports.showLoginForm = (req, res) => {
    res.render("login", { error: null });
};

exports.createUser = async (req, res) => {
    let { email, username, password } = req.body;

    let user = await userModel.findOne({ email });

    if (user) return res.status(500).render("signUp", { error: "Account already exists" });

    let salt = await bcrypt.genSalt(10);
    let hash = await bcrypt.hash(password, salt);

    let createdUser = await userModel.create({
        email,
        username,
        password: hash
    });

    let token = jwt.sign({ email: email, userId: createdUser._id }, "shhh");
    res.cookie("token", token);
    res.redirect("/auth/login"); // Redirect to login after signup
};

exports.loginUser = async (req, res) => {
    let { email, password } = req.body;

    let user = await userModel.findOne({ email });

    if (!user) return res.status(500).render("login", { error: "Incorrect email or password" });

    let result = await bcrypt.compare(password, user.password);
    if (result) {
        let token = jwt.sign({ email: email, userId: user._id }, "shhh");
        res.cookie("token", token);
        res.redirect("/posts/feed/" + user._id);
    } else {
        res.render("login", { error: "Incorrect email or password" });
    }
};

exports.logoutUser = (req, res) => {
    res.clearCookie("token");
    res.redirect("/auth/login");
};