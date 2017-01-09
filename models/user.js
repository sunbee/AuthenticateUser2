// JavaScript File
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = new Schema({
    name: String,
    password: String,
    admin: Boolean,
});

module.exports = userSchema;
