var express = require('express');
var router = express.Router();
var Redirect = require('../models/redirect');
var User = require('../models/users');
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

/*router.get('/chat', function (req, res) {
    res.render('./chat/chat');
});

router.get('/chat1', function (req, res) {
    res.render('./chat/chat1');
});

router.get('/chat2', function (req, res) {
    res.render('./chat/chat2');
});*/


//Admin
router.get('/admin', function (req, res) {
    User.find({})
     .exec( function(err, users){
        if(err){
            res.send('error has occured!');
        }
        else{
            console.log(users);
            res.render('./admin/index',{p:users});
        }
     })
});

router.get('/Catch', function (req, res) {
    Redirect.find({}).populate('members')
    .exec(function(error, bands) {
        /* `bands.members` is now an array of instances of `Person` */
        if(error){res.send(error);}else{res.send(bands.members);}
    });
});

router.get('/admin/update', function (req, res) {
    res.render('./admin/update');
});

router.get('/admin/show', function (req, res) {
    console.log('getting all Redirects!')
    Redirect.find({})
     .exec( function(err, redirects){
        if(err){
            res.send('error has occured!');
        }
        else{
            console.log(redirects);
            res.render('./admin/show',{p:redirects});
        }
     })
});

router.get('/admin/:id/edit', function(req, res){
    console.log('getting one redirect');
    Redirect.findOne({
        _id:req.params.id
    })
    .exec(function(err, redirect){
        if(err){
            console.log('there was an error!');
        }
        else
        {
            console.log(redirect);
            res.render('./admin/update', {p:redirect});   
        }
    });
});

//The update function of the colleciton.
router.put('/admin/:id', function(req, res){
    console.log("id:" +req.params.id);
    Redirect.findOne({
        _id:req.params.id
    })
    .exec(function(err, redirect){
        if(err){
            console.log('there was an error!');
        }
        else
        {
            redirect.interviewer_image = req.body.interviewer_image;
            redirect.interviewer_name = req.body.interviewer_name;
            redirect.botname = req.body.botname;
            redirect.url = req.body.url;
            redirect.chat_image = req.body.chat_image;
            redirect.type_image = req.body.type_image;
            redirect.login = req.body.login;
            redirect.user = req.body.user;
            redirect.save(function (err) {
                if(err){
                    res.send('error saving redirect');
                }
                else
                {
                    console.log("params saved!");
                    res.redirect('/admin/show');
                }
            });
        }
    });
});

//The delete function of the colleciton.
router.delete('/admin/:id', function(req, res){
    Redirect.findOneAndRemove({
        _id:req.params.id
    }, function(err, redirect){
        if(err){
            res.send('error deleting');
        }
        else{
            console.log(redirect);
            res.redirect('/admin/show');
        }
    });
});

router.post('/addBot', function(req, res){
    var newRedirect = new Redirect();
    User.findOne({
        name:req.body.user
    })
    .exec(function(err, user){
        if(err){
            console.log('there was an error!');
        }
        else
        {
            console.log("/n/n"+user._id+"/n/n");
        }
    });

    newRedirect.interviewer_image = req.body.interviewer_image;
    newRedirect.interviewer_name = req.body.interviewer_name;
    newRedirect.chat_image = req.body.chat_image;
    newRedirect.type_image = req.body.type_image;
    newRedirect.botname = req.body.botname;
    newRedirect.login = req.body.login;
    newRedirect.url = req.body.url;
    newRedirect.user = req.body.user;

    newRedirect.save(function(err, redirect){
        if(err){
            console.log('error saving redirect');
            console.log(err);
        }
        else
        {
            res.render('./chat/chat1', {p:redirect});
        }
    });
});


//Chat
router.get('/:url', function (req, res) {
    console.log('getting Chat!');
    Redirect.findOne({
        url:req.params.url
    })
    .exec(function(err, redirect){
        if(err){
            console.log('there was an error!');
        }
        else
        {
            console.log(redirect);
            res.render('./chat/chat2', {p:redirect});   
        }
    });
});

module.exports = router;
