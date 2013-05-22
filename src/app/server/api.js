/**
 * @fileoverview Takes request, places into queue for running later
 */

var kue = require('kue');
var jobs = kue.createQueue();
var util = require('../util');

/**
 * @param {something} req
 * @param {something} req
 */
exports.bootstrap = function(req, res) {
    var bsType = req.params.bstype;

    // TODO(rrp): Standardize all this error checking
    // Gross

    // TODO(rrp): Enum / setting types?
    if (bsType !== 'fyre.conv') {
        res.json(400, {error: 'Bad bootstrap type'});
        return;
    }

    var data = req.query.data;

    if (!data) {
        res.json(400, {error: 'Missing query param `data`'});
        return;
    }

    try {
        data = JSON.parse(data);
    } catch (e) {
        res.json(400, {error: 'Could not parse data object: ' + data});
        return;
    }

    var callback = req.query.callback;
    if (!data) {
        res.json(400, {error: 'Missing query param: ' + callback});
        return;
    }

    util.setRedisServer();
    // Just add to queue if all is good.
    jobs.create('bootstrapper', {
        bsType: bsType,
        data: data,
        callback: callback
    }).save();

    console.log('Added job to `bootstrapper` queue');

    res.json(200, {message: 'Boostrap job successfully added'});
};
