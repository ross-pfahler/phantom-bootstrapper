/**
 * @fileoverview Basic webserver that finds templates based on 
 *   request name (see ./templates) and fills in details based on conifg object
 */

var server = require('webserver').create();
var fs = require('fs');

/**
 * @param {string} url
 * @return {string}
 */
var getTmplNameFromUrl = function(url) {
    try {
        var parts = url.split('/');
        return parts[1].split('?')[0];
    } catch (e) {
        console.error('Cannot parse malformed url', url);
        throw e;
    }
};

/**
 * @param {string} url
 * @return {Object}
 */
var getCfgObjectFromUrl = function(url) {
    try {
        var config = url.split('config=')[1];
        return JSON.parse(decodeURIComponent(config));
    } catch (e) {
        console.error('Cannot parse config object from url', url);
        throw e;
    }
};

/**
 * @param {string} template
 * @param {Object} data
 * @return {string}
 */
var replaceTmplWithObject = function(template, data) {
    var key;
    for (key in data) {
        template = template.replace('{' + key + '}', data[key], 'g');
    }
    return template;
};

/**
 * Create a new server on port; will be killed by phantom.exit()
 * Requests should have corresponding templates, for example:
 *  A request to localhost:port/fyre.conv.html?config={}
 *  Will attempt to read the html file fyre.conv.html from the
 *  templates folder and replace any strings with the config
 *  object (see replaceTmplWithObject)
 * @param {number} port
 */
exports.create = function(port) {
    server.listen(port, function (request, response) {
        var url = request.url;        
        var tmplName = getTmplNameFromUrl(url);
        var path = fs.workingDirectory + '/src/phantom/templates/' + tmplName;

        try {
            var template = fs.read(path);
        } catch (e) {
            console.error('could not read from path');
            response.write('Bad template path');
            respose.close();
        }

        var config = getCfgObjectFromUrl(url);
        var data = replaceTmplWithObject(template, config);
        response.statusCode = 200;
        response.headers = {
            'Cache': 'no-cache',
            'Content-Type': 'text/html'
        };
        response.write(data);
        response.close();
    });
};
