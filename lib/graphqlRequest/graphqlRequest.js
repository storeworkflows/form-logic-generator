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
var cross_fetch_1 = __importDefault(require("cross-fetch"));
var DEFAULT_GQL_ENDPOINT = '/api/now/graphql';
function graphqlRequest(_a) {
    var _b = _a.operationName, operationName = _b === void 0 ? '' : _b, _c = _a.query, query = _c === void 0 ? {} : _c, _d = _a.variables, variables = _d === void 0 ? {} : _d, _e = _a.params, params = _e === void 0 ? {} : _e;
    var options = __assign(__assign({ method: 'POST' }, params), { credentials: 'same-origin', headers: {
            'content-type': "application/json",
            // @ts-ignore
            'X-Transaction-Source': window.transaction_source,
            'X-UserToken': "d15ef583dbd660103d9aca32399619b50309720d3377c41e9c8a03ec0b50a52dcaec2dab" //window.g_ck
        }, body: JSON.stringify([{
                operationName: operationName,
                query: query,
                variables: variables
            }]) });
    return cross_fetch_1.default(DEFAULT_GQL_ENDPOINT, options);
}
exports.default = graphqlRequest;
