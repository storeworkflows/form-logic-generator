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
exports.createUIActionDataSource = exports.QUERY_FRAGMENT = exports.UI_ACTION_NODES = exports.UI_ACTION_MESSAGES = exports.UI_ACTION_FORM_ACTIONS = exports.UI_ACTIONS_KEY = exports.UI_ACTION_QUERY_KEY = exports.CONTEXTUAL_LINK_NAMES = exports.UI_ACTION_TYPES = void 0;
var utils_1 = require("../utils");
// @ts-ignore
var library_translate_1 = require("@servicenow/library-translate");
exports.UI_ACTION_TYPES = {
    BUTTON: "Button",
    MENU: "Menu",
    SPLIT_BUTTON: "Split Button"
};
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
exports.UI_ACTION_QUERY_KEY = "GlideUIAction_Query";
exports.UI_ACTIONS_KEY = "uiActions";
exports.UI_ACTION_FORM_ACTIONS = "formActions";
exports.UI_ACTION_MESSAGES = "messages";
exports.UI_ACTION_NODES = "actionNodes";
exports.QUERY_FRAGMENT = "\n" + exports.UI_ACTION_QUERY_KEY + " {\n    " + exports.UI_ACTIONS_KEY + "(table:$table, sysId:$sysId, query: $query, view: $view, workspaceConfigId: $workspaceConfigId) {\n    \t" + exports.UI_ACTION_MESSAGES + " {\n\t\t\tname\n\t\t\tvalue\n\t\t}\n\t\t" + exports.UI_ACTION_NODES + " {\n\t\t\t... on GlideUIAction_UIAction {\n\t\t\t\tlabel\n\t\t\t\tname\n\t\t\t\tsysId\n\t\t\t\torder\n\t\t\t\thasClientScript\n\t\t\t\tclientScript\n\t\t\t\ttype\n\t\t\t\tstyle\n\t\t\t\thint\n\t\t\t}\n\t\t\t... on GlideUIAction_UIActionGroupLayout {\n\t\t\t\tlabel\n\t\t\t\toverflow\n\t\t\t\ttype\n\t\t\t\tstyle\n\t\t\t\torder\n\t\t\t\tgroupActions {\n\t\t\t\t\tlabel\n\t\t\t\t\tname\n\t\t\t\t\tsysId\n\t\t\t\t\torder\n\t\t\t\t\thasClientScript\n\t\t\t\t\tclientScript\n\t\t\t\t\ttype\n\t\t\t\t\tstyle\n\t\t\t\t\thint\n\t\t\t\t}\n\t\t\t}\n\t\t}\n    }\n}";
var transformMessages = function (messages) {
    if (messages === void 0) { messages = []; }
    return messages.reduce(function (loadedMessages, message) {
        var _a;
        return message.name
            ? __assign(__assign({}, loadedMessages), (_a = {}, _a[message.name] = message.value, _a)) : loadedMessages;
    }, {});
};
var transformAction = function (action) { return ({
    sysId: action.sysId,
    id: action.sysId,
    label: action.label || action.title,
    hint: action.hint
}); };
var transformActions = function (actions) {
    return actions.map(function (action) { return transformAction(action); });
};
var getActionsFromNodes = function (nodes) {
    var existingKeys = [];
    return nodes.reduce(function (arr, node) {
        if (!node.groupActions) {
            if (!(node.sysId in existingKeys)) {
                existingKeys[node.sysId] = null;
                arr.push(node);
            }
        }
        else {
            for (var _i = 0, _a = node.groupActions; _i < _a.length; _i++) {
                var action = _a[_i];
                if (!(action.sysId in existingKeys)) {
                    existingKeys[action.sysId] = null;
                    arr.push(action);
                }
            }
        }
        return arr;
    }, []);
};
var transformActionNodes = function (nodes) {
    var nodeId = 1;
    return nodes.map(function (node) {
        var hasChildren = node.groupActions;
        var hasMultipleChildren = hasChildren && node.groupActions.length > 1;
        return {
            id: nodeId++,
            label: node.type === exports.UI_ACTION_TYPES.MENU ? node.label : "",
            overflow: "overflow" in node ? node.overflow : node.type === "menuItem",
            color: node.style,
            type: hasMultipleChildren ? node.type : "Button",
            children: hasChildren
                ? transformActions(node.groupActions)
                : [transformAction(node)]
        };
    });
};
var createTransform = function (getValueOrDefault) { return function (data, state, properties) {
    var isFormReadonly = state.isFormReadonly, table = state.properties.table;
    var _a = state.record, _b = _a === void 0 ? {} : _a, _c = _b.trueTable, trueTable = _c === void 0 ? table : _c;
    var actionNodeData = getValueOrDefault(exports.UI_ACTION_NODES, [])(data);
    var uiActionNodes = isFormReadonly
        ? []
        : transformActionNodes(actionNodeData);
    var formActions = !uiActionNodes || isFormReadonly ? [] : getActionsFromNodes(actionNodeData);
    var encodedQuery = encodeURIComponent("table=" + trueTable + "^ORtable=global^form_button_v2=true^ORform_menu_button_v2=true^active=true");
    var configurationItem = {
        order: exports.CONTEXTUAL_LINK_NAMES.uiActions.order,
        label: exports.CONTEXTUAL_LINK_NAMES.uiActions.name,
        url: encodeURIComponent("sys_ui_action_list.do?sysparm_query=" + encodedQuery)
    };
    var messages = transformMessages(getValueOrDefault(exports.UI_ACTION_MESSAGES, [])(data));
    return {
        formActions: formActions,
        uiActionNodes: uiActionNodes,
        configurationItem: configurationItem,
        messages: messages
    };
}; };
var createUIActionDataSource = function (queryPrefix) {
    if (queryPrefix === void 0) { queryPrefix = ""; }
    var baseKey = "" + queryPrefix + exports.UI_ACTION_QUERY_KEY + "." + exports.UI_ACTIONS_KEY;
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
            formActions: {
                default: []
            },
            configurationItem: {},
            messages: {
                default: []
            },
            uiActionNodes: {
                default: []
            }
        }
    });
};
exports.createUIActionDataSource = createUIActionDataSource;
exports.default = exports.createUIActionDataSource();
