var kue = require('kue');
var redis = require('redis');
var url = require('url');

exports.setRedisServer = function() {
    if (!process.env.REDISTOGO_URL) {
        console.log('Missing REDISTOGO_URL...using local');
        return;
    }

    kue.redis.createClient = function() {
        var redisUrl = url.parse(process.env.REDISTOGO_URL);
        var client = redis.createClient(redisUrl.port, redisUrl.hostname);
        if (redisUrl.auth) {
            client.auth(redisUrl.auth.split(":")[1]);
        }
        return client;
    };
};
