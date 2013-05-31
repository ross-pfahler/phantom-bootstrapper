var assert = require('assert');
var express = require('express');
var server = require('./server');
var http = require('http');
var url = require('url');
var querystring = require('querystring');

var kue = require('kue');
var jobs = kue.createQueue();

describe('App', function() {
    describe('serverOpenClose', function() {
        it('Make sure the server listens and closes', function(done) {
            assert(typeof server.all == 'function');

            var connectSuccessful = false;
            var closeSuccessful = false;
            var testServer = http.createServer(server);
            testServer.on('close', function() {
                closeSuccessful = true;
            });
            testServer.listen(3000, function() {
                connectSuccessful = true;
            });

            testServer.close();
            done();
            
            after(function() {
                assert(connectSuccessful);
                assert(closeSuccessful);
            });
        });
    });

    describe('postData', function() {
        it('Add a job into a running server', function(done) {
            var testServer = http.createServer(server);
            testServer.listen(3000, function() {
                makeReq();
            });

            var url = 'http://localhost:3000/api/v1.0/bootstrap/fyre.conv/';
            var data = {
                "siteId": "313879",
                "articleId": 34,
                "networkId": "livefyre.com"
            };
            var payload = {
                "data": JSON.stringify(data),
                "callback": "www.myurl.com"
            };
            url += '?' + querystring.stringify(payload);
            var response = null;
            var makeReq = function() {
                http.get(url, function(res) {
                    res.on('data', function(chunky) {
                        var strChunk = chunky.toString();
                        response = strChunk;
                    });
                    callback();
                });
            };
            var callback = function() {
                testServer.close();
                done();
            };

            after(function() {
                assert(response);
            });
        });
    });
});
