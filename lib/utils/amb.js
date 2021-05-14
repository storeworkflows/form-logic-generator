"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAmbEffect = void 0;
var getAmbEffect_1 = __importDefault(require("./getAmbEffect"));
var ambChannelRegistry = new Map();
var createAmbEffect = function (_a) {
    var id = _a.id, channel = _a.channel, callback = _a.callback, subscribe = _a.subscribe;
    var amb = getAmbEffect_1.default();
    if (!ambChannelRegistry.has(id)) {
        ambChannelRegistry.set(id, amb.getChannel(channel, { subscriptionCallback: function (message) { return undefined; } }));
    }
    var subscriptionChannel = ambChannelRegistry.get(id);
    var isSubscribed = subscriptionChannel.getCallback() !== undefined;
    if (!isSubscribed && subscribe) {
        subscriptionChannel.subscribe(callback);
    }
    else if (isSubscribed && !subscribe) {
        subscriptionChannel.unsubscribe();
        ambChannelRegistry.delete(id);
    }
};
exports.createAmbEffect = createAmbEffect;
