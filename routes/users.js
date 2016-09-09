var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/users');

//Login
router.get('/login', function (req, res) {
    res.render('./users/index');
});

//Signup
router.post('/create', function (req, res) {
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;
    var confirmation = req.body.confirmation;
    //Validate
    req.assert('name', 'Name is required').notEmpty();
    req.assert('email', 'Email is required').notEmpty();
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('password', 'Password is required').notEmpty();
    req.assert('confirmation', 'Passwords do not match').equals(req.body.password);

    var errors = req.validationErrors();
    if (errors) {
        console.log('Errors');
        res.render('users/new', {
            errors: errors
            //  res.send(errors);
            //     return;
        });
    } else {
        console.log('No Errors');
        var newUser = new User({
            name: name,
            email: email,
            password: password
        });
        User.createUser(newUser, function (err, User) {
            if (err) throw err;
            console.log(User);
        });
        req.flash('success_msg', 'You have successfully signed up!');
        res.redirect('/login');
    }
});

passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    function (username, password, done) {
        User.getUserbyUsername(username, function (err, user) {
            if (err) throw err;
            if (!user) {
                return done(null, false, {message: 'Unknown Email'});
            }
            User.comparePassword(password, user.password, function (err, isMatch) {
                if (err) throw err;
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, {message: 'Incorrect Password'});
                }
            });
        });
    }
));

passport.serializeUser(function (username, done) {
    done(null, username.id);
});

passport.deserializeUser(function (id, done) {
    User.getUserById(id, function (err, username) {
        done(err, username);
    });
});

router.post('/login',
    passport.authenticate('local', {successRedirect: '/chat', failureRedirect: '/login', failureFlash: true}),
    function (req, res) {
        res.redirect('/chat');
    });


//Chat
router.post('/chat', function (req, res) {
    res.redirect('/chat');
});


module.exports = router;
