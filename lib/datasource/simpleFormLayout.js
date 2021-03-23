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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSimpleFormLayoutDataSource = void 0;
var utils_1 = require("../utils");
var glideFormDataParser = __importStar(require("../utils/glideFormParser"));
var lodash_1 = __importDefault(require("lodash"));
var QUERY_FRAGMENT = "\nGlideLayout_Query {\n\tformLayout(table: $table, view: $view) {\n\t\tsectionLayout {\n\t\t\tsysId\n\t\t\tcaption\n\t\t\tcaptionDisplay\n\t\t\trows {\n\t\t\t\tfields\n\t\t\t}\n\t\t}\n\n\t\telementsData {\n\t\t\tname: elementName\n\t\t\tdictionary: dictionaryData {\n\t\t\t\ttype: dictionaryType\n\t\t\t\tdependentField\n\t\t\t\tdependentTable\n\t\t\t\tname\n\t\t\t\tlabel\n\t\t\t\tcanWrite\n\t\t\t\tcanRead\n\t\t\t\tcanCreate\n\t\t\t\tinternalType\n\t\t\t\tisMandatory\n\t\t\t\tsys_readonly: sysReadonly\n\t\t\t\tattributes {\n\t\t\t\t\tname\n\t\t\t\t\tvalue\n\t\t\t\t}\n\t\t\t}\n\t\t\t... on GlideLayout_ChoiceElementType {\n\t\t\t\tchoices {\n\t\t\t\t\tdisplayValue\n\t\t\t\t\tvalue\n\t\t\t\t}\n\t\t\t}\n\t\t\t... on GlideLayout_ReferenceElementType {\n\t\t\t\treference\n\t\t\t\treferenceQualifier\n\t\t\t\treferenceKey\n\t\t\t\tuseReferenceQualifier\n\t\t\t\tdependent\n\t\t\t\tdependentOnField\n\t\t\t\trefAutoCompleter\n\t\t\t\trefAcOrderBy\n\t\t\t\trefAcColumns\n\t\t\t\trefAcColumnsSearch\n\t\t\t\trefAcDisplayValue\n\t\t\t\trefQualElements\n\t\t\t\trefContributions\n\t\t\t\tisDynamicCreate\n\t\t\t\tisReferenceScriptableTable\n\t\t\t\treferenceError\n\t\t\t}\n\t\t\t... on GlideLayout_ValueElementType {\n\t\t\t\tmaxLength\n\t\t\t\tdefaultRows\n\t\t\t}\n\n\t\t\t... on GlideLayout_TableNameElementType {\n\t\t\t\tdisplayValue\n\t\t\t}\n\t\t}\n\t}\n}\n";
var LAYOUT_QUERY_KEY = 'GlideLayout_Query';
var FORM_LAYOUT_QUERY_KEY = 'formLayout';
var RECORD_VALUES_KEY = 'recordValues';
var FIELD_ELEMENTS_KEY = 'elementsData';
var SECTION_LAYOUT = 'sectionLayout';
var transformFormFieldValues = function (table, recordValues, fieldElements, isFormReadonly, declarativeUIActions) {
    var formFieldValues = lodash_1.default.reduce(glideFormDataParser.parseFieldGraphQLResponse(table, '-1', recordValues, fieldElements), function (fields, field, key) {
        var _a;
        return (__assign(__assign({}, fields), (_a = {}, _a[key] = __assign(__assign({}, field), { declarativeUiActions: declarativeUIActions[key] }), _a)));
    }, {});
    if (!isFormReadonly)
        return formFieldValues;
    return lodash_1.default.reduce(formFieldValues, function (fields, field, key) {
        var _a;
        return (__assign(__assign({}, fields), (_a = {}, _a[key] = __assign(__assign({}, field), { sys_readonly: true, readonly: true }), _a)));
    }, {});
};
var transformSections = function (sections) {
    return sections.map(function (section, index) { return (__assign(__assign({}, section), { id: index, caption: (section.caption || section.captionDisplay || '')
            .toLowerCase()
            .replace(' ', '_')
            .replace(/[^0-9a-z_]/gi, ''), label: section.captionDisplay, expanded: true })); });
};
var createTransform = function (getValueOrDefault) { return function (data, state, properties, declarativeUIActions) {
    if (declarativeUIActions === void 0) { declarativeUIActions = {}; }
    var isFormReadonly = state.isFormReadonly;
    var table = properties.table;
    var recordValues = getValueOrDefault(RECORD_VALUES_KEY, [])(data);
    var fieldElements = getValueOrDefault(FIELD_ELEMENTS_KEY, [])(data).filter(function (el) { return lodash_1.default.get(el, 'dictionary.canRead') !== false; });
    var sections = transformSections(getValueOrDefault(SECTION_LAYOUT, [])(data));
    console.log("dataProvider", { sections: sections });
    var formFieldValues = transformFormFieldValues(table, recordValues, fieldElements, isFormReadonly, declarativeUIActions);
    return {
        recordValues: recordValues,
        fieldElements: fieldElements,
        sections: sections,
        formFieldValues: formFieldValues
    };
}; };
var createSimpleFormLayoutDataSource = function (queryPrefix) {
    if (queryPrefix === void 0) { queryPrefix = ''; }
    var baseKey = "" + queryPrefix + LAYOUT_QUERY_KEY + "." + FORM_LAYOUT_QUERY_KEY;
    var getValueOrDefault = utils_1.getValue(baseKey);
    var transform = createTransform(getValueOrDefault);
    return utils_1.createDataProviderDataSource({
        query: QUERY_FRAGMENT,
        variables: ['table', 'view'],
        transform: transform,
        props: {
            table: { default: '' },
            view: { default: '' }
        },
        selectableProps: {
            recordValues: {},
            fieldElements: {},
            sections: {},
            formFieldValues: {}
        }
    });
};
exports.createSimpleFormLayoutDataSource = createSimpleFormLayoutDataSource;
