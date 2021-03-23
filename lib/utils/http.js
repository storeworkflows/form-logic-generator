"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeURIParameters = exports.sendRequestFactory = exports.http = void 0;
// @ts-ignore
var sn_http_request_1 = require("sn-http-request");
exports.http = sn_http_request_1.snHttpFactory({
    // @ts-ignore
    xsrfToken: window.g_ck,
    batching: false
});
function sendRequestFactory() {
    return function sendRequest(url, method, options) {
        var _a = options.headers, headers = _a === void 0 ? {
            'X-WantSessionNotificationMessages': true
        } : _a, _b = options.params, params = _b === void 0 ? {} : _b, _c = options.body, body = _c === void 0 ? {} : _c, _d = options.broadcastResourcesChanged, broadcastResourcesChanged = _d === void 0 ? function () { } : _d, moreOptions = __rest(options, ["headers", "params", "body", "broadcastResourcesChanged"]);
        return new Promise(function (resolve, reject) {
            exports.http.request(url, method, __assign(__assign({ headers: headers,
                params: params }, moreOptions), { data: body }))
                .then(function (response) {
                Promise.resolve(resolve(response)).then(broadcastResourcesChanged(response));
            })
                .catch(function (httpResponse) {
                var response = httpResponse.response;
                Promise.resolve(reject(response)).then(broadcastResourcesChanged(response));
            });
        });
    };
}
exports.sendRequestFactory = sendRequestFactory;
/**
 * Encodes the provided parameter object key/values
 * @param {Object} parameters
 * @returns {String} param=value&param2=value2...
 */
function encodeURIParameters(obj) {
    var parts = Object.keys(obj).reduce(function (a, k) {
        a.push(k + '=' + encodeURIComponent(obj[k]));
        return a;
    }, []);
    return parts.join('&');
}
exports.encodeURIParameters = encodeURIParameters;
