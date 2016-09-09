var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//Added Dependencies
var flash = require('connect-flash');
var expressValidator = require('express-validator');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/chat');
var db = mongoose.connection;

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//Express session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

//Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

//Express validator middleware from https://github.com/ctavan/express-validator
app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        var namespace = param.split('.')
            , root = namespace.shift()
            , formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

//Connect-Flash middleware
app.use(flash());

//Global variables for flash messages
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

//Routes
app.use('/', routes);
app.use('/users', users);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

//Winston logging to MongoDB
var winston = require('winston');
var MongoDB = require('winston-mongodb').MongoDB;
var logger = new (winston.Logger)({
    transports: [
        new(winston.transports.MongoDB)({
            db : 'mongodb://localhost/chat',
            collection: 'logs'
        })
    ]
});


//Socket.io stuff
var http = require('http').Server(app);
var io = require('socket.io')(http);
var net = require('net');
var Port = 1024;
var Host = 'bots.chattr.io';

http.listen(3000, function () {
    console.log('Listening on localhost from app.js');
});

chatUsers = [];
connections = [];

io.sockets.on('connection', function (socket) {
    connections.push(socket);
    console.log('Connected: %s sockets connected', connections.length);

    //Disconnect
    socket.on('disconnect', function (data) {
        // if(!socket.username) return;
        chatUsers.splice(chatUsers.indexOf(socket.username), 1);
        updateUsernames();
        connections.splice(connections.indexOf(socket), 1);
        console.log('Disconnected: %s sockets connected', connections.length);
    });

    //Send Message
    socket.on('send message', function (data) {
        console.log(data);
        io.sockets.emit('new message', {msg: data, user: socket.username});

        var client = new net.Socket();

        client.connect(Port, Host, function () {
            console.log('connected to ' + Port + ' '+ Host);
            logger.info('connected to ' + Port + ' '+ Host);
            console.log(socket.username + ': ' + data);
            logger.info('Sent to bot: Username is ' + socket.username + ' ' + 'and message is ' + data);
            client.write(socket.username + '\0' + 'therapp' + '\0' + data + '\0');
        });

    // Add a 'data' event handler for the client socket
    // data is what the server sent to this socket
        client.on('data', function(data) {
            console.log('DATA: ' + data);
            logger.info('The bot replied : ' + data);
            io.sockets.emit('typing', true);
            setTimeout(function(){
            io.sockets.emit('chat message', {user: 'therapp', msg: '' + data});
            }, 1000 + (Math.random() * 50) * 100);
            // Close the client socket completely
            client.destroy();
        });
        client.on('close', function() {
            console.log('Connection closed');
        });
    });
    socket.on('send message1', function (data) {
        console.log(data);
        io.sockets.emit('new message1', {msg: data, user: socket.username});

        var client = new net.Socket();

        client.connect(Port, Host, function () {
            console.log('connected to ' + Port + ' '+ Host);
            logger.info('connected to ' + Port + ' '+ Host);
            console.log(socket.username + ': ' + data);
            logger.info('Sent to bot: Username is ' + socket.username + ' ' + 'and message is ' + data);
            client.write(socket.username + '\0' + 'GeneralLeeGuilty' + '\0' + data + '\0');
        });

        // Add a 'data' event handler for the client socket
        // data is what the server sent to this socket
        client.on('data', function(data) {
            console.log('DATA: ' + data);
            logger.info('The bot replied : ' + data);
            io.sockets.emit('typing', true);
            setTimeout(function(){
                io.sockets.emit('chat message1', {user: 'Rob', msg: '' + data});
            }, 1000 + (Math.random() * 50) * 100);
            // Close the client socket completely
            client.destroy();
        });
        client.on('close', function() {
            console.log('Connection closed');
        });
    });

    socket.on('send message2', function (data) {
        console.log(data);
        io.sockets.emit('new message2', {msg: data, user: socket.username});

        var client = new net.Socket();

        client.connect(Port, Host, function () {
            console.log('connected to ' + Port + ' '+ Host);
            logger.info('connected to ' + Port + ' '+ Host);
            console.log(socket.username + ': ' + data);
            logger.info('Sent to bot: Username is ' + socket.username + ' ' + 'and message is ' + data);
            client.write(socket.username + '\0' + 'Matlock' + '\0' + data + '\0');
        });

        // Add a 'data' event handler for the client socket
        // data is what the server sent to this socket
        client.on('data', function(data) {
            console.log('DATA: ' + data);
            logger.info('The bot replied : ' + data);
            io.sockets.emit('typing', true);
            setTimeout(function(){
                io.sockets.emit('chat message2', {user: 'Ben', msg: '' + data});
            }, 1000 + (Math.random() * 50) * 100);
            // Close the client socket completely
            client.destroy();
        });
        client.on('close', function() {
            console.log('Connection closed');
        });
    });

    //New user
    socket.on('new user', function (data) {
        socket.username = data;
        chatUsers.push(socket.username);
        updateUsernames();
    });
    // socket.on('new user', function (data, callback) {
    //     callback('true');
    //     socket.username = data;
    //     chatUsers.push(socket.username);
    //     updateUsernames();
    // });

    socket.on('keypress', function(data){
       // process.stdout.write(data.keypress + ': ' + data.letter + ' timestamp: ' + data.timestamp);
       // console.log(data);
       logger.info(' username: '+ socket.username + ' '+ data.keypress + ': ' + data.letter + ' timestamp: ' + data.timestamp);
    });

    socket.on('keyup', function(data){
       // process.stdout.write(data.keyup + ': ' + data.letter + ' timestamp: ' + data.timestamp);
        // console.log(data);
        logger.info(' username: '+ socket.username + ' '+ data.keyup + ': ' + data.letter + ' timestamp: ' + data.timestamp);
    });

    socket.on('keydown', function(data){
        //process.stdout.write(data.keydown + ': ' + data.letter + ' timestamp: ' + data.timestamp);
        // console.log(data);
        logger.info(' username: '+ socket.username + ' '+ data.keydown + ': ' + data.letter + ' timestamp: ' + data.timestamp);
    });

    function updateUsernames() {
        io.sockets.emit('get users', chatUsers);
    }
});

module.exports = app;
