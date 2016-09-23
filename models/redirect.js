var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

//User schema
var RedirectSchema = mongoose.Schema({
    interviewer_name: {
        type: String
    },
    interviewer_image: {
        type: String
    },
    botname: {
        type: String,
        unique: true
    },
    url: {
        type: String
    },
    chat_image: {
        type: String
    },
    type_image: {
        type: String
    },
    login: {
        type:Boolean,
        default: false
    },
    user: {
        type: String,
    }
});

var Redirect = module.exports = mongoose.model('Redirect', RedirectSchema);