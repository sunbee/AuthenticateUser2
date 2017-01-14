// JavaScript File
var express = require("express");
var httpStatus = require("http-status");
var bodyParser = require("body-parser");
var jsonWebToken = require("jsonwebtoken");


module.exports = function(wagner) {
    var api = express.Router();
    api.use(bodyParser.json());
    
    api.get('/', wagner.invoke(function(User) {
        return function(req, res) {
            res.send({'Greet': "Howdy Universe"});
            res.status(httpStatus.OK);
        };
    }));
    
    api.post('/preauthenticate', wagner.invoke(function(User) {
        return function(req, res) {
            User.findOne({name: req.body.name}, function(err, doc) {
                if (err) {
                    return res
                            .status(httpStatus.INTERNAL_SERVER_ERROR)
                            .json({error: err.toString()});
                } else if(!doc) {
                    return res
                            .status(httpStatus.INTERNAL_SERVER_ERROR)
                            .json({error: "Found no matching record for " + req.body.name});
                } else if (doc) {
                    if (doc.password != req.body.password) {
                        return res
                                .status(httpStatus.INTERNAL_SERVER_ERROR)
                                .json({error: "Found password mismatch for " + req.body.name});
                    } else {
                        return res
                                .status(httpStatus.OK)
                                 .json({Credential: doc});
                        
                    };
                };
            });  
        };
    }));

    api.post('/authenticate', wagner.invoke(function(User) {
        return function(req, res) {
            User.findOne({name: req.body.name}, function(err, doc) {
                if (err) {
                    return res
                            .status(httpStatus.INTERNAL_SERVER_ERROR)
                            .json({error: err.toString()});
                } else if(!doc) {
                    return res
                            .status(httpStatus.INTERNAL_SERVER_ERROR)
                            .json({error: "Found no matching record for " + req.body.name});
                } else if (doc) {
                    if (doc.password != req.body.password) {
                        return res
                                .status(httpStatus.INTERNAL_SERVER_ERROR)
                                .json({error: "Found password mismatch for " + req.body.name});
                    } else {
                        var token = jsonWebToken.sign(doc, 'sodesuka', {
                            expiresIn: "2 days",
                        })
                        return res
                                .status(httpStatus.OK)
                                .json({token: token});
                        
                    };
                };
            });  
        };
    }));
    
    // api.use(wagner.invoke(function() {
    //     return function(req, res, next) {
    //         console.log("FROM MIDDLEWARE ***" + req);
    //         if (req.body) {
    //             console.log("BODY: " + JSON.stringify(req.body))
    //         }
    //         if (req.query) {
    //             console.log("QUERY: " + JSON.stringify(req.query));
    //         }
    //         next(); 
    //     }
    // }));

    api.use(function(req, res, next) {
        var token = req.body.token || req.query.token;
        
        if (token) {
            jsonWebToken.verify(token, 'sodesuka', function(err, decoded) {
                if (err) {
                    return res
                            .status(httpStatus[401])
                            .json({error: err});
                } else {
                    console.log("from ROUTE HANDLER, DECODED: " + decoded);
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            return res
                    .status(httpStatus[403]);
        }
        
    });
    
    api.get('/users', wagner.invoke(function(User) {
        return function(req, res) {
            User.find({}, function(err, docs) {
               if (err) {
                    return res
                            .status(httpStatus.INTERNAL_SERVER_ERROR)
                            .json({error: err.toString()});
               } else {
                   return res
                            .status(httpStatus.OK)
                            .json({Users: docs})
               };
            });  
        };    
    }));
    


    return api;
}