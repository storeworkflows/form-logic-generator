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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSessionMessageDataSource = void 0;
var utils_1 = require("../utils");
var notificationProcessor = function (table, sysId) { return function (notifications) {
    var extras = __assign(__assign({}, (table ? { table: table } : {})), (sysId ? { sysId: sysId } : {}));
    if (!notifications)
        return [];
    return notifications.reduce(function (messages, n) {
        if (n.text) {
            messages.push(__assign({ type: n.type || 'info', message: n.text }, extras));
        }
        return messages;
    }, []);
}; };
var SESSION_MESSAGE_QUERY_KEY = 'GlideDomain_Query';
var SESSION_MESSAGE_CONFIG_KEY = 'session';
var SESSION_MESSAGE_NOTIFICATIONS_KEY = 'notifications';
var QUERY_FRAGMENT = "\n" + SESSION_MESSAGE_QUERY_KEY + " {\n\t" + SESSION_MESSAGE_CONFIG_KEY + " {\n\t\tnotifications{\n\t\t\ttype\n\t\t\ttext\n\t\t\tnotificationType\n\t\t\tnotificationAttributes {\n\t\t\t\tattributeName\n\t\t\t\tattributeValue\n\t\t\t}\n\t\t\tchildNotifications {\n\t\t\t\ttype\n\t\t\t\ttext\n\t\t\t\tnotificationType\n\t\t\t}\n\t\t}\n\t}\n}\n";
var transformMessages = function (notifications, table, sysId) {
    var process = notificationProcessor(table, sysId);
    return process(notifications);
};
var createTransform = function (getValueOrDefault) { return function (data, state, properties) {
    var table = properties.table, sysId = properties.sysId;
    var messages = transformMessages(getValueOrDefault(SESSION_MESSAGE_NOTIFICATIONS_KEY, [])(data), table, sysId);
    return {
        messages: messages
    };
}; };
var createSessionMessageDataSource = function (queryPrefix) {
    if (queryPrefix === void 0) { queryPrefix = ''; }
    var baseKey = "" + queryPrefix + SESSION_MESSAGE_QUERY_KEY + "." + SESSION_MESSAGE_CONFIG_KEY;
    var getValueOrDefault = utils_1.getValue(baseKey);
    var transform = createTransform(getValueOrDefault);
    return utils_1.createDataProviderDataSource({
        query: QUERY_FRAGMENT,
        variables: [],
        transform: transform,
        selectableProps: {
            messages: {
                default: []
            }
        }
    });
};
exports.createSessionMessageDataSource = createSessionMessageDataSource;
