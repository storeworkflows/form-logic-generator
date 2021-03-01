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
exports.createHeaderDataSource = exports.ITEM_TYPES = exports.CONTEXTUAL_LINK_NAMES = void 0;
var lodash_1 = __importDefault(require("lodash"));
// @ts-ignore
var library_translate_1 = require("@servicenow/library-translate");
var utils_1 = require("../utils");
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
exports.ITEM_TYPES = {
    SIMPLE: "simple",
    REFERENCE: "reference",
    HIGHLIGHTED: "highlighted"
};
var HEADER_CONFIG_KEY = "headerConfig";
var HEADER_ITEMS = "headerItems";
var HEADER_SYS_ID = "headerSysId";
var HEADER_PRIMARY_ITEM = "primaryItem";
var HEADER_SECONDARY_ITEMS = "secondaryItems";
var HEADER_HIGHLIGHTED_VALUE_STYLE = "highlightedValueStyle";
var HEADER_REFERENCE_ITEM = "referenceItem";
var HEADER_RECORD_DISPLAY_VALUE = "recordDisplayValue";
var HEADER_TABLE_DISPLAY_VALUE = "tableDisplayValue";
var HEADER_SUBHEADING_ITEM = "subheadingItem";
var HEADER_IMAGE_ITEM = "headerImageItem";
var HEADER_HIDE_TAGS_ITEM = "hideTags";
var QUERY_FRAGMENT = "\n" + HEADER_CONFIG_KEY + ":GlideHeaderQuery_Query {\n\t" + HEADER_ITEMS + "(table: $table, sysId: $sysId, workspaceConfigId: $workspaceConfigId) {\n\t\t" + HEADER_SYS_ID + "\n\t\t" + HEADER_RECORD_DISPLAY_VALUE + "\n\t\t" + HEADER_TABLE_DISPLAY_VALUE + "\n\t\t" + HEADER_HIDE_TAGS_ITEM + "\n\t\t" + HEADER_PRIMARY_ITEM + " {\n\t\t\tfieldName\n\t\t\tfieldLabel\n\t\t\tdisplayValue\n\t\t}\n\t\t" + HEADER_SUBHEADING_ITEM + " {\n\t\t\tfieldName\n\t\t\tfieldLabel\n\t\t\tdisplayValue\n\t\t}\n\t\t" + HEADER_IMAGE_ITEM + " {\n\t\t\tfieldName\n\t\t\tfieldLabel\n\t\t\theaderImage\n\t\t}\n\t\t" + HEADER_SECONDARY_ITEMS + " {\n\t\t\tfieldName\n\t\t\tfieldLabel\n\t\t\tdisplayValue\n\t\t\t" + HEADER_HIGHLIGHTED_VALUE_STYLE + " {\n\t\t\t\tfield\n\t\t\t\tvalue\n\t\t\t\tstatus\n\t\t\t\tshowIcon\n\t\t\t}\n\t\t\t" + HEADER_REFERENCE_ITEM + " {\n\t\t\t\ttable\n\t\t\t\tsysId\n\t\t\t}\n\t\t}\n\t}\n}\n";
var transformHighlightedItem = function (item) {
    var highlightedValueStyle = item.highlightedValueStyle, type = item.type;
    if (!highlightedValueStyle || type)
        return item;
    var status = highlightedValueStyle.status, displayValue = highlightedValueStyle.value, showIcon = highlightedValueStyle.showIcon;
    return __assign(__assign({}, lodash_1.default.omit(item, "highlightedValueStyle")), { status: status,
        displayValue: displayValue,
        showIcon: showIcon, type: exports.ITEM_TYPES.HIGHLIGHTED });
};
var transformReferenceItem = function (item) {
    var referenceItem = item.referenceItem, type = item.type;
    if (!referenceItem || type)
        return item;
    var table = referenceItem.table, sysId = referenceItem.sysId;
    return __assign(__assign({}, lodash_1.default.omit(item, "referenceItem")), { table: table,
        sysId: sysId, type: exports.ITEM_TYPES.REFERENCE });
};
var transformSimpleItem = function (item) {
    if (item.type)
        return item;
    return __assign(__assign({}, item), { type: exports.ITEM_TYPES.SIMPLE });
};
var transformSecondaryItems = function (secondaryItems) {
    return secondaryItems.map(function (item) {
        return transformSimpleItem(transformReferenceItem(transformHighlightedItem(item)));
    });
};
var createTransform = function (getValueOrDefault) { return function (data, state, properties) {
    var sysId = properties.sysId;
    var headerSysId = getValueOrDefault(HEADER_SYS_ID, "")(data);
    var tableDisplayValue = getValueOrDefault(HEADER_TABLE_DISPLAY_VALUE, "")(data);
    var recordDisplayValue = getValueOrDefault(HEADER_RECORD_DISPLAY_VALUE, "")(data);
    var primaryItem = getValueOrDefault(HEADER_PRIMARY_ITEM)(data);
    var primaryValue = sysId === "-1"
        ? library_translate_1.t("Create New {0}", tableDisplayValue)
        : lodash_1.default.get(primaryItem, "displayValue", recordDisplayValue);
    var secondaryItems = transformSecondaryItems(getValueOrDefault(HEADER_SECONDARY_ITEMS, [])(data));
    var configurationItem = {
        order: exports.CONTEXTUAL_LINK_NAMES.header.order,
        label: exports.CONTEXTUAL_LINK_NAMES.header.name,
        url: encodeURIComponent("sys_aw_form_header.do?sys_id=" + headerSysId)
    };
    var hideTagsValue = getValueOrDefault(HEADER_HIDE_TAGS_ITEM)(data);
    var subHeadingValue = getValueOrDefault(HEADER_SUBHEADING_ITEM)(data);
    var headerImageItem = getValueOrDefault(HEADER_IMAGE_ITEM)(data);
    return {
        recordDisplayValue: recordDisplayValue,
        primaryItem: primaryItem,
        primaryValue: primaryValue,
        secondaryItems: secondaryItems,
        tableDisplayValue: tableDisplayValue,
        configurationItem: configurationItem,
        hideTagsValue: hideTagsValue,
        headerImageItem: headerImageItem,
        subHeadingValue: subHeadingValue
    };
}; };
var createHeaderDataSource = function (queryPrefix) {
    if (queryPrefix === void 0) { queryPrefix = ""; }
    var baseKey = "" + queryPrefix + HEADER_CONFIG_KEY + "." + HEADER_ITEMS;
    var getValueOrDefault = utils_1.getValue(baseKey);
    var transform = createTransform(getValueOrDefault);
    return utils_1.createDataProviderDataSource({
        query: QUERY_FRAGMENT,
        variables: ["table", "sysId", "workspaceConfigId"],
        transform: transform,
        props: {
            table: { default: "" },
            sysId: { default: "" },
            workspaceConfigId: { default: "" }
        },
        selectableProps: {
            primaryValue: {
                default: ""
            },
            secondaryItems: {
                default: []
            },
            tableDisplayValue: { default: "" },
            recordDisplayValue: { default: "" },
            configurationItem: {}
        }
    });
};
exports.createHeaderDataSource = createHeaderDataSource;
