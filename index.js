// JavaScript File
var express = require("express");
var wagner = require("wagner-core");
var morgan = require("morgan");
var jsonWebToken = require("jsonwebtoken");

var models = require('./models.js')(wagner);
var app = express();

app.use(morgan('dev'));

// app.use(wagner.invoke(function() {
//     return function(req, res, next) {
//         console.log("FROM MIDDLEWARE ***" + req);
//         if (req.body) {
//             console.log("BODY: ")
//         }
//         next();
        
//         // var token = req.body.token || req.query.token;
        
//         // if (token) {
//         //     jsonWebToken.verify(token, 'sodesuka', function(err, decoded) {
//         //         if (err) {
//         //             return res
//         //                     .status(httpStatus[401])
//         //                     .json({error: err});
//         //         } else {
//         //             console.log("from ROUTE HANDLER, DECODED: " + decoded);
//         //             req.decoded = decoded;
//         //             next();
//         //         }
//         //     });
//         // } else {
//         //     return res
//         //             .status(httpStatus[403]);
//         // }; // end if
        
//     }; // end return function
// }));
app.use('/api/v1', require('./api.js')(wagner));

// Launch server
app.listen(process.env.PORT);
console.log("Thumbs up!");
