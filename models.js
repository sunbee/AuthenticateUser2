// JavaScript File
var mongoose = require("mongoose");
var _ = require("underscore");

var config = require("./config.js");

module.exports = function(wagner) {
    // Get an instance of the model - User
    mongoose.connect(config.dbstring);
    var User = mongoose.model('User', require('./models/user.js', 'users'));

    // Register model(s) in factory pattern
    Models = {
        User: User,
    }
    _.each(Models, function(value, key) {
        wagner.factory(key, function() {
            return value;
        })
    })
    
    // Return
    return Models;
};