const jwt = require("jsonwebtoken");

function isLoggedIn(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.redirect("/auth/login"); // Redirect to login route
    } else {
        try {
            let data = jwt.verify(token, "shhh");
            req.user = data;
            next();
        } catch (error) {
            return res.redirect("/auth/login"); // Handle invalid token
        }
    }
}

module.exports = isLoggedIn;