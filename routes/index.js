var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index');
});

function isAuthenticated(req, res, next) {
    if (req.user.isAuthenticated()) {
        return next();
    } else {
        req.flash('error', 'You are not logged in');
        res.redirect('/login');
    }
}

//Signup
router.get('/signup', function (req, res) {
    res.render('./users/new', {errors: [""]});
});

//Login
router.get('/login', function (req, res) {
    res.render('./users/index');
});

//Logout
router.get('/logout', function (req, res) {
    req.logout();

    req.flash('success_msg', 'You are now logged out');

    res.redirect('/login');
});

//Chat
router.get('/chat', function (req, res) {
    res.render('./chat/chat')
});

router.get('/chat1', function (req, res) {
    res.render('./chat/chat1')
});

router.get('/chat2', function (req, res) {
    res.render('./chat/chat2')
});


//Admin
router.get('/admin', function (req, res) {
    res.render('./admin/index');
});

module.exports = router;
