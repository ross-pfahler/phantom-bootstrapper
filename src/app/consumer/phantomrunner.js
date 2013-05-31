/**
 * @fileoverview Run phantom bootstrapper jobs
 * Spawns a child process to run the phantomjs job, with a callback on
 * completion
 */

var childProcess = require('child_process');
var phantomjs = require('phantomjs');
var binPath = phantomjs.path;

/**
 * @param {string} type
 * @param {Object} data
 * @param {function()} callback
 */
exports.run = function(type, data, callback) {
    var childArgs = [
        __dirname + '/../../phantom/bootstrapper.js',
        type,
        encodeURIComponent(JSON.stringify(data))
    ];

    console.log('Running phantom child proc to get bs data');
    childProcess.execFile(binPath, childArgs, function(err, stdout, stderr) {
        console.log('Phantom child process has run');
        if (err || stderr) {
            console.log('Something went wrong with phantom child proc');
            console.log(stderr);
            console.log(err);
            return;
        }
        callback(stdout);
    });
};
