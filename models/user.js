const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/instagram");

const userSchema = mongoose.Schema({
    email:String,
    username:String,
    password:String,
    posts: [
        { type: mongoose.Schema.Types.ObjectId, ref: "Post" } 
       ],
    story:[
        { type:mongoose.Schema.Types.ObjectId, ref:"Story"}
    ]
    
});


module.exports = mongoose.model("user",userSchema);

