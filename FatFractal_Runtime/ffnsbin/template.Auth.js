var require = require;
var exports = exports;

var auth = require('ffef/ScriptAuth');

var TWITTER = "TWITTER";
auth.setScribeApiClassName(TWITTER, "org.scribe.builder.api.TwitterApi$SSL");
auth.setScribeApiKey(TWITTER, "twitter_api_key");
auth.setScribeApiSecret(TWITTER, "twitter_api_secret");

var FACEBOOK = "FACEBOOK";
auth.setScribeApiClassName(FACEBOOK, "org.scribe.builder.api.FacebookApi");
auth.setScribeApiKey(FACEBOOK, "facebook_app_id");
auth.setScribeApiSecret(FACEBOOK, "facebook_app_secret");

var INSTAGRAM = "INSTAGRAM";
auth.setScribeApiClassName(INSTAGRAM, "org.scribe.builder.api.InstagramApi");
auth.setScribeApiKey(INSTAGRAM, "instagram_client_id");
auth.setScribeApiSecret(INSTAGRAM, "instagram_client_secret");

var AUTH_SERVICES = [TWITTER, FACEBOOK, INSTAGRAM];

function validAuthServices() {
    return AUTH_SERVICES;
}

function getRequestToken() {
    var authService = auth.getAuthRequestData().scriptAuthService;
    var callbackUri = auth.getAuthRequestData().callbackUri;

    var token = null;
    if (authService == TWITTER) {
        var scribeToken = auth.getScribeRequestToken(authService, callbackUri, true);   // this returns a Scribe Token object
        token = new auth.Token(scribeToken.getToken(), scribeToken.getSecret());        // this creates the type of object we should return
    }

    return token;
}

function getAuthorizationUri() {
    var authService = auth.getAuthRequestData().scriptAuthService;
    var requestToken = auth.getAuthRequestData().requestToken;
    var callbackUri = auth.getAuthRequestData().callbackUri;

    var scribeRequestToken = null;
    if (authService == TWITTER) {
        // 'requestToken' is an auth.Token type, must create a Scribe Token from it
        scribeRequestToken = new Packages.org.scribe.model.Token(requestToken.token, requestToken.secret);
    }

    return auth.getScribeAuthorizationUri(authService, scribeRequestToken, callbackUri, true);
}

function getVerifierParameterName() {
    var authService = auth.getAuthRequestData().scriptAuthService;
    switch (authService) {
        case TWITTER:
            return "oauth_verifier";
        case FACEBOOK:
        case INSTAGRAM:
            return "code";
        default:
            return null;
    }
}

function getAccessToken() {
    var authService = auth.getAuthRequestData().scriptAuthService;
    var requestToken = auth.getAuthRequestData().requestToken;
    var verifier = auth.getAuthRequestData().verifier;
    var callbackUri = auth.getAuthRequestData().callbackUri;

    // 'requestToken' is an auth.Token type, must create a Scribe Token from it
    var scribeRequestToken = new Packages.org.scribe.model.Token(requestToken.token, requestToken.secret);

    var scribeAccessToken = auth.getScribeAccessToken(authService, scribeRequestToken, verifier, callbackUri, true);
    var accessToken = new auth.Token(scribeAccessToken.getToken(), scribeAccessToken.getSecret());
    return accessToken;
}

function validateRegisterRequest() {
    var rr = auth.getAuthRequestData().registerRequest;
    var authService = rr.scriptAuthService;

    switch (authService) {
        case TWITTER:
            if (rr.token && rr.secret) {
                return true;
            } else {
                print("ERROR: Script auth service " + authService + " requires credential fields 'token' and 'secret'");
                return false;
            }
        case FACEBOOK:
        case INSTAGRAM:
            if (rr.token) {
                return true;
            } else {
                print("ERROR: Script auth service " + authService + " requires credential field 'token'");
                return false;
            }
        default:
            print("ERROR: Unknown script auth service: " + authService);
            return false;
    }
}

/**
 * Takes a credential map and removes any sensitive information, such as passwords
 * @return {*} Sanitized credential map
 */
function sanitizeCredential() {
    var credential = auth.getAuthRequestData().credential;
    var authService = credential.scriptAuthService;

    var sanitizedCredential = {};
    for (var i in credential) {
        sanitizedCredential[i] = credential[i];
    }

    switch (authService) {
        case TWITTER:
        case INSTAGRAM:
            delete sanitizedCredential.token;
            delete sanitizedCredential.secret;
            break;
        case FACEBOOK:
            delete sanitizedCredential.token;
            break;
    }

    return sanitizedCredential;
}

/**
 * Verify provided credentials.
 * If successful, return an {@link FFUser} object containing AT LEAST a username, more information if applicable.
 * If unsuccessful, return null.
 * Note that any additional information returned in the FFUser object will be used to supplement a registration request.
 * @return {*} FFUser object, or null if authentication fails.
 */
function verifyCredential() {
    var credential = auth.getAuthRequestData().credential;
    var createAccount = auth.getAuthRequestData().createAccount;
    var authService = credential.scriptAuthService;

    var scribeAccessToken = new Packages.org.scribe.model.Token(credential.token, credential.secret);
    var url = null;
    switch (authService) {
        case TWITTER:
            url = "https://api.twitter.com/1.1/account/verify_credentials.json";
            break;
        case FACEBOOK:
            url = "https://graph.facebook.com/me";
            break;
        case INSTAGRAM:
            url = "https://api.instagram.com/v1/users/self";
            break;
        default:
            throw new Error("Unknown ScriptAuth service: " + authService);
    }

    var rawUser = auth.scribeGet(authService, url, scribeAccessToken);

    // At this point, rawUser is just the raw response which may be an error response or the actual user response
    // check for errors
    // Twitter response has "errors"
    // Facebook response has "error"
    if ((authService === TWITTER && rawUser.errors) ||
        (authService === FACEBOOK && rawUser.error) ||
        (authService === INSTAGRAM && rawUser.meta.error_type)) {
        print("Error retrieving user object from service " + authService + " - response is " + JSON.stringify(rawUser));
        return null;
    }

    var userName, firstName, lastName, email;
    switch (authService) {
        case TWITTER:
            userName = rawUser.screen_name;
            email = null;  // not returned by Twitter API calls

            var n = names(rawUser.name);
            firstName = n[0];
            lastName = n[1];

            break;
        case FACEBOOK:
            userName = rawUser.username || rawUser.email;
            if (!userName) {
                throw ('ERROR: Facebook user has no username or email : ' + JSON.stringify(rawUser)).toString();
            }
            firstName = rawUser.first_name;
            lastName = rawUser.last_name;
            email = rawUser.email;
            break;
        case INSTAGRAM:
            userName = rawUser.data.username;
            email = null;

            n = names(rawUser.data.full_name);
            firstName = n[0];
            lastName = n[1];

            break;
    }

    return new auth.FFUser(userName, firstName, lastName, email);
}

exports.validAuthServices = validAuthServices;
exports.getRequestToken = getRequestToken;
exports.getAuthorizationUri = getAuthorizationUri;
exports.getVerifierParameterName = getVerifierParameterName;
exports.getAccessToken = getAccessToken;

exports.validateRegisterRequest = validateRegisterRequest;
exports.sanitizeCredential = sanitizeCredential;
exports.verifyCredential = verifyCredential;


// Utility

function names(fullName) {
    var names = fullName.split(" "),
        firstName, lastName;
    if (names.length > 1) {
        var tmp = names[0];
        for (var i = 1; i < names.length-1; i++) {
            tmp += " " + names[i];
        }
        firstName = tmp.toString(); // necessary to turn ConsString into normal string (Rhino-specific)
        lastName = names[names.length-1];
    } else {
        firstName = fullName;
        lastName = "";
    }
    return [firstName, lastName];
}