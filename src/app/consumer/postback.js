/**
 * @fileoverview Postback bootstapper results
 * TODO(rrp): Handle errors
 */
var http = require('http');
var url = require('url');
var querystring = require('querystring');

/**
 * Post to the callbackurl with the rawData as the body and args as query params
 * @param {string} callbackUrl
 * @param {Object} queryParams
 * @param {string} rawData
 */
module.exports = function(callbackUrl, queryParams, rawData) {
    console.log('Postbacking to ' + callbackUrl);
    var parsedUrl = url.parse(callbackUrl);
    var path = makePath(parsedUrl.path, queryParams);
    var options = {
        host: parsedUrl.hostname,
        port: parsedUrl.port,
        path: path,
        method: 'POST',
        headers: {
            'Content-Length': rawData.length,
            'Content-Type': 'text/html',
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };

    var req = http.request(options, function(res){
        res.setEncoding('utf8');
        res.on('data', function() {
            console.log('Postback success');
        });
    });

    req.on('error', function(e) {
        console.error('Problem with request: ' + e.message);
        console.log(JSON.stringify(e));
    });

    console.log('Sending raw data: ' + rawData);
    req.write(rawData);
    req.end();
};

/**
 * @param {string} path
 * @param {Object} args
 */
var makePath = function(path, args) {
    var sep = '?';
    if (path.indexOf(sep) > -1) {
        sep = '&'
    }
    path += sep + querystring.stringify(args);
    return path;
};
