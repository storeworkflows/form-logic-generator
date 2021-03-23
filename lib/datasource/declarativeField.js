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
exports.createDeclarativeFieldActionDataSource = exports.QUERY_FRAGMENT = exports.FIELD_ACTIONS_KEY = exports.FIELD_DECLARATIVE_ACTIONS_KEY = exports.DECLARATIVE_ACTIONS_FIELD_QUERY_KEY = exports.DECLARATIVE_ACTIONS_QUERY_KEY = void 0;
var utils_1 = require("../utils");
exports.DECLARATIVE_ACTIONS_QUERY_KEY = 'GlideDeclarativeActions_Query';
exports.DECLARATIVE_ACTIONS_FIELD_QUERY_KEY = 'GlideDeclarativeActions_fieldQuery';
exports.FIELD_DECLARATIVE_ACTIONS_KEY = 'fieldDeclarativeActions';
exports.FIELD_ACTIONS_KEY = 'fieldActions';
exports.QUERY_FRAGMENT = "\n" + exports.DECLARATIVE_ACTIONS_QUERY_KEY + " {\n\t" + exports.DECLARATIVE_ACTIONS_FIELD_QUERY_KEY + " {\n\t\t" + exports.FIELD_DECLARATIVE_ACTIONS_KEY + " (table: $table, view: $view, sysId: $sysId, query: $query, source: \"field\", workspaceConfigId: $workspaceConfigId) {\n\t\t\t" + exports.FIELD_ACTIONS_KEY + " {\n\t\t\t\tfield\n\t\t\t\tactions  {\n\t\t\t\t\tname\n\t\t\t\t\ticon\n\t\t\t\t\tlabel\n\t\t\t\t\tdependency\n\t\t\t\t\trequiresValue\n\t\t\t\t\torder\n\t\t\t\t\tconditions\n\t\t\t\t\tactionType\n            \t\tactionComponent\n            \t\tactionDispatch\n            \t\tactionPayload\n\t\t\t\t\tactionAttributes\n\t\t\t\t\tgroupBy\n\t\t\t\t\tgroup\n\t\t\t\t\tassignmentId\n\t\t\t\t\tconfirmationRequired\n\t\t\t\t\tconfirmationMessage\n\t\t\t\t\ttooltip\n\t\t\t\t\tmodelConditions {\n\t\t\t\t\t\tfield\n\t\t\t\t\t\toperator\n\t\t\t\t\t\tvalue\n\t\t\t\t\t\tnewQuery\n\t\t\t\t\t\tor\n\t\t\t\t\t}\n\t\t\t\t\tpayloadMap {\n\t\t\t\t\t\tname\n\t\t\t\t\t\tvalue\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n}";
var createTransform = function (getValueOrDefault) { return function (data) {
    var items = getValueOrDefault(exports.FIELD_ACTIONS_KEY, [])(data);
    var declarativeFieldActions = items
        ? items.reduce(function (mapper, _a) {
            var _b;
            var field = _a.field, actions = _a.actions;
            return (__assign(__assign({}, mapper), (_b = {}, _b[field] = actions, _b)));
        }, {})
        : [];
    return {
        declarativeFieldActions: declarativeFieldActions
    };
}; };
var createDeclarativeFieldActionDataSource = function (queryPrefix) {
    if (queryPrefix === void 0) { queryPrefix = ''; }
    var baseKey = "" + queryPrefix + exports.DECLARATIVE_ACTIONS_QUERY_KEY + "." + exports.DECLARATIVE_ACTIONS_FIELD_QUERY_KEY + "." + exports.FIELD_DECLARATIVE_ACTIONS_KEY;
    var getValueOrDefault = utils_1.getValue(baseKey);
    var transform = createTransform(getValueOrDefault);
    return utils_1.createDataProviderDataSource({
        query: exports.QUERY_FRAGMENT,
        variables: ['table', 'view', 'sysId', 'query', 'workspaceConfigId'],
        transform: transform,
        props: {
            table: { default: '' },
            sysId: { default: '' },
            view: { default: '' },
            query: { default: '' },
            workspaceConfigId: { default: '' }
        },
        selectableProps: {
            declarativeFieldActions: {
                default: {}
            }
        }
    });
};
exports.createDeclarativeFieldActionDataSource = createDeclarativeFieldActionDataSource;
