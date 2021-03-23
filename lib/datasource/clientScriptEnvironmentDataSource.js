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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createClientScriptEnvironmentDataSource = exports.QUERY_FRAGMENT = exports.CLIENT_SCRIPTS_QUERY_KEY = exports.UI_POLICIES_QUERY_KEY = exports.GLOBALS_QUERY_KEY = exports.SCRIPTING_QUERY_KEY = void 0;
var utils_1 = require("../utils");
var lodash_1 = __importDefault(require("lodash"));
var uiPolicyParser_1 = __importDefault(require("../utils/uiPolicyParser"));
var FormTemplate_1 = require("../constants/FormTemplate");
exports.SCRIPTING_QUERY_KEY = 'GlideClientScriptingEnvironment_Query';
exports.GLOBALS_QUERY_KEY = 'ClientScriptingEnvironment_Globals';
exports.UI_POLICIES_QUERY_KEY = 'ClientScriptingEnvironment_Policies';
exports.CLIENT_SCRIPTS_QUERY_KEY = 'ClientScriptingEnvironment_Scripts';
exports.QUERY_FRAGMENT = "\nGlideClientScriptingEnvironment_Query {\n\tClientScriptingEnvironment_Globals(table: $table, sysId: $sysId, query: $query) {\n\t\tg_scratchpad\n\t\tg_language\n\t\tg_date_time_format\n\t\tg_decimal_separator\n\t\tg_user_grouping\n\t\tg_text_direction\n\t\tg_is_accessible\n\t}\n\tClientScriptingEnvironment_Scripts(table: $table, view: $view, sysId: $sysId, query: $query) {\n\t\tonLoad {\n\t\t\tname\n\t\t\tsysId\n\t\t\tscript\n\t\t\ttype\n\t\t\tfieldName\n\t\t\ttableName\n\t\t}\n\t\tonChange {\n\t\t\tname\n\t\t\tsysId\n\t\t\tscript\n\t\t\ttype\n\t\t\tfieldName\n\t\t\ttableName\n\t\t}\n\t\tonSubmit {\n\t\t\tname\n\t\t\tsysId\n\t\t\tscript\n\t\t\ttype\n\t\t\tfieldName\n\t\t\ttableName\n\t\t}\n\t\tmessages {\n\t\t\tname\n\t\t\tvalue\n\t\t}\n\t}\n\tClientScriptingEnvironment_Policies(table: $table, view: $view, sysId: $sysId, query: $query) {\n\t\tshortDescription\n\t\tsysId\n\t\treverse\n\t\tonLoad\n\t\tisRunScripts\n\t\tpreEvaluated\n\t\tpreEvaluatedResult\n\t\tscriptTrue {\n\t\t\tname\n\t\t\tscript\n\t\t}\n\t\tscriptFalse {\n\t\t\tname\n\t\t\tscript\n\t\t}\n\t\tactions {\n\t\t\tvisible\n\t\t\tname\n\t\t\tdisabled\n\t\t\tmandatory\n\t\t\tcleared: clearValue\n\t\t\trelatedList\n\t\t}\n\t\tconditions {\n\t\t\ttype\n\t\t\tterm\n\t\t\tfield: fieldName\n\t\t\tfieldLabel\n\t\t\tcolumnType\n\t\t\tvalue\n\t\t\toper: operator\n\t\t\toperatorLabel\n\t\t\tor: isOrQuery\n\t\t\tnewquery: isNewQuery\n\t\t\tpreEvaluatedTerm\n\t\t\tpreEvaluatedTermResult\n\t\t\treferenceFields {\n\t\t\t\ttable\n\t\t\t\tfieldName\n\t\t\t\tfieldLabel\n\t\t\t\tinternalType\n\t\t\t\treferenceTable\n\t\t\t}\n\t\t}\n\t},\n\t" + FormTemplate_1.CATALOG_SCRIPTS_FRAGMENT + ",\n\t" + FormTemplate_1.CATALOG_POLICIES_FRAGMENT + "\n}\n";
var transformMessages = function (messages) {
    if (messages === void 0) { messages = []; }
    return messages.reduce(function (loadedMessages, message) {
        var _a;
        return message.name
            ? __assign(__assign({}, loadedMessages), (_a = {}, _a[message.name] = message.value, _a)) : loadedMessages;
    }, {});
};
var createTransform = function (getValueOrDefault) { return function (data) {
    var globals = getValueOrDefault(exports.GLOBALS_QUERY_KEY, {})(data);
    var uiPolicies = uiPolicyParser_1.default.parseGraphQLResponse(getValueOrDefault(exports.UI_POLICIES_QUERY_KEY, [])(data));
    var _a = getValueOrDefault(exports.CLIENT_SCRIPTS_QUERY_KEY, {})(data) || {}, clientScriptMessages = _a.messages, clientScripts = __rest(_a, ["messages"]);
    var _b = getValueOrDefault(FormTemplate_1.SC_SCRIPTS_QUERY_KEY, {})(data) || {}, catalogClientScriptMessages = _b.messages, catalogClientScripts = __rest(_b, ["messages"]);
    var catalogUiPolicies = uiPolicyParser_1.default.parseGraphQLResponse(getValueOrDefault(FormTemplate_1.SC_POLICIES_QUERY_KEY, {})(data));
    var messages = transformMessages(__spreadArray(__spreadArray([], (clientScriptMessages || [])), (catalogClientScriptMessages || [])));
    var finalClientScripts = lodash_1.default.mergeWith(clientScripts, catalogClientScripts, function (objValue, srcValue) {
        if (lodash_1.default.isArray(objValue))
            return objValue.concat(srcValue);
    });
    var finalUiPolicies = uiPolicies.concat(catalogUiPolicies || []);
    return {
        globals: globals,
        uiPolicies: finalUiPolicies,
        clientScripts: finalClientScripts,
        messages: messages
    };
}; };
var createClientScriptEnvironmentDataSource = function (queryPrefix) {
    if (queryPrefix === void 0) { queryPrefix = ''; }
    var baseKey = "" + queryPrefix + exports.SCRIPTING_QUERY_KEY;
    var getValueOrDefault = utils_1.getValue(baseKey);
    var transform = createTransform(getValueOrDefault);
    return utils_1.createDataProviderDataSource({
        query: exports.QUERY_FRAGMENT,
        variables: ['table', 'sysId', 'query'],
        transform: transform,
        props: {
            table: { default: '' },
            sysId: { default: '' },
            query: { default: '' }
        },
        selectableProps: {
            globals: {
                default: {}
            },
            uiPolicies: {
                default: {}
            },
            clientScripts: {
                default: {}
            },
            messages: {
                default: {}
            }
        }
    });
};
exports.createClientScriptEnvironmentDataSource = createClientScriptEnvironmentDataSource;
