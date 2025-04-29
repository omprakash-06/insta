const express = require('express');
const app = express();
const userModel = require("./models/user");
const postModel = require("./models/post");
const storyModel = require("./models/story");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');
const multer = require('multer');
const path = require('path');
const { console } = require('inspector');
const { Console } = require('console');

app.set("view engine","ejs");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(express.static('public'));

// Storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/image');
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName); 
  }
});

// Filter for images only
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname);
  if (ext === '.jpg' || ext === '.jpeg' || ext === '.png' || ext === '.webp') {
    cb(null, true);
  } else {
    cb(new Error('Only images are allowed'), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

//story
const storyStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/stories/');
    },
    filename: function (req, file, cb) {
      const uniqueName = Date.now() + '-' + file.originalname;
      cb(null, uniqueName);
    }
  });
  
  const uploadStory = multer({ storage: storyStorage });
        
app.get('/',(req,res)=>{
    res.render("home");
})

app.get('/create',(req,res)=>{
    res.render("signUp");
})

app.get('/login',(req,res)=>{
    res.render("login");
})

app.get('/feed/:id', isLoggedIn, async (req, res) => {
  const feedId = req.params.id;

  // Check if the logged-in user is trying to access their own feed
  if (feedId !== req.user.userId) {
    return res.status(403).send("Access denied");
  }

  const user = await userModel.findById(feedId);
  const posts = await postModel.find({ userId: user._id}).sort({ createdAt: -1 });
  const stories = await storyModel.find({userId: user._id}).sort({ createdAt: -1 });
  res.render("feed", { user, posts, stories });
});


app.get('/upload',isLoggedIn,async(req,res)=>{
  const user = await userModel.findById(req.user.userId);
  res.render("upload", { user });
});

app.get('/add-story',isLoggedIn,async (req, res) => {
  const user = await userModel.findById(req.user.userId);
  res.render("addStory",{user}); // You'll create this EJS page
});

app.post('/add-story', isLoggedIn, uploadStory.single("storyImage"), async (req, res) => {
  const user = await userModel.findById(req.user.userId);

  await storyModel.create({
    username: user.username,
    userId: user._id,
    image: "/stories/" + req.file.filename
  });

  res.redirect("/feed/" + req.user.userId);
});

app.get('/profile/:id',isLoggedIn,async(req,res)=>{
  const user = await userModel.findById(req.user.userId);
  const post = await postModel.find({userId: user._id }).sort({ createdAt: -1 });
  res.render("profile", { user,post });
});

app.post('/create',async(req,res)=>{
    let{email,username,password} = req.body;

    let user = await userModel.findOne({email});

    if(user) return res.status(500).render("signUp",{error:"account is allready exits"});

    let salt = await bcrypt.genSalt(10);
    let hash = await bcrypt.hash(password,salt);

   let createdUser = await userModel.create({
        email,
        username,
        password:hash
    });
    
    let token = jwt.sign({email:email,userId:createdUser._id},"shhh");
    res.cookie("token",token);
    res.redirect("login");
})

app.post('/login',async (req,res)=>{
    let{email,password} = req.body;

    let user = await userModel.findOne({email});

    if(!user) return res.status(500).render("login", { error: "incorrect emailor password" });
    
   let result = await bcrypt.compare(password,user.password);
    if(result){
      let token = jwt.sign({email:email,userId:user._id},"shhh");
      res.cookie("token",token);
      res.redirect("/feed/" + user._id); 
    }
    else{
        res.render("login", { error: "incorrect email or password" });
    }
   
});

app.post('/upload', isLoggedIn, upload.single("postImage"), async (req, res) => {
  const user = await userModel.findById(req.user.userId);
  
  const { caption } = req.body;
  
  const post = await postModel.create({
    username: user.username,
    userImage: '/images/default-user.jpg',
    userId: user._id,
    postImage: `/uploads/image/${req.file.filename}`,
    caption
  });
  
  user.posts.push(post._id);
  await user.save();
  res.redirect("/feed/" + req.user.userId);
});

app.get("/edit/profile/:id",isLoggedIn,async(req,res)=>{
  const user = await userModel.findById(req.user.userId);
  res.render('edit', { user });
});

app.post("/update/profile/:id", isLoggedIn, async (req, res) => {
  const { email, password, username } = req.body;
  
  const updateData = { email, username };

  // Sirf tab password hash karo jab naya password diya ho
  if (password && password.trim() !== "") {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    updateData.password = hash;
  }

  await userModel.findByIdAndUpdate(req.params.id, updateData, { new: true });

  res.redirect("/profile/" + req.user.userId);
});

app.get('/like/:id', isLoggedIn, async (req, res) => {
  const post = await postModel.findById(req.params.id);

  if (!post) {
    return res.status(404).send("post");
  }

  const userId = req.user.userId;
  if(post.likes.indexOf(userId)=== -1){
    post.likes.push(req.user.userId)
 }
 else{
 post.likes.splice(post.likes.indexOf(userId),1);
 }

  await post.save();
  res.redirect("/feed/" + userId);
});

function isLoggedIn(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        res.redirect("/login");
    } else {
        let data = jwt.verify(token, "shhh");
        req.user = data;
        next();
    }

}
app.listen(3000);
