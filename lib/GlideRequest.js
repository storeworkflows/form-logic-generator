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
function GlideRequest(sendRequest) {
    function applyOptions(method, url, options) {
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
    }
    function requestFactory(method, url, options) {
        if (!url) {
            throw 'Must specify a URL';
        }
        var fetchOptions = applyOptions(method, url, options);
        return sendRequest(fetchOptions.url, method, fetchOptions);
    }
    function getAngularURL(path, parameters) {
        return ('/angular.do?sysparm_type=' +
            path +
            '&' +
            (parameters ? http_1.encodeURIParameters(parameters) : ''));
    }
    function get(url, options) {
        return requestFactory(url, 'get', options);
    }
    function post(url, options) {
        if (!url) {
            throw 'Must specify a URL';
        }
        var fetchOptions = applyOptions('post', url, options);
        return sendRequest(fetchOptions.url, 'post', fetchOptions).then(function (response) {
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
    }
    function put(url, options) {
        return requestFactory(url, "put", options);
    }
    function patch(url, options) {
        return requestFactory(url, "patch", options);
    }
    return {
        getAngularURL: getAngularURL,
        get: get,
        post: post,
        put: put,
        patch: patch
    };
}
exports.default = GlideRequest;
