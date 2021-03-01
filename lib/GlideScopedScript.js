"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlideScopedScript = void 0;
var lodash_1 = __importDefault(require("lodash"));
var GlideScopedScript = /** @class */ (function () {
    function GlideScopedScript(functionName, functionParameters, clientScript) {
        this._id = 'GlideScopedScript';
        this._function = functionName;
        this._parameters = functionParameters || [];
        this._script = clientScript;
        this._scope = null;
        this._scopedFunction = null;
    }
    Object.defineProperty(GlideScopedScript.prototype, "id", {
        get: function () {
            return this._id;
        },
        /**
         * Used for log messages
         * @param id
         */
        set: function (id) {
            this._id = id;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GlideScopedScript.prototype, "scope", {
        get: function () {
            return this._scope;
        },
        set: function (s) {
            this._scope = s;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GlideScopedScript.prototype, "scopedFunction", {
        /**
         * Lazy generation of the function
         * @return {Function}
         */
        get: function () {
            if (!this._scopedFunction) {
                var scopedFunction = void 0;
                var scopeVariableNames = "";
                var scopeArguments = [];
                if (this.scope) {
                    scopeVariableNames = this.scope.getVariableNames();
                    scopeArguments = this.scope.getArguments();
                }
                var functionName = this._function;
                var script = this._script;
                try {
                    var scopingFunction = new Function(scopeVariableNames, "return (" + script + ");");
                    // create the closure
                    scopedFunction = scopingFunction.apply(scopingFunction, scopeArguments);
                }
                catch (e) {
                    // Try to accommodate multiple root function declarations
                    if (functionName) {
                        // Wrap the whole script in a single function
                        var scopingFunction = new Function(scopeVariableNames, script + "; return " + functionName + ";");
                        // create the closure
                        scopedFunction = scopingFunction.apply(scopingFunction, scopeArguments);
                    }
                    else {
                        throw e;
                    }
                }
                finally {
                    this._scopedFunction = scopedFunction;
                }
            }
            return this._scopedFunction;
        },
        enumerable: false,
        configurable: true
    });
    GlideScopedScript.prototype.getArguments = function (locals) {
        if (locals === void 0) { locals = {}; }
        var isLocalsArray = lodash_1.default.isArray(locals);
        var scopeVariables = this.scope ? this.scope.getVariables() : {};
        return this._parameters.map(function (name, index) {
            if (isLocalsArray) {
                return locals[index];
            }
            else if (locals[name]) {
                return locals[name];
            }
            else {
                return scopeVariables[name];
            }
        });
    };
    /**
     * Take optional args to set as an array. Will map by index
     * @alias invoke([...])
     * @param arg1, arg2, ... argN
     * @return {*}
     */
    GlideScopedScript.prototype.call = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.invoke(args.length ? args : undefined);
    };
    /**
     * Take optional args to set as an array or map. Will map by name
     * @param {Object} args
     * @return {*}
     */
    GlideScopedScript.prototype.invoke = function (args) {
        if (args === void 0) { args = {}; }
        var fn = this.scopedFunction;
        try {
            return fn.apply(fn, this.getArguments(args));
        }
        catch (e) {
            console.error('SCRIPT:EXEC', 'Error while running Client Script "' + this.id + '": ' + e);
        }
    };
    return GlideScopedScript;
}());
exports.GlideScopedScript = GlideScopedScript;
