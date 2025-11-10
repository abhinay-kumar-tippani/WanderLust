const express = require('express');
const route = express.Router();
const User = require('../models/user.js');
const wrapAsync = require('../utils/WrapAsync.js');
const passport = require('passport');

route.get("/signup", (req,res)=>{
    res.render("users/signup");
});

route.post("/signup",wrapAsync(async (req,res)=>{
    let {username, email, password} = req.body;
    let newUser = new User({username,email});
    let userRegister = await User.register(newUser, password);
    console.log(userRegister);
    req.flash("success", "Welcome to wanderLust!");
    res.redirect('/listings');
}));

route.get("/login", (req,res)=>{
    res.render("users/login");
});

route.post("/login",passport.authenticate("local", {failureRedirect:"/login", failureFlash:true}) , async (req,res) => {
    req.flash("success", "Logged in successfully!");
    res.redirect("/listings");
});

module.exports = route;