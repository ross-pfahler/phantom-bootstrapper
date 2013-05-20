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
    });
});

postbackServer.listen(3002);

var sendReq = function() {
    var data = {
        "collectionMeta": "eyJ0eXAiOiJqd3QiLCJhbGciOiJIUzI1NiJ9.eyJ0aXRsZSI6IlRlc3RpbmcgU29jaWFsU1luYyIsInVybCI6Imh0dHA6XC9cL3d3dy5kZW1vZnlyZS5jb21cL3FhXC90ZXN0aW5nLXNvY2lhbHN5bmNcLyIsInRhZ3MiOiIiLCJjaGVja3N1bSI6IjRjM2M0NjMwMzZlNjhkYWYyZGQ2YTgzNDc1MzEyMWRmIiwiYXJ0aWNsZUlkIjozNH0.yqhE21ufqL2Q9pHOIKDiJ8er8u7UqEGAPdDUapYgTnI",
        "checksum": "4c3c463036e68daf2dd6a834753121df",
        "siteId": "313879",
        "articleId": 34
    };

    var queryObj = {
        'callback': 'http://localhost:3002/handleBootstrap/',
        'data': JSON.stringify(data)
    };

    var queryString = querystring.stringify(queryObj);
    var url = 'http://localhost:3000/api/v1.0/bootstrap/fyre.conv/?' + queryString;

    http.get(url, function(res) {
        res.on('data', function(chunky) {
            console.log('Request sent: ' + chunky.toString());
        });
    });
};

sendReq();
