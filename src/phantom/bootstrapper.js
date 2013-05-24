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
    console.log('Missing module def');
    phantom.exit();
}

if (!config) {
    console.log('Missing config def');
    phantom.exit();
}

var url = 'http://localhost:' + port + '/' + module + '.html?config=' + config;
console.log('Bootstrapper: requesting url', url);

page.open(url, function(status) {
    console.log('got status: ' + status);

    if (status !== 'success') {
        console.log('No bs page for this module', module);
        phantom.exit();
    }

    // TODO(rrp): Generalize this bit
    // Wait for fyre-comment-stream el? (need to ensure 100% loaded somehow)
    util.waitFor(function() {
        return page.evaluate(function() {
            return document.getElementsByClassName('fyre-comment-stream').length > 0;
        });
    }, function() {

        // So we wait (by default) for 3000ms for the page to catch up.
        // This allows one or two stream requests to make their way in.
        var html = page.evaluate(function() {
            setTimeout(function() {
                return document.getElementById('bs').innerHTML;
            }, 3500);
        });
        phantom.exit();
    });
});
