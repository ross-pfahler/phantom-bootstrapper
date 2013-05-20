/**
 * @fileoverview Start the app server
 */

var server = require('./app/server');

var port = process.argv[2];
if (!port) {
    console.log('Missing port');
    return;
}

server.listen(parseInt(port, 10));

console.log('starting server on port: ' + port);
process.on('exit', function() {
    console.log('stopping server');
});
