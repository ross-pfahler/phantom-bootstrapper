var assert = require('assert');
var postback = require('./postback');
var http = require('http');
var express = require('express');

describe('Consumer', function() {

    describe('Postback', function(done) {
        var testServer = express();
        var success = false;
        testServer.post('/postbacktest/', function(req, res) {
            success = true;
            assert.equal(req.query.abc, 'def');
            assert.equal(req.body, '<html>some data</html>');
            testServer.close();
            done();
        });

        var postbackUrl = 'http://localhost:3011/postbacktest';
        testServer.listen(3011, function() {
            postback(postbackUrl, {
                'abc': 'def'
            }, '<html>some data</html>');
        });

        after(function() {
            assert(success);
        })
    });
});
