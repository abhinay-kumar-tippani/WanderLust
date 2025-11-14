const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const wrapAsync = require('../utils/WrapAsync.js');
const passport = require('passport');
const { saveredirectLink } = require('../middleware.js');
const userController = require("../controllers/user.js");

router.route("/signup")
.get( userController.signUp)
.post(wrapAsync(userController.signUpForm));


router.route("/login")
.get( userController.logIn)
.post( saveredirectLink,passport.authenticate("local", {failureRedirect:"/login", failureFlash:true}) , userController.logInForm);


router.get("/logout", userController.logOut);

module.exports = router;