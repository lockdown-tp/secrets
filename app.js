//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const { stringify } = require("querystring");
const encryption = require("mongoose-encryption");
const bcrypt = require("bcrypt");

const app = express();
const saltRounds = 10;

app.use('public' , express.static(__dirname + "/public"));
app.set("view engine" , "ejs");
app.use(bodyParser.urlencoded({extended : true}));

mongoose.connect("mongodb://localhost:27017/usersDB" , { useNewUrlParser: true , useUnifiedTopology: true});

const userSchema = new mongoose.Schema ({
    email: String,
    password: String
});

const User = mongoose.model("User" , userSchema);

app.get("/" , function(req , res){
    res.render("home");
});

app.get("/login" , function(req , res){
    res.render("login");
});

app.get("/register" , function(req , res){
    res.render("register");
});

app.post("/register" , function(req , res ){

    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        const newUser = new User({
            email: req.body.username,
            password: hash
        });
        newUser.save(function(err){
            if(err){
                res.send(err);
            } else {
                res.render("secrets");
            }
        });
    });

   
});

app.post("/login" , function(req ,res){
    const userName = req.body.username;
    const password = req.body.password;
    User.findOne({email: userName} , function(err , foundUser){
        if(err){
            res.send(err);
        } else {

            bcrypt.compare(password, foundUser.password, function(err, result) {
               if(result){
                res.render("secrets");
               } else {
                res.send("Email or password incorrect");
               }
            });
        }
    });
});

app.listen("3000" , function(){
    console.log("server is up and running...");
});