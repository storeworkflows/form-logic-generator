"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlideVariableScope = void 0;
var GlideVariableScope = /** @class */ (function () {
    function GlideVariableScope() {
        this._variables = {};
        this._variableNames = null;
    }
    GlideVariableScope.prototype.getVariables = function () {
        return this._variables;
    };
    GlideVariableScope.prototype.getVariableNames = function () {
        // @note: this will pin the variables
        if (!this._variableNames) {
            this._variableNames = Object.keys(this._variables);
        }
        return this._variableNames;
    };
    GlideVariableScope.prototype.getArguments = function () {
        var _this = this;
        return this.getVariableNames().map(function (key) {
            return _this._variables[key];
        });
    };
    GlideVariableScope.prototype.get = function (variable) {
        return this._variables[variable];
    };
    /**
     * Add variables to the scope
     * @param {*} variable - if an object is provided, all keys will be applied
     * @param [value]
     */
    GlideVariableScope.prototype.set = function (variable, value) {
        if (value === void 0) { value = null; }
        if (typeof variable !== 'string') {
            Object.assign(this._variables, variable);
        }
        else {
            this._variables[variable] = value;
        }
    };
    GlideVariableScope.prototype.unset = function (variable) {
        delete this._variables[variable];
    };
    return GlideVariableScope;
}());
exports.GlideVariableScope = GlideVariableScope;
