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
exports.createCurrentUserDataSource = exports.QUERY_FRAGMENT = exports.USER_QUERY_USER_KEY = exports.USER_QUERY_KEY = void 0;
var utils_1 = require("../utils");
var lodash_1 = __importDefault(require("lodash"));
function getProperty(propertyName, defaultValue) {
    return lodash_1.default.get(window, "ux_globals.sysprops[" + propertyName + "]", defaultValue);
}
;
exports.USER_QUERY_KEY = 'GlideDomain_Query';
exports.USER_QUERY_USER_KEY = 'user';
exports.QUERY_FRAGMENT = "\n" + exports.USER_QUERY_KEY + " {\n\tuser {\n\t\tpreferences(name: [\"workspace.layout.type.{{table}}\", \"workspace.layout.form_ratio.{{table}}\", \"workspace.layout.sidebar_ratio.{{table}}\"]) {\n\t\t\tname\n\t\t\tvalue\n\t\t}\n\t\troles\n\t\tallRoles\n\t\tgroups\n\t\tgroupList {\n\t\t\tgroupId\n\t\t\tname\n\t\t}\n\t\tsys_id\n\t\tuserName\n\t\tfirstName\n\t\tlastName\n\t\ttitle\n\t\tavatar\n\t\tdepartmentId\n\t\temail\n\t}\n}\n";
var LAYOUT_CONFIG_KEY = {
    type: 'type',
    formRatio: 'form_ratio',
    sidebarRatio: 'sidebar_ratio'
};
var FORM_LAYOUT_SYS_PROP = 'sn_workspace_form.default_form_layout';
var layoutConfigName = function (key, table) { return "workspace.layout." + key + "." + table; };
var DEFAULT_FORM_LAYOUT_RATIOS = {
    SIDEBAR_RATIO: 27,
    FORM_RATIO: 63
};
var DEFAULT_FORM_LAYOUT_TYPE = 1;
var getDefaultFormLayoutType = function () {
    return getProperty(FORM_LAYOUT_SYS_PROP, DEFAULT_FORM_LAYOUT_TYPE);
};
var getFormLayoutType = function (preference) {
    if (!preference ||
        preference.value === undefined ||
        preference.value === null ||
        preference.value === '')
        return getDefaultFormLayoutType();
    return parseInt(preference.value);
};
var getFormLayoutConfig = function (preferences, properties) {
    if (preferences === void 0) { preferences = []; }
    var table = properties.table;
    return preferences.reduce(function (layoutConfig, preference) {
        switch (preference.name) {
            case layoutConfigName(LAYOUT_CONFIG_KEY.type, table):
                return __assign(__assign({}, layoutConfig), { formLayoutType: getFormLayoutType(preference) });
            case layoutConfigName(LAYOUT_CONFIG_KEY.formRatio, table):
                return __assign(__assign({}, layoutConfig), { formSizeRatio: preference.value ||
                        DEFAULT_FORM_LAYOUT_RATIOS.FORM_RATIO });
            case layoutConfigName(LAYOUT_CONFIG_KEY.sidebarRatio, table):
                return __assign(__assign({}, layoutConfig), { sideBarSizeRatio: preference.value ||
                        DEFAULT_FORM_LAYOUT_RATIOS.SIDEBAR_RATIO });
        }
    }, {
        formLayoutType: getDefaultFormLayoutType(),
        formSizeRatio: DEFAULT_FORM_LAYOUT_RATIOS.FORM_RATIO,
        sideBarSizeRatio: DEFAULT_FORM_LAYOUT_RATIOS.SIDEBAR_RATIO
    });
};
var createTransform = function (getValueOrDefault) { return function (data, state, properties) {
    var user = getValueOrDefault(exports.USER_QUERY_USER_KEY, [])(data);
    var formLayoutConfig = getFormLayoutConfig(user.preferences, properties);
    return {
        user: user,
        formLayoutConfig: formLayoutConfig
    };
}; };
var createCurrentUserDataSource = function (queryPrefix) {
    if (queryPrefix === void 0) { queryPrefix = ''; }
    var baseKey = "" + queryPrefix + exports.USER_QUERY_KEY;
    var getValueOrDefault = utils_1.getValue(baseKey);
    var transform = createTransform(getValueOrDefault);
    return utils_1.createDataProviderDataSource({
        query: exports.QUERY_FRAGMENT,
        variables: [],
        templateVariables: ['table'],
        transform: transform,
        selectableProps: {
            user: {
                default: {}
            }
        }
    });
};
exports.createCurrentUserDataSource = createCurrentUserDataSource;
