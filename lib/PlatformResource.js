"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("./utils/http");
var GlideRecord_1 = require("./GlideRecord");
var GlideRequest_1 = __importDefault(require("./GlideRequest"));
var GlideFormEnvironment_1 = require("./GlideFormEnvironment");
var Globals_1 = __importDefault(require("./Globals"));
var PlatformResource = /** @class */ (function () {
    function PlatformResource() {
    }
    PlatformResource.assignPlatformResources = function (sendRequest) {
        var glideFormEnvironmentFactory = window['glideFormEnvironmentFactory']; // @ts-ignore
        var glideFormFactory = window['glideFormFactory']; // @ts-ignore
        var glideAjax = window['GlideAjax']; // @ts-ignore
        var glideRecord = GlideRecord_1.glideRecordFactory({ sendRequest: sendRequest }); // @ts-ignore
        var glideModalFactory = window['glideModalFactory']; // @ts-ignore
        var glideUser = window['GlideUser']; // @ts-ignore
        var uiScriptFactory = window['uiScriptFactory'];
        var glideRequest = GlideRequest_1.default.getFactory({ sendRequest: sendRequest });
        // inject new request layer
        glideFormFactory.glideRequest = glideRequest;
        glideAjax.glideRequest = glideRequest;
        glideRecord.glideRequest = glideRequest; // @ts-ignore
        window['GlideRecord'] = glideRecord;
        return {
            glideFormEnvironmentFactory: glideFormEnvironmentFactory,
            glideFormFactory: glideFormFactory,
            glideAjax: glideAjax,
            glideRecord: glideRecord,
            glideModalFactory: glideModalFactory,
            glideUser: glideUser,
            uiScriptFactory: uiScriptFactory
        };
    };
    PlatformResource.prototype.loadPlatformResources = function (sendRequest) {
        // @ts-ignore
        if (typeof window['glideFormFactory'] !== 'undefined') {
            return Promise.resolve(PlatformResource.assignPlatformResources(sendRequest));
        }
        var script = document.createElement('script');
        script.src = 'https://ven04075.service-now.com/scripts/sn/common/clientScript/js_includes_clientScript.js';
        var promise = new Promise(function (resolve, reject) {
            script.onload = function () {
                resolve(PlatformResource.assignPlatformResources(sendRequest));
            };
            script.onerror = function () {
                reject();
            };
        });
        document.getElementsByTagName('head')[0].appendChild(script);
        return promise;
    };
    PlatformResource.prototype.load = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var glideEnvPromiseResolve_1, glideEnvPromiseReject_1, glideEnvPromise, sendRequest, resources, currentResources, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        glideEnvPromise = new Promise(function (resolve, reject) {
                            glideEnvPromiseResolve_1 = resolve;
                            glideEnvPromiseReject_1 = reject;
                        });
                        sendRequest = http_1.sendRequestFactory();
                        Globals_1.default.set(id, {
                            sendRequest: sendRequest,
                            glideEnvironment: null,
                            formModal: null,
                            liveUpdate: null,
                            eventHandler: null,
                            glideEnvPromise: glideEnvPromise
                        });
                        return [4 /*yield*/, this.loadPlatformResources(sendRequest)];
                    case 1:
                        resources = _a.sent();
                        currentResources = Globals_1.default.get(id);
                        if (!currentResources)
                            throw new Error("Error when setted default values");
                        currentResources.glideEnvironment = new GlideFormEnvironment_1.GlideFormEnvironment(resources);
                        glideEnvPromiseResolve_1(currentResources.glideEnvironment);
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        console.warn("Unable to load platform resources", error_1);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return PlatformResource;
}());
exports.default = PlatformResource;
