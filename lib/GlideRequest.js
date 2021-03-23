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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("./utils/http");
var lodash_1 = __importDefault(require("lodash"));
var GlideRequest = /** @class */ (function () {
    function GlideRequest() {
    }
    GlideRequest.applyOptions = function (method, url, options) {
        var fetchOptions = __assign(__assign({}, options), { method: method, url: url });
        var data = fetchOptions.data, dataType = fetchOptions.dataType;
        switch (method) {
            case 'get':
                if (data) {
                    // @note: quick and dirty param concat
                    var params = http_1.encodeURIParameters(data);
                    if (url.indexOf('?') !== -1)
                        fetchOptions.url = url + '&' + params;
                    else
                        fetchOptions.url = url + '?' + params;
                }
                break;
            default:
                if (dataType === 'xml')
                    fetchOptions.body = http_1.encodeURIParameters(data);
                else
                    fetchOptions.body = data;
                break;
        }
        switch (dataType) {
            default:
            case 'json':
                fetchOptions.headers = {
                    Accept: 'application/json, text/javascript',
                    'Content-Type': 'application/json',
                    // @ts-ignore
                    'X-UserToken': window.g_ck
                };
                break;
            case 'xml':
                fetchOptions.headers = {
                    Accept: 'application/xml, text/xml',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    // @ts-ignore
                    'X-UserToken': window.g_ck
                };
                break;
        }
        return fetchOptions;
    };
    GlideRequest.prototype.requestFactory = function (method, url, options) {
        if (!url) {
            throw 'Must specify a URL';
        }
        var fetchOptions = GlideRequest.applyOptions(method, url, options);
        return this.sendRequest(fetchOptions.url, method, fetchOptions);
    };
    GlideRequest.getAngularURL = function (path, parameters) {
        return ('/angular.do?sysparm_type=' +
            path +
            '&' +
            (parameters ? http_1.encodeURIParameters(parameters) : ''));
    };
    GlideRequest.prototype.get = function (url, options) {
        return this.requestFactory(url, 'get', options);
    };
    GlideRequest.prototype.post = function (url, options) {
        if (!url) {
            throw 'Must specify a URL';
        }
        var fetchOptions = GlideRequest.applyOptions('post', url, options);
        return this.sendRequest(fetchOptions.url, 'post', fetchOptions).then(function (response) {
            /* for glideAjax */
            var type = fetchOptions.dataType;
            response.type = type;
            response.responseText = response.data;
            response.responseXML =
                type === 'xml'
                    ? lodash_1.default.get(response, 'request.responseXML', null)
                    : null;
            return response;
        }, function (response) {
            return response;
        });
    };
    GlideRequest.prototype.put = function (url, options) {
        return this.requestFactory(url, "put", options);
    };
    GlideRequest.prototype.patch = function (url, options) {
        return this.requestFactory(url, "patch", options);
    };
    GlideRequest.prototype.getFactory = function (_a) {
        var sendRequest = _a.sendRequest;
        this.sendRequest = sendRequest;
        return {
            getAngularURL: GlideRequest.getAngularURL,
            get: this.get,
            post: this.post,
            put: this.put,
            patch: this.patch
        };
    };
    ;
    return GlideRequest;
}());
exports.default = new GlideRequest();
