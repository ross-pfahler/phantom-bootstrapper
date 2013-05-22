var kue = require('kue');
var redis = require('kue/node_modules/redis');
var url = require('url');

exports.setRedisServer = function() {
    if (!process.env.REDISTOGO_URL) {
        console.error('Missing REDISTOGO_URL..nogo');
        console.log('Is it added to your env? (for localdev, this is \
            export REDISTOGO_URL=redis://localhost:6379)');
        process.exit();
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
