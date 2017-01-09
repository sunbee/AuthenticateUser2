// JavaScript File
var assert = require("assert");
var wagner = require("wagner-core")
var superagent = require("superagent");
var express = require("express");
var httpStatus = require("http-status");
var _ = require('underscore');

var URL_ROOT = 'http://alterego-sunbee.c9users.io'
// CRUD operations (Test) using 'Alert' model
describe("Test Suite", function() {
    
    var server;
    var User;
    
    before(function(done) {
        var app = express();
        
        var models = require("./models.js")(wagner);
        app.use(require("./api.js")(wagner));
        
        server = app.listen(process.env.PORT);
        
        User = models.User;
        done();
    });
    
    beforeEach(function(done) {
        User.remove({}, function(err) {
            assert.ifError(err);
            done();
        });
    });
    
    after(function(done) {
       User.remove({}, function(err) {
           assert.ifError(err);
           done();
        }); 
    });
    
    after(function(done) {
       server.close();
       done();
    });

    it('Greets user', function(done) {
        var endpoint_get = URL_ROOT + "/";
        console.log(endpoint_get);
        
        superagent.get(endpoint_get, function(err, res) {
            assert.ifError(err);
            assert.equal(res.status, httpStatus.OK);
            assert.equal(res.body.Greet, "Howdy Universe");
            done();
        });
    });
    
    it("Adds user data", function(done) {
        var pvSindhu = new User({
           name     : "Sindhu PV",
           password : "JaiHind",
           admin    : true,
        });
        pvSindhu.save(function(err, doc) {
            assert.ifError(err);
            User.findOne({name: "Sindhu PV"}, function(err, doc) {
                assert.ifError(err);
                assert.equal(doc.name, pvSindhu.name);
                assert.equal(doc.password, pvSindhu.password);
                assert.equal(doc.admin, pvSindhu.admin);
                done();
            })
        })
    });
    
    it("Retrieves user data", function(done) {
        var endpoint_getUsers = URL_ROOT + '/users';
        console.log(endpoint_getUsers);
        
        var pvSindhu = new User({
           name     : "Sindhu PV",
           password : "JaiHind",
           admin    : true,
        });
        pvSindhu.save(function(err, doc) {
            assert.ifError(err);
            superagent.get(endpoint_getUsers, function(err, res) {
                assert.ifError(err);
                console.log(res.body.Users);
                assert.equal(res.body.Users.length, 1);
                assert.equal(res.body.Users[0].name, pvSindhu.name);
                assert.equal(res.body.Users[0].password, pvSindhu.password);
                assert.equal(res.body.Users[0].admin, pvSindhu.admin);
                done();
            })
        });
    });
    
    
    it("Compares user name and password", function(done) {
        var endpoint_post = URL_ROOT + '/preauthenticate';
        console.log(endpoint_post);
        
        var pvSindhu = new User({
          name     : "Sindhu PV",
          password : "JaiHind",
          admin    : true,
        });
        pvSindhu.save(function(err, doc) {
            assert.ifError(err);
            superagent.post(endpoint_post)
                .send(pvSindhu)
                .set('Accept', 'application/json')
                .end(function(err, res) {
                    assert.ifError(err);
                    assert.equal(res.body.Credential.name, pvSindhu.name);
                    assert.equal(res.body.Credential.password, pvSindhu.password);
                    done();
                })
            
        })
    });
    
        it("Compares user name and password", function(done) {
        var endpoint_post = URL_ROOT + '/authenticate';
        console.log(endpoint_post);
        
        var pvSindhu = new User({
          name     : "Sindhu PV",
          password : "JaiHind",
          admin    : true,
        });
        pvSindhu.save(function(err, doc) {
            assert.ifError(err);
            superagent.post(endpoint_post)
                .send(pvSindhu)
                .set('Accept', 'application/json')
                .end(function(err, res) {
                    assert.ifError(err);
                    console.log(res.body.token);
                    done();
                })
            
        })
    });

});