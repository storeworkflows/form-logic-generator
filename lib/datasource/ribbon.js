"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRibbonDataSource = exports.QUERY_FRAGMENT = exports.RIBBON_CONFIG_KEY = exports.RIBBON_QUERY_KEY = void 0;
var utils_1 = require("../utils");
var header_1 = require("./header");
exports.RIBBON_QUERY_KEY = 'AppRibbonConfig_Query';
exports.RIBBON_CONFIG_KEY = 'ribbonConfig';
exports.QUERY_FRAGMENT = "\n" + exports.RIBBON_QUERY_KEY + " {\n\t" + exports.RIBBON_CONFIG_KEY + ":getRibbonConfig(sourceTable: $table, workspaceConfigId: $workspaceConfigId) {\n      _results {\n          table {\n            value\n            displayValue\n          }\n          name {\n            value\n            displayValue\n          }\n          attrs {\n            variables {\n              variableName\n              variableValue\n            }\n          }\n          component {\n            value\n            displayValue\n          }\n          tag {\n            value\n            displayValue\n          }\n          width {\n            value\n            displayValue\n          }\n          order {\n            value\n            displayValue\n          }\n        }\n\t}\n}\n";
var createTransform = function (getValueOrDefault) { return function (data, state, properties) {
    var orgSysId = properties.sysId;
    var trueTable = state.record.trueTable;
    var ribbonWidgets = getValueOrDefault('_results', [])(data);
    var hasRibbonWidgets = orgSysId !== '-1' && ribbonWidgets.length > 0;
    var encodedQuery = encodeURIComponent("table=" + trueTable + "^ORDERBYorder");
    var configurationItem = {
        order: header_1.CONTEXTUAL_LINK_NAMES.ribbon.order,
        label: header_1.CONTEXTUAL_LINK_NAMES.ribbon.name,
        url: encodeURIComponent("sys_aw_ribbon_setting_list.do?sysparm_query=" + encodedQuery)
    };
    return {
        widgets: ribbonWidgets,
        isVisible: hasRibbonWidgets,
        configurationItem: configurationItem,
        hasRibbonWidgets: hasRibbonWidgets
    };
}; };
var createRibbonDataSource = function (queryPrefix) {
    if (queryPrefix === void 0) { queryPrefix = ''; }
    var baseKey = "" + queryPrefix + exports.RIBBON_QUERY_KEY + "." + exports.RIBBON_CONFIG_KEY;
    var getValueOrDefault = utils_1.getValue(baseKey);
    var transform = createTransform(getValueOrDefault);
    return utils_1.createDataProviderDataSource({
        query: exports.QUERY_FRAGMENT,
        variables: ['table', 'workspaceConfigId'],
        templateVariables: [],
        transform: transform,
        props: {
            table: { default: '' }
        },
        selectableProps: {
            widgets: {
                default: []
            },
            isVisible: {
                default: false
            },
            hasRibbonWidgets: {},
            configurationItem: {}
        }
    });
};
exports.createRibbonDataSource = createRibbonDataSource;
