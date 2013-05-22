/**
 * @fileoverview Process bootstrapper jobs
 * TODO(rrp): Handle errors, redis connection, ports, etc
 */

var kue = require('kue');
var jobs = kue.createQueue();
var runner = require('./phantomrunner');
var postBack = require('./postback');
var util = require('../util');

exports.start = function() {
    console.log('Starting bootstrap queue consumer');

    util.setRedisServer();
    jobs.process('bootstrapper', function(job, done) {
        var args = job.data;
        runner.run(args.bsType, args.data, function(rawData) {
            postBack(args.callback, args.data, rawData);
            done();
        });
    });
};
