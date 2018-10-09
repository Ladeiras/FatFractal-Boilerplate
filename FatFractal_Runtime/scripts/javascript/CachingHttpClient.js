var require = require;
var exports = exports;

var ff = require('ffef/FatFractal');
var hc = require('ringo/httpclient');
var fs = require('fs'); // CommonJS file-system module

var _debug = false;
var checkedHttpCacheDirExists = false;

exports.setDebug = function(b) {
    _debug = !!b;
};

exports.request = function(options) {
    // Return a "response" object which will respond appropriately to gets on the contentBytes, content and status properties

    options.cacheTime = options['cacheTime'];

    var msg;
    if (!options.url || options.url == '') {
        msg = "CachingHttpClient requires 'url' in request options";
        ff.logger.error(msg);
        throw {statusCode:500, statusMessage:msg};
    }
    // If the method isn't 'GET' or cacheTime isn't supplied, throw an error
    if (options.method !== 'GET' || options.cacheTime === undefined || options.cacheTime === null) {
        msg = "CachingHttpClient requires method to be 'GET' and requires a cacheTime to be set in the request options";
        ff.logger.error(msg);
        throw {statusCode:500, statusMessage:msg};
    }

    // Create a filename for the request by stripping all non-alpha-numeric characters from the URL
    //noinspection JSUnresolvedFunction
    var cacheDirPath = fs.workingDirectory() + "/WEB-INF/HttpCache";
    if (!checkedHttpCacheDirExists) {
        if (! fs.exists(cacheDirPath)) {
            //noinspection JSUnresolvedFunction
            fs.makeTree(cacheDirPath);
        }
        checkedHttpCacheDirExists = true;
    }

    var fileName = options.url.replace(/\W/g, '');
    var cacheFilePath = cacheDirPath + '/' + fileName;

    var now = new Date();
    var responseContentBytes = null;

    // If cacheTime > 0
    if (options.cacheTime > 0) {
        // If we have a cached file matching this URL
        if (fs.exists(cacheFilePath)) {
            // If created after 'cacheTime' seconds ago, return it
            if (fs.lastModified(cacheFilePath).getTime() > (now.getTime() - 1000 * options.cacheTime) ) {
                if (_debug) ff.logger.forceInfo("CachingHttpClient: Found cached response for " + options.url + " - inside of cacheTime - returning it");
                responseContentBytes = fs.read(cacheFilePath, {read:true, binary:true});

                return {
                    content: responseContentBytes.decodeToString("UTF-8"),
                    contentBytes: responseContentBytes,
                    status: 200,
                    servedFromCache: true
                };
            }
            // Else delete the cached file
            else {
                if (_debug) ff.logger.forceInfo("CachingHttpClient: Found cached response for " + options.url + " - outside of cacheTime - removing it");
                fs.remove(cacheFilePath);
            }
        }
    }

    // If we've got to here, then either cacheTime is <= 0, or we have not found any cached content. So ...

    // Hit the network
    if (_debug) ff.logger.forceInfo("CachingHttpClient: Hitting the network for " + options.url);
    var response = hc.request(options);
    //noinspection JSUnusedLocalSymbols
    var status = response.status;
    responseContentBytes = response.contentBytes;

    // Write the data to cache
    if (_debug) ff.logger.forceInfo("CachingHttpClient: Writing response to cache for " + options.url);
    fs.write(cacheFilePath, responseContentBytes);

    // Return the response
    return response;
};
