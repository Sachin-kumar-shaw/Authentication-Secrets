require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
    email:String,
    password:String
});


mongoose.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]});

const User = mongoose.model("User",userSchema);

const app = express();

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){
    res.render("home");
})

app.get("/login",function(req,res){
    res.render("login");
})

app.get("/register",function(req,res){
    res.render("register");
})

app.post("/register",function(req,res){
    const newUser = new User({
        email:req.body.username,
        password:req.body.password
    });

    newUser.save().catch((error)=>{
        console.log(error);
    }).then((value)=>{
        res.render("secrets");
    })
})

app.post("/login",(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email:username}).then((currentUser)=>{
        if(currentUser){
            if(currentUser.password === password){
                res.render("secrets");
            }
        }
    }).catch((error)=>{
        console.log(error);
    });
});

app.listen(3000,()=>{
    console.log("Server is started running on port:3000");
});