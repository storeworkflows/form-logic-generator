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
exports.createDeclarativeFormActionDataSource = exports.QUERY_FRAGMENT = exports.FORM_ACTIONS_KEY = exports.FORM_DECLARATIVE_ACTIONS_KEY = exports.DECLARATIVE_ACTIONS_FORM_QUERY_KEY = exports.DECLARATIVE_ACTIONS_QUERY_KEY = exports.CONTEXTUAL_LINK_NAMES = void 0;
var utils_1 = require("../utils");
var lodash_1 = __importDefault(require("lodash"));
// @ts-ignore
var library_translate_1 = require("@servicenow/library-translate");
exports.CONTEXTUAL_LINK_NAMES = {
    header: {
        name: library_translate_1.t("Form Header"),
        order: 1
    },
    uiActions: {
        name: library_translate_1.t("UI Actions"),
        order: 2
    },
    ribbon: {
        name: library_translate_1.t("Ribbon"),
        order: 3
    },
    formLayout: {
        name: library_translate_1.t("Form Layout"),
        order: 4
    },
    relatedItems: {
        name: library_translate_1.t("Related Items"),
        order: 5
    },
    relatedLists: {
        name: library_translate_1.t("Related Lists"),
        order: 6
    },
    contextualSidePanel: {
        name: library_translate_1.t("Contextual Side Panel"),
        order: 7
    }
};
exports.DECLARATIVE_ACTIONS_QUERY_KEY = "GlideDeclarativeActions_Query";
exports.DECLARATIVE_ACTIONS_FORM_QUERY_KEY = "GlideDeclarativeActions_formQuery";
exports.FORM_DECLARATIVE_ACTIONS_KEY = "formDeclarativeActions";
exports.FORM_ACTIONS_KEY = "formActions";
exports.QUERY_FRAGMENT = "\n" + exports.DECLARATIVE_ACTIONS_QUERY_KEY + " {\n\t" + exports.DECLARATIVE_ACTIONS_FORM_QUERY_KEY + " {\n\t\t" + exports.FORM_DECLARATIVE_ACTIONS_KEY + " (table: $table, view: $view, sysId: $sysId, query: $query, source: \"form\", workspaceConfigId: $workspaceConfigId) {\n\t\t\t" + exports.FORM_ACTIONS_KEY + " {\n\t\t\t\tposition\n                actions {\n                    name\n                    icon\n                    label\n                    tooltip\n                    actionComponent\n                    actionAttributes\n                    order\n\t\t\t\t\tassignmentId\n\t\t\t\t\tmodelConditions {\n\t\t\t\t\t\tfield\n\t\t\t\t\t\toperator\n\t\t\t\t\t\tvalue\n\t\t\t\t\t\tnewQuery\n\t\t\t\t\t\tor\n\t\t\t\t\t}\n\t\t\t\t\tpayloadMap {\n\t\t\t\t\t\tname\n\t\t\t\t\t\tvalue\n\t\t\t\t\t  }\n                }\n            }\n\t\t}\n\t}\n}";
var DA_FORM_MODEL_SYSID = "360935e9534723003eddddeeff7b127d";
var FORM_ACTION_POSITION = {
    sideBar: "contexual_sidebar",
    relatedItem: "related_item"
};
var formActionsForPosition = function (formActions, position) {
    return !formActions
        ? []
        : (formActions.find(function (formAction) { return formAction.position === position; }) || {})
            .actions || [];
};
var createTransform = function (getValueOrDefault) { return function (data, state, properties) {
    var wsConfigSysId = lodash_1.default.get(state, "behaviors.wsConfigSysId", "");
    var _a = properties.workspaceConfigId, workspaceConfigId = _a === void 0 ? wsConfigSysId : _a;
    var table = state.properties.table;
    var _b = state.record || state.properties, _c = _b.trueTable, trueTable = _c === void 0 ? table : _c, view = _b.view;
    var sideBar = FORM_ACTION_POSITION.sideBar, relatedItem = FORM_ACTION_POSITION.relatedItem;
    var formActions = getValueOrDefault(exports.FORM_ACTIONS_KEY, [])(data);
    var relatedItems = formActionsForPosition(formActions, relatedItem).map(function (action) { return (__assign(__assign({}, action), { name: action.name || action.actionComponent })); });
    var sidebarActions = formActionsForPosition(formActions, sideBar).map(function (action) { return (__assign(__assign({}, action), { name: action.name || action.actionComponent })); });
    var configUrl = "sys_declarative_action_assignment_list.do%3Fsysparm_query%3Dtable%3D" + trueTable + "%5EORtable%3Dglobal\n\t\t\t\t\t\t\t%5Eview.name%3D" + view + "%5EORview.nameISEMPTY\n\t\t\t\t\t\t\t%5Eworkspace%3D" + workspaceConfigId + "%5EORworkspaceISEMPTY\n\t\t\t\t\t\t\t%26sysparm_view%3Dform_action%26sysparm_fixed_query%3Dmodel%3D" + DA_FORM_MODEL_SYSID + "%5Eform_position%3D";
    var configurationItems = [
        {
            order: exports.CONTEXTUAL_LINK_NAMES.contextualSidePanel.order,
            label: exports.CONTEXTUAL_LINK_NAMES.contextualSidePanel.name,
            url: "" + configUrl + FORM_ACTION_POSITION.sideBar
        },
        {
            order: exports.CONTEXTUAL_LINK_NAMES.relatedItems.order,
            label: exports.CONTEXTUAL_LINK_NAMES.relatedItems.name,
            url: "" + configUrl + FORM_ACTION_POSITION.relatedItem
        }
    ];
    return {
        relatedItems: relatedItems,
        sidebarActions: sidebarActions,
        configurationItems: configurationItems
    };
}; };
var createDeclarativeFormActionDataSource = function (queryPrefix) {
    if (queryPrefix === void 0) { queryPrefix = ""; }
    var baseKey = "" + queryPrefix + exports.DECLARATIVE_ACTIONS_QUERY_KEY + "." + exports.DECLARATIVE_ACTIONS_FORM_QUERY_KEY + "." + exports.FORM_DECLARATIVE_ACTIONS_KEY;
    var getValueOrDefault = utils_1.getValue(baseKey);
    var transform = createTransform(getValueOrDefault);
    return utils_1.createDataProviderDataSource({
        query: exports.QUERY_FRAGMENT,
        variables: ["table", "view", "sysId", "query", "workspaceConfigId"],
        transform: transform,
        props: {
            table: { default: "" },
            view: { default: "" },
            sysId: { default: "" },
            query: { default: "" },
            workspaceConfigId: { default: "" }
        },
        selectableProps: {
            relatedItems: {
                default: []
            },
            sidebarActions: {
                default: []
            },
            configurationItems: {}
        }
    });
};
exports.createDeclarativeFormActionDataSource = createDeclarativeFormActionDataSource;
