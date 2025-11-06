const express = require('express');
const app = express();
exports.app = app;

const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');

app.listen(3000);

app.use(session({secret:'secretcode', resave:false, saveUninitialized:true}));
app.use(flash());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use((req,res,next)=>{
    res.locals.successMsg = req.flash('success');
    res.locals.errorMsg = req.flash('error');
    next();
});

app.use('/test',(req,res)=>{
    res.send("<h3>Test!</h3>");
});

app.use('/count', (req,res)=>{
    // let req.session.count = count;
    if(req.session.count){
        req.session.count += 1;
    }else{
        req.session.count = 1;
    }
    res.send(`<h3>You have refreshed ${req.session.count} times!</h3>`)
});

app.get('/register', (req,res)=>{
    let {name='anonymous'} = req.query;
    req.session.name = name;
    if (name==='anonymous') {
        req.flash('error', 'user is not registered!');
    }else{
        req.flash("success", "user registered successfully!");
    }
    console.log(req.session.name);
    res.redirect('/hello');
});

app.use('/hello',(req,res)=>{

    res.render("hello", { name : req.session.name });
});