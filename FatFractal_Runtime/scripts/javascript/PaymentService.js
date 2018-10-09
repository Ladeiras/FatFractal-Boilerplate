var require = require;
var exports = exports;
var print = print;

var FF_JS_API = FF_JS_API;

//
// These next are here just so if you're using an IDE then it doesn't complain about unknown names
//
function NoServerJsApiFunctions() {
    this.paymentService = null;
    this.processCheckAVSRequest = null;
    this.processSaleAVSRequest = null;
}

/**
 * <br>NB: Request will be sent to the live IPPay gateway ONLY if your app is running in the cloud on a paid subscription.
 * <br>NB: In the desktop dev environment, the request will be sent to the IPPay test gateway
 * <br>NB: In the cloud, if your app is running in a sandbox subscription, the request will be sent to the IPPay test gateway
 * Send an address verified sale request. See IPPay documentation for details on what the fields mean.
 * @param data an object with the following fields (ALL OF WHICH MUST BE STRINGS!!!!!):
 * <br>
 * <br>terminalId
 * <br>transactionId
 * <br>cardNum
 * <br>cardExpMonth
 * <br>cardExpYear
 * <br>totalAmount
 * <br>CVV2
 * <br>cardName
 * <br>billingAddress
 * <br>billingCity
 * <br>billingStateProv
 * <br>billingPostalCode
 * <br>billingCountry
 * <br>billingPhone
 * <br>email
 * @return an object with the following fields:
 * <br>
 * <br>transactionId
 * <br>responseText
 * <br>approval
 * <br>actionCode
 * <br>addressMatch
 * <br>zipMatch
 * <br>AVS
 * <br>CVV2
 * <br>errMsg
 */
function processSaleAVSRequest (data) {
    return JSON.parse(FF_JS_API.paymentService.processSaleAVSRequest(JSON.stringify(data)));
}

/**
 * <br>NB: Request will be sent to the live IPPay gateway ONLY if your app is running in the cloud on a paid subscription.
 * <br>NB: In the desktop dev environment, the request will be sent to the IPPay test gateway
 * <br>NB: In the cloud, if your app is running in a sandbox subscription, the request will be sent to the IPPay test gateway
 * Send an address verified CHECK request. See IPPay documentation for details on what the fields mean.
 * @param data an object with the following fields (ALL OF WHICH MUST BE STRINGS except for ACH which is an object):
 * <br>
 * <br>terminalId
 * <br>transactionId
 * <br>totalAmount
 * <br>cardName
 * <br>billingAddress
 * <br>billingCity
 * <br>billingStateProv
 * <br>billingPostalCode
 * <br>billingCountry
 * <br>billingPhone
 * <br>ACH - an object with the following fields:
 * <br>   type
 * <br>   SEC
 * <br>   accountNumber
 * <br>   ABA
 * <br>   checkNumber
 * @return an object with the following fields:
 * <br>
 * <br>transactionId
 * <br>responseText
 * <br>approval
 * <br>actionCode
 * <br>addressMatch
 * <br>zipMatch
 * <br>AVS
 * <br>errMsg
 */
function processCheckAVSRequest (data) {
    data.className = "com.fatfractal.core.pay.ippay.model.CheckAVSRequest";
    return JSON.parse(FF_JS_API.paymentService.processCheckAVSRequest(JSON.stringify(data)));
}

function newTransactionId() {return FF_JS_API.paymentService.newTransactionId();}

function getAllRequestsByUserGuid(userGuid) {return JSON.parse(FF_JS_API.paymentService.getAllRequestsByUserGuid(userGuid)); }

function getAllResponseByUserGuid(userGuid) {return JSON.parse(FF_JS_API.paymentService.getAllResponseByUserGuid(userGuid)); }

function getAllRequestsByEntityGuid(entityGuid) {return JSON.parse(FF_JS_API.paymentService.getAllRequestsByEntityGuid(entityGuid)); }

function getAllResponsesByEntityGuid(entityGuid) {return JSON.parse(FF_JS_API.paymentService.getAllResponsesByEntityGuid(entityGuid)); }

function getRequestByTransactionId(transactionId) {return JSON.parse(FF_JS_API.paymentService.getRequestByTransactionId(transactionId)); }

function getResponseByTransactionId(transactionId) {return JSON.parse(FF_JS_API.paymentService.getResponseByTransactionId(transactionId)); }

exports.newTransactionId            = newTransactionId;
exports.processSaleAVSRequest       = processSaleAVSRequest;
exports.processCheckAVSRequest      = processCheckAVSRequest;
exports.getAllRequestsByUserGuid    = getAllRequestsByUserGuid;
exports.getAllResponseByUserGuid    = getAllResponseByUserGuid;
exports.getAllRequestsByEntityGuid  = getAllRequestsByEntityGuid;
exports.getAllResponsesByEntityGuid = getAllResponsesByEntityGuid;
exports.getRequestByTransactionId   = getRequestByTransactionId;
exports.getResponseByTransactionId  = getResponseByTransactionId;

/**
 * Send a FirstData commit request.
 * <br>NB: Request will be sent to the live FirstData gateway ONLY if your app is running in the cloud on a paid subscription.
 * <br>NB: In the desktop dev environment, the request will be sent to the FirstData test gateway
 * <br>NB: In the cloud, if your app is running in a sandbox subscription, the request will be sent to the FirstData test gateway
 * <br>See FirstData documentation for details on what the fields mean.
 * @param data an object with the following fields (ALL OF WHICH MUST BE STRINGS!!!!!):
 <br> exactId
 <br> password
 <br> transactionType
 <br> dollarAmount
 <br> surchargeAmount
 <br> cardNumber
 <br> transactionTag
 <br> track1
 <br> track2
 <br> pan
 <br> authorizationNum
 <br> expiryDate
 <br> cardHoldersName
 <br> verificationStr1
 <br> verificationStr2
 <br> cvdPresenceInd
 <br> zipCode
 <br> tax1Amount
 <br> tax1Number
 <br> tax2Amount
 <br> tax2Number
 <br> secureAuthRequired
 <br> secureAuthResult
 <br> ecommerceFlag
 <br> xid
 <br> cavv
 <br> cavvAlgorithm
 <br> referenceNo
 <br> customerRef
 <br> reference3
 <br> language
 <br> clientIP
 <br> clientEmail
 */
exports.processFirstDataCommitRequest = function (data) {
    data.className = "com.fatfractal.core.pay.firstdata.model.SendCommitRequest";
    return JSON.parse(FF_JS_API.paymentService.processFirstDataCommitRequest(JSON.stringify(data)));
};
