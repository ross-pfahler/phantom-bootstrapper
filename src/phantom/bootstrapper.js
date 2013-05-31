/**
 * @fileoverview Run the bootstrap service
 */

var port = 3020;
var system = require('system');
var page = require('webpage').create();
var server = require('./server').create(port);
var util = require('./util');
var module = system.args[1];
var config = system.args[2];

if (!module) {
    console.error('missing module');
    phantom.exit(1);
}

if (!config) {
    console.error('missing config');
    phantom.exit(1);
}

config = decodeURIComponent(config);
var url = 'http://localhost:' + port + '/' + module + '.html?config=' + config;
page.open(url, function(status) {

    if (status !== 'success') {
        console.error('Page could not be opened');
        phantom.exit(1);
    }

    // TODO(rrp): Generalize this bit
    // Wait for fyre-comment-stream el? (need to ensure 100% loaded somehow)
    util.waitFor(function() {
        return page.evaluate(function() {
            return document.getElementsByClassName('fyre-comment-stream').length > 0;
        });
    }, function() {
        var html = page.evaluate(function() {
            return document.getElementById('bs').innerHTML;
        });
        console.log(html);
        phantom.exit();
    });
});
