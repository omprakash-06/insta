const express = require('express');
const app = express();
const mongoose = require("mongoose"); // Add mongoose here for connection
const cookieParser = require('cookie-parser');
const path = require('path');

// Database connection
mongoose.connect("mongodb://127.0.0.1:27017/instagram"); //

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Import Routes
const indexRouter = require('./routes/index');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');

// Use Routes
app.use('/', indexRouter);
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/posts', postRoutes);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});