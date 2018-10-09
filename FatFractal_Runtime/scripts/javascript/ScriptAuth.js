/**
 * Created with IntelliJ IDEA.
 * User: david
 * Date: 1/9/13
 * Time: 2:49 PM
 * To change this template use File | Settings | File Templates.
 */

function getAuthRequestData() {
    return FF_JS_API.getThreadLocalObject("FF_AUTH_REQUEST_DATA");
}


// object types

function Token(token, secret) {
    this.token = token;
    this.secret = secret;
}

function FFUser(userName, firstName, lastName, email) {
    // TODO: rest of members?
    this.userName = userName;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
}


// scribe

function setScribeApiClassName(authService, className) {
    FF_JS_API.getScribeWrapper(authService).setApiClassName(className);
}

function setScribeApiKey(authService, apiKey) {
    FF_JS_API.getScribeWrapper(authService).setApiKey(apiKey);
}

function setScribeApiSecret(authService, apiSecret) {
    FF_JS_API.getScribeWrapper(authService).setApiSecret(apiSecret);
}

function setScribeScope(authService, scope) {
    FF_JS_API.getScribeWrapper(authService).setScope(scope);
}

function getScribeRequestToken(authService, callbackUri, redirectThruFF) {
    return FF_JS_API.getScribeWrapper(authService).getRequestToken(callbackUri, redirectThruFF);
}

function getScribeAuthorizationUri(authService, requestToken, callbackUri, redirectThruFF) {
    return FF_JS_API.getScribeWrapper(authService).getAuthorizationUri(requestToken, callbackUri, redirectThruFF);
}

function getScribeAccessToken(authService, requestToken, verifier, callbackUri, redirectThruFF) {
    return FF_JS_API.getScribeWrapper(authService).getAccessToken(requestToken, verifier, callbackUri, redirectThruFF);
}

function scribeGet(authService, url, requestToken) {
    return FF_JS_API.getScribeWrapper(authService).request("GET", url, requestToken);
}


// exports

exports.getAuthRequestData = getAuthRequestData;

exports.Token = Token;
exports.FFUser = FFUser;

exports.setScribeApiClassName = setScribeApiClassName;
exports.setScribeApiKey = setScribeApiKey;
exports.setScribeApiSecret = setScribeApiSecret;
exports.setScribeScope = setScribeScope;

exports.getScribeRequestToken = getScribeRequestToken;
exports.getScribeAuthorizationUri = getScribeAuthorizationUri;
exports.getScribeAccessToken = getScribeAccessToken;
exports.scribeGet = scribeGet;