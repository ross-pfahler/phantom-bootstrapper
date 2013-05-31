/**
 * @param {string|function()} testFcn
 * @param {function()} onReadyFcn
 * @param {number=} opt_timeout Optional timeout specified in ms
 */
exports.waitFor = function(testFcn, onReadyFcn, opt_timeout) {
    var maxtimeOutMillis = opt_timeout ? opt_timeout : 12000;
    var start = new Date().getTime();
    var condition = false;
    var interval = setInterval(function() {
        if ( (new Date().getTime() - start < maxtimeOutMillis) && !condition ) {
            // If not time-out yet and condition not yet fulfilled
            condition = (typeof(testFcn) === "string" ? eval(testFcn) : testFcn());
        } else {
            if(!condition) {
                // If condition still not fulfilled (timeout but condition is 'false')
                phantom.exit(1);
            } else {
                // Condition fulfilled (timeout and/or condition is 'true')
                typeof(onReadyFcn) === "string" ? eval(onReadyFcn) : onReadyFcn();
                clearInterval(interval);
            }
        }
    }, 250);
};
