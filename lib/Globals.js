"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GlobalStorage = /** @class */ (function () {
    function GlobalStorage() {
        this._wm = new WeakMap();
    }
    GlobalStorage.prototype.clear = function () {
        this._wm = new WeakMap();
    };
    GlobalStorage.prototype.delete = function (k) {
        return this._wm.delete(k);
    };
    GlobalStorage.prototype.get = function (k) {
        return this._wm.get(k);
    };
    GlobalStorage.prototype.has = function (k) {
        return this._wm.has(k);
    };
    GlobalStorage.prototype.set = function (k, v) {
        this._wm.set(k, v);
        return this;
    };
    return GlobalStorage;
}());
exports.default = new GlobalStorage();
