const User = require("../models/user");
const Review = require("../models/review.js");


module.exports.logIn = (req,res)=>{
    res.render("users/login");
}

module.exports.signUp = (req,res)=>{
    res.render("users/signup");
}

module.exports.signUpForm = async (req,res)=>{
    let {username, email, password} = req.body;
    let newUser = new User({username,email});
    let userRegister = await User.register(newUser, password);
    console.log(userRegister);
    req.login(userRegister, (err)=>{
        if (err) {
            next(err);
        }
        req.flash("success", "Welcome to wanderLust!");
        res.redirect('/listings');
    })
}

module.exports.logInForm = async (req,res) => {
    req.flash("success", "Logged in successfully!"); 
    let redirectLink = res.locals.redirectUrl || "/listings";
    res.redirect(redirectLink);
}

module.exports.logOut = (req, res, next)=>{
    req.logOut((err)=>{
        if(err) return next(err);
        req.flash("success", "Logged out successfully!");
        res.redirect("/listings");
    });

}