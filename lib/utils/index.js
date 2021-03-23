"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDataProviderDataSource = exports.getValue = void 0;
var lodash_1 = __importDefault(require("lodash"));
function getValue(baseKey) {
    var getSubKey = function getSubKey(key) {
        return baseKey + "." + key;
    };
    return function (key, defaultValue) {
        return function (data) {
            return lodash_1.default.get(data, getSubKey(key), defaultValue);
        };
    };
}
exports.getValue = getValue;
;
function createDataProviderDataSource(_a) {
    var query = _a.query, variables = _a.variables, getParams = _a.getParams, transform = _a.transform, props = _a.props, selectableProps = _a.selectableProps, templateVariables = _a.templateVariables;
    return {
        query: query,
        variables: variables,
        getParams: getParams,
        transform: transform,
        props: props,
        selectableProps: selectableProps,
        templateVariables: templateVariables
    };
}
exports.createDataProviderDataSource = createDataProviderDataSource;
;
