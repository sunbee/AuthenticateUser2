// JavaScript File
var express = require("express");
var wagner = require("wagner-core");
var morgan = require("morgan");

var models = require('./models.js')(wagner);
var app = express();

app.use(morgan('dev'));

app.use('/api/v1', require('./api.js')(wagner));

// Launch server
app.listen(process.env.PORT);
console.log("Thumbs up!");
