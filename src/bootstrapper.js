var port = 3020;
var system = require('system');
var page = require('webpage').create();
var server = require('./server').create(port);
var util = require('./util');
var module = system.args[1];
var config = system.args[2];

if (!module) {
    console.log('Missing module def');
}

if (!config) {
    console.log('Missing config def');
}

var url = 'http://localhost:' + port + '/' + module + '.html?config=' + config;
console.log('Bootstrapper: requesting url', url);

page.open(url, function(status) {
    if (status !== 'success') {
        console.log('No bs page for this module', module);
        phantom.exit();
    }

    // TODO(rrp): Generalize this bit
    // Wait for fyre-comment-stream el
    util.waitFor(function() {
        return page.evaluate(function() {
            return !!document.getElementsByClassName('fyre-comment-stream');
        });
    }, function() {
        var html = page.evaluate(function() {
            return document.getElementById('bs').innerHTML;
        });

        console.log(html);
        phantom.exit();
    });
});
