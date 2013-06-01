/**
 * @fileoverview Just a test harness to put jobs and the queue and (hopefully)
 * get results back. Basically an end-to-end test
 */

var http = require('http');
var express = require('express');
var querystring = require('querystring');

// Set up server to handle postback fun
var postbackServer = express();
postbackServer.post('/handleBootstrap/', function(req, res) {
    var data = '';
    req.on('data', function(chunk) { 
       data += chunk.toString();
    });

    req.on('end', function() {
        console.log('Got data');
        console.log('Query data: ' + JSON.stringify(req.query));
        console.log('Some html too (len=' + data.length + ')');
        console.log(data);
    });

    res.json(200, {
        'data': 'gotitthanks'
    });
});

postbackServer.listen(3002);

var sendReq = function() {
    var data = {
        "siteId": "313879",
        "articleId": 34,
        "networkId": "livefyre.com",
        "app": "main"
    };

    var queryObj = {
        'callback': 'http://localhost:3002/handleBootstrap/',
        'data': JSON.stringify(data)
    };

    var queryString = querystring.stringify(queryObj);
    var url = 'http://localhost:5000/api/v1.0/bootstrap/fyre.conv/?' + queryString;

    http.get(url, function(res) {
        res.on('data', function(chunky) {
            console.log('Request sent: ' + chunky.toString());
        });
    });
};

sendReq();
