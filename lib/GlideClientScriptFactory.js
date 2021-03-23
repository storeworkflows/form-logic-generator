"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlideClientScriptFactory = void 0;
var GlideScopedScript_1 = require("./GlideScopedScript");
/**
 * Convenience for creating scripts of a certain type
 */
var GlideClientScriptFactory = /** @class */ (function () {
    function GlideClientScriptFactory(functionName) {
        var functionParameters = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            functionParameters[_i - 1] = arguments[_i];
        }
        this._name = functionName;
        this._parameters = functionParameters;
        this._scripts = [];
    }
    Object.defineProperty(GlideClientScriptFactory.prototype, "scope", {
        get: function () {
            return this._scope;
        },
        set: function (scope) {
            this._scope = scope;
            this._scripts.map(function (script) {
                script.scope = scope;
            });
        },
        enumerable: false,
        configurable: true
    });
    GlideClientScriptFactory.prototype.create = function (script, id) {
        if (id === void 0) { id = ""; }
        var clientScript = new GlideScopedScript_1.GlideScopedScript(this._name, this._parameters, script);
        if (id) {
            clientScript.id = id;
        }
        if (this.scope) {
            clientScript.scope = this.scope;
        }
        this._scripts.push(clientScript);
        return clientScript;
    };
    return GlideClientScriptFactory;
}());
exports.GlideClientScriptFactory = GlideClientScriptFactory;
