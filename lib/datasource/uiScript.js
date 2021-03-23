"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUIScriptDataSource = exports.QUERY_FRAGMENT = exports.SCRIPTS_KEY = exports.UI_SCRIPT_KEY = exports.UI_SCRIPT_QUERY_KEY = void 0;
var utils_1 = require("../utils");
exports.UI_SCRIPT_QUERY_KEY = 'GlideUIScript_Query';
exports.UI_SCRIPT_KEY = 'uiScripts';
exports.SCRIPTS_KEY = 'scripts';
exports.QUERY_FRAGMENT = "\n" + exports.UI_SCRIPT_QUERY_KEY + " {\n\t" + exports.UI_SCRIPT_KEY + " {\n\t\tscripts {\n\t\t\tname\n\t\t\tdescription\n\t\t\tscript\n\t\t\tsysId\n\t\t}\n\t}\n}\n";
var createTransform = function (getValueOrDefault) { return function (data) {
    var scripts = getValueOrDefault(exports.SCRIPTS_KEY, [])(data);
    return {
        scripts: scripts
    };
}; };
var createUIScriptDataSource = function (queryPrefix) {
    var _a;
    if (queryPrefix === void 0) { queryPrefix = ''; }
    var baseKey = "" + queryPrefix + exports.UI_SCRIPT_QUERY_KEY + "." + exports.UI_SCRIPT_KEY;
    var getValueOrDefault = utils_1.getValue(baseKey);
    var transform = createTransform(getValueOrDefault);
    return utils_1.createDataProviderDataSource({
        query: exports.QUERY_FRAGMENT,
        variables: [],
        transform: transform,
        selectableProps: (_a = {},
            _a[exports.UI_SCRIPT_KEY] = {
                default: {}
            },
            _a)
    });
};
exports.createUIScriptDataSource = createUIScriptDataSource;
