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
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFormLayoutDataSource = exports.CONTEXTUAL_LINK_NAMES = exports.CATALOG_DATA_LOOKUP_QUERY_FRAGMENT = exports.CATALOG_DATALOOKUP_FIELDS_KEY = exports.GlideElementVariables_ELEMENTS_QUERY_FRAGMENT = exports.CATALOG_POLICIES_FRAGMENT = exports.CATALOG_SCRIPTS_FRAGMENT = exports.VARIABLE_LAYOUT_QUERY_FRAGMENT = exports.SC_POLICIES_QUERY_KEY = exports.SC_SCRIPTS_QUERY_KEY = void 0;
var utils_1 = require("../utils");
var glideFormDataParser = __importStar(require("../utils/glideFormParser"));
var lodash_1 = __importDefault(require("lodash"));
//@ts-ignore
var library_translate_1 = require("@servicenow/library-translate");
exports.SC_SCRIPTS_QUERY_KEY = 'CatalogClientScriptingEnvironment_Scripts';
exports.SC_POLICIES_QUERY_KEY = 'CatalogClientScriptingEnvironment_Policies';
exports.VARIABLE_LAYOUT_QUERY_FRAGMENT = "\nvariablesLayout {\n\tname\n\ttype\n\tparent\n \t... on GlideLayout_ContainerVariableFieldLayoutType {\n\t\tcaption\n\t\tcaptionDisplay\n\t\tlayout\n\t\tcolumns {\n\t\t\tfields {\n\t\t\t\tname\n\t\t\t\ttype\n\t\t\t}\n\t\t}\n\t}\n}\n";
exports.CATALOG_SCRIPTS_FRAGMENT = "\n" + exports.SC_SCRIPTS_QUERY_KEY + " (table: $table, sysId: $sysId, query: $query){\n\t\tonLoad {\n\t\t\tname\n\t\t\tsysId\n\t\t\tscript\n\t\t\ttype\n\t\t\tfieldName\n\t\t\ttableName\n\t\t}\n\t\tonChange {\n\t\t\tname\n\t\t\tsysId\n\t\t\tscript\n\t\t\ttype\n\t\t\tfieldName\n\t\t\ttableName\n\t\t}\n\t\tonSubmit {\n\t\t\tname\n\t\t\tsysId\n\t\t\tscript\n\t\t\ttype\n\t\t\tfieldName\n\t\t\ttableName\n\t\t}\n\t\tmessages {\n\t\t\tname\n\t\t\tvalue\n\t\t}\n\t}\n\n";
exports.CATALOG_POLICIES_FRAGMENT = "\n" + exports.SC_POLICIES_QUERY_KEY + " (table: $table, sysId: $sysId, query: $query){\n\t\tshortDescription\n\t\tsysId\n\t\tscriptTrue {\n\t\t\tname\n\t\t\tscript\n\t\t}\n\t\tscriptFalse {\n\t\t\tname\n\t\t\tscript\n\t\t}\n\t\treverse\n\t\tonLoad\n\t\tisRunScripts\n\t\tpreEvaluated\n\t\tpreEvaluatedResult\n\t\tactions {\n\t\t\tvisible\n\t\t\tname\n\t\t\tdisabled\n\t\t\tmandatory\n\t\t\tcleared: clearValue\n\t\t\trelatedList\n\t\t}\n\t\tconditions {\n\t\t\tterm\n\t\t\tfield: fieldName\n\t\t\tfieldLabel\n\t\t\ttype\n\t\t\tcolumnType\n\t\t\tvalue\n\t\t\toper: operator\n\t\t\toperatorLabel\n\t\t\tcatalogVariable\n\t\t\tcatalogOperator\n\t\t\tcatalogVariableType\n\t\t\tcatalogVariableTable\n\t\t\tor: isOrQuery\n\t\t\tnewquery: isNewQuery\n\t\t\tpreEvaluatedTerm\n\t\t\tpreEvaluatedTermResult\n\t\t\treferenceFields {\n\t\t\t\ttable\n\t\t\t\tfieldName\n\t\t\t\tfieldLabel\n\t\t\t\tinternalType\n\t\t\t\treferenceTable\n\t\t\t}\n\t\t}\n\n\t}\n";
exports.GlideElementVariables_ELEMENTS_QUERY_FRAGMENT = "\n_elements {\n    ... on GlideLayout_MultiRowVariableSetType {\n      type\n      name\n      variableName\n      label\n      containerType\n      canRead\n      canWrite\n      canCreate\n      id\n      maxRows\n      fields {\n        name\n        id\n        label\n        type\n      }\n      rowData {\n        row {\n          id\n          name\n          value\n          displayValue\n        }\n      }\n    }\n    ... on GlideLayout_SingleRowVariableSetType {\n      type\n      id\n      name\n      label\n      containerType\n      canRead\n      canWrite\n      canCreate\n      variableName\n    }\n    ... on GlideLayout_ChoiceQuestionElementType {\n      type\n      id\n      name\n      variableName\n      label\n      order\n      catalogItem\n      variableSet\n      mandatory\n      canRead\n      canWrite\n      canCreate\n      variableAttributes\n      defaultValue\n      lookupTable\n      lookupValue\n      lookupLabel\n      includeNone\n      lookupUnique\n      choiceTable\n      choiceField\n      choiceDirection\n      choices {\n        displayValue: label\n        value\n      }\n      dependentField\n      referringTable\n      referringRecordId\n    }\n    ... on GlideLayout_ReferenceQuestionElementType {\n      type\n      id\n      name\n      variableName\n      label\n      order\n      catalogItem\n      variableSet\n      mandatory\n      canRead\n      canWrite\n      canCreate\n      reference\n      referenceQual\n      listTable\n      useReferenceQualifier\n      variableAttributes\n      defaultValue\n      referringTable\n      referringRecordId\n    }\n    ... on GlideLayout_ContainerQuestionElementType {\n      type\n      id\n      name\n      variableName\n      label\n      order\n      catalogItem\n      variableSet\n      displayTitle\n      layout\n      containerType\n      canRead\n      canWrite\n      canCreate\n      mandatory\n    }\n    ... on GlideLayout_StandardQuestionElementType {\n      type\n      id\n      name\n      variableName\n      label\n      order\n      catalogItem\n      variableSet\n      mandatory\n      canRead\n      canWrite\n      canCreate\n      variableAttributes\n      defaultValue\n      exampleText\n      useConfirmation\n      regExp\n      canDecrypt\n    }\n    ... on GlideLayout_AttachmentQuestionElementType {\n      type\n      id\n      name\n      variableName\n      label\n      order\n      catalogItem\n      variableSet\n      mandatory\n      canRead\n      canWrite\n      canCreate\n      variableAttributes\n      defaultValue\n      contentType\n    }\n  }\n";
exports.CATALOG_DATALOOKUP_FIELDS_KEY = 'catalogDataLookup';
exports.CATALOG_DATA_LOOKUP_QUERY_FRAGMENT = "\n" + exports.CATALOG_DATALOOKUP_FIELDS_KEY + "(targetTable: $table, targetId: $sysId) {\n  fields {\n    field\n        definitions {\n            name\n            sysId\n        }\n  }\n}\n";
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
var LAYOUT_QUERY_KEY = 'GlideLayout_Query';
var FORM_LAYOUT_QUERY_KEY = 'formLayout';
var RECORD_VALUES_KEY = 'recordValues';
var FIELD_ELEMENTS_KEY = 'elementsData';
var FORMATTER_QUERY_KEY = 'formatters';
var RELATED_LISTS_QUERY_KEY = 'relatedLists';
var SECTION_LAYOUT = 'sectionLayout';
var FIELD_STATES_QUERY_KEY = 'fieldStates';
var ENCODED_RECORD_KEY = 'encodedRecord';
var IS_VALID_RECORD = 'isValidRecord';
var CAN_READ_RECORD = 'canReadRecord';
var SYS_ID_KEY = 'sysId';
var BASE_TABLE = 'baseTable';
var TABLE = 'table';
var IS_SCRIPTABLE_TABLE = 'isScriptableTable';
var LAST_ERROR_MESSAGE = 'lastErrorMessage';
var FIELD_VARIABLES_KEY = 'variables';
var VARIABLES_LAYOUT = 'variablesLayout';
var FORM_SETTINGS_KEY = 'formSettings';
var FORM_TABS_KEY = 'formTabs';
var ANNOTATIONS_QUERY_KEY = 'annotations';
var DOMAIN_SEPARATION = 'domainSeparation';
var QUERY_FRAGMENT = "\nGlideLayout_Query {\n\tformLayout(table: $table, view: $view, sysId: $sysId, query: $query) {\n\t\tbaseTable\n\t\ttable\n\t\tisValidRecord\n\t\tcanReadRecord\n\t\tisScriptableTable\n\t\tlastErrorMessage\n\t\tdomainSeparation {\n\t\t\tcanExpandScope\n\t\t\tdeterminingFieldName\n\t\t\tdomainId\n\t\t}\n\t\tsectionLayout {\n\t\t\tsysId\n\t\t\tcaption\n\t\t\tcaptionDisplay\n\t\t\trows {\n\t\t\t\tfields\n\t\t\t}\n\t\t}\n\t\tformSettings {\n\t\t\tisDetailsHidden\n\t\t\tisSectionMenuHidden\n\t\t\tisSectionCollapseDisabled\n\t\t\tdefaultSection {\n\t\t\t\tsysId\n\t\t\t\tcaption\n\t\t\t\tcaptionDisplay\n\t\t\t}\n\t\t}\n\t\tformTabs {\n\t\t\tisDefaultTabOrder\n\t\t\tdefaultTabFocus\n\t\t\ttabsOrder {\n\t\t\t  label\n\t\t\t  value\n\t\t\t}\n\t\t}\n\t\tencodedRecord\n\t\tsysId\n\t\trecordValues {\n\t\t\tname\n\t\t\tvalue\n\t\t\tdisplayValue\n\t\t\tvaluesList {\n\t\t\t\tvalue\n\t\t\t\tdisplayValue\n\t\t\t}\n\t\t}\n\t\tfieldStates {\n\t\t\tname\n\t\t\thidden\n\t\t\tmandatory\n\t\t\treadonly\n\t\t},\n\t\trelatedLists {\n\t\t\tsourceTable\n\t\t\ttargetTable\n\t\t\tcount\n\t\t\tfilter\n\t\t\tdisplayLabel\n\t\t\tlabel\n\t\t\tvalue\n\t\t\trelatedField\n\t\t}\n\t\tformatters {\n\t\t\tname\n\t\t\tsys_id\n\t\t}\n\t\tannotations {\n\t\t\tsysId\n\t\t\ttext\n\t\t\tannotationType\n\t\t\ttypeDisplayValue\n\t\t\tisPlainText\n\t\t}\n\t\t" + exports.VARIABLE_LAYOUT_QUERY_FRAGMENT + "\n\t\telementsData {\n\t\t\tname:elementName\n\t\t\tdictionary:dictionaryData {\n\t\t\t\ttype:dictionaryType\n\t\t\t\tdependentField\n\t\t\t\tdependentTable\n\t\t\t\tname\n\t\t\t\tlabel\n\t\t\t\tcanWrite\n\t\t\t\tcanRead\n\t\t\t\tcanCreate\n\t\t\t\tinternalType\n\t\t\t\tisMandatory\n\t\t\t\tsys_readonly: sysReadonly\n\t\t\t\tattributes {\n\t\t\t\t\tname\n\t\t\t\t\tvalue\n\t\t\t\t}\n\t\t\t}\n\n\t\t\t... on GlideLayout_ChoiceElementType {\n\t\t\t\tchoices {\n\t\t\t\t\tdisplayValue\n\t\t\t\t\tvalue\n\t\t\t\t}\n\t\t\t}\n\n\t\t\t... on GlideLayout_FileAttachmentElementType {\n\t\t\t\tvalue\n\t\t\t\tdisplayValue\n\t\t\t\tstate\n\t\t\t\tcontentType\n\t\t\t}\n\n\t\t\t... on GlideLayout_TableNameElementType {\n\t\t\t\tdisplayValue\n\t\t\t}\n\n\t\t\t... on GlideLayout_CurrencyElementType {\n\t\t\t\tvalue\n\t\t\t\tcode\n\t\t\t\tdefaultCurrency\n\t\t\t\tcurrencyCodes {\n\t\t\t\t\tcode\n\t\t\t\t\tsymbol\n\t\t\t\t}\n\t\t\t}\n\t\t\t... on GlideLayout_PhoneNumberElementType {\n\t\t\t\tvalue\n\t\t\t\tcountry\n\t\t\t\tcountryCodes {\n\t\t\t\t  code\n\t\t\t\t  name\n\t\t\t\t}\n\t\t\t}\n\n\t\t\t... on GlideLayout_GlideListElementType {\n\t\t\t\treference\n\t\t\t}\n\n\t\t\t... on GlideLayout_ReferenceElementType {\n\t\t\t\treference\n\t\t\t\treferenceQualifier\n\t\t\t\treferenceKey\n\t\t\t\tuseReferenceQualifier\n\t\t\t\tdependent\n\t\t\t\tdependentOnField\n\t\t\t\trefAutoCompleter\n\t\t\t\trefAcOrderBy\n\t\t\t\trefAcColumns\n\t\t\t\trefAcColumnsSearch\n\t\t\t\trefAcDisplayValue\n\t\t\t\trefQualElements\n\t\t\t\trefContributions\n\t\t\t\tisDynamicCreate\n\t\t\t\tisReferenceScriptableTable\n\t\t\t\treferenceError\n\t\t\t}\n\n\t\t\t... on GlideLayout_VariablesElementType {\n\t\t\t    " + FIELD_VARIABLES_KEY + " : " + exports.GlideElementVariables_ELEMENTS_QUERY_FRAGMENT + "\n\t\t\t}\n\n\t\t\t... on GlideLayout_ValueElementType {\n\t\t\t\tmaxLength\n\t\t\t\tdefaultRows\n\t\t\t}\n\n\t\t\t... on GlideLayout_GlideVarElementType {\n\t\t\t\tmodelTable\n\t\t\t\tglidevars: _elements {\n\t\t\t\t\tname: elementName\n\t\t\t\t\tdictionary: dictionaryData {\n\t\t\t\t\t\ttype: dictionaryType\n\t\t\t\t\t\tdependentField\n\t\t\t\t\t\tdependentTable\n\t\t\t\t\t\tname\n\t\t\t\t\t\tlabel\n\t\t\t\t\t\tcanWrite\n\t\t\t\t\t\tcanRead\n\t\t\t\t\t\tcanCreate\n\t\t\t\t\t\tinternalType\n\t\t\t\t\t\tisMandatory\n\t\t\t\t\t\tsys_readonly: sysReadonly\n\t\t\t\t\t\tattributes {\n\t\t\t\t\t\t\tname\n\t\t\t\t\t\t\tvalue\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t\t... on GlideLayout_ChoiceElementType {\n\t\t\t\t\t\tchoices {\n\t\t\t\t\t\t\tdisplayValue\n\t\t\t\t\t\t\tvalue\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\n\t\t\t\t\t... on GlideLayout_CurrencyElementType {\n\t\t\t\t\t\tvalue\n\t\t\t\t\t\tcode\n\t\t\t\t\t\tdefaultCurrency\n\t\t\t\t\t\tcurrencyCodes {\n\t\t\t\t\t\t\tcode\n\t\t\t\t\t\t\tsymbol\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t\t... on GlideLayout_PhoneNumberElementType {\n\t\t\t\t\t\tvalue\n\t\t\t\t\t\tcountry\n\t\t\t\t\t\tcountryCodes {\n\t\t\t\t\t\tcode\n\t\t\t\t\t\tname\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t\t... on GlideLayout_GlideListElementType {\n\t\t\t\t\t\treference\n\t\t\t\t\t}\n\n\n\t\t\t\t\t... on GlideLayout_ReferenceElementType {\n\t\t\t\t\t\treference\n\t\t\t\t\t\treferenceQualifier\n\t\t\t\t\t\treferenceKey\n\t\t\t\t\t\tuseReferenceQualifier\n\t\t\t\t\t\tdependent\n\t\t\t\t\t\tdependentOnField\n\t\t\t\t\t\trefAutoCompleter\n\t\t\t\t\t\trefAcOrderBy\n\t\t\t\t\t\trefAcColumns\n\t\t\t\t\t\trefAcColumnsSearch\n\t\t\t\t\t\trefAcDisplayValue\n\t\t\t\t\t\trefQualElements\n\t\t\t\t\t\trefContributions\n\t\t\t\t\t\tisDynamicCreate\n\t\t\t\t\t\tisReferenceScriptableTable\n\t\t\t\t\t\treferenceError\n\t\t\t\t\t}\n\t\t\t\t\t... on GlideLayout_ValueElementType {\n\t\t\t\t\t\tmaxLength\n\t\t\t\t\t\tdefaultRows\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n}\n";
// workspace enabled variable editors
var SERVICE_CATALOG_VEDITOR = 'com_glideapp_servicecatalog_veditor';
var SERVICE_CATALOG_QUESTION_EDITOR = 'com_glideapp_questionset_default_question_editor';
var FORMATTER_SUFFIX = '.xml';
var isValidFormatter = function (formatters, formatterName) {
    if (formatters === void 0) { formatters = {}; }
    return lodash_1.default.isObject(formatters[formatterName]) ||
        lodash_1.default.isObject(formatters[formatterName + FORMATTER_SUFFIX]);
};
var transformFormatter = function (formatters) {
    return formatters.reduce(function (formattersByName, formatter) {
        var _a;
        return (__assign(__assign({}, formattersByName), (_a = {}, _a[formatter.name] = formatter, _a)));
    }, {});
};
var transformRelatedLists = function (relatedLists) {
    if (relatedLists === void 0) { relatedLists = []; }
    return relatedLists
        .filter(function (relatedList) { return relatedList.displayLabel !== ''; })
        .map(function (relatedList) { return ({
        table: relatedList.targetTable,
        parentTable: relatedList.sourceTable,
        displayName: relatedList.displayLabel || relatedList.label,
        label: relatedList.label,
        value: relatedList.value,
        count: relatedList.count,
        filter: relatedList.filter,
        field: relatedList.relatedField,
        related_field: relatedList.relatedField,
        visible: true
    }); });
};
var transformFormFieldValues = function (table, sysId, recordValues, fieldElements, fieldStates, isFormReadonly, declarativeUIActions, variablesLayout, annotations) {
    var formFieldValues = lodash_1.default.reduce(glideFormDataParser.parseFieldGraphQLResponse(table, sysId, recordValues, fieldElements, fieldStates, annotations), function (fields, field, key) {
        var _a;
        return (__assign(__assign({}, fields), (_a = {}, _a[key] = __assign(__assign({}, field), { declarativeUiActions: declarativeUIActions[key] }), _a)));
    }, {});
    if (formFieldValues['variables']) {
        formFieldValues['variables'].variablesLayout = variablesLayout;
        var catalogVariablesList = lodash_1.default.filter(formFieldValues, function (field) { return !!field['_cat_variable']; });
    }
    if (!isFormReadonly)
        return formFieldValues;
    return lodash_1.default.reduce(formFieldValues, function (fields, field, key) {
        var _a;
        return (__assign(__assign({}, fields), (_a = {}, _a[key] = __assign(__assign({}, field), { sys_readonly: true, readonly: true }), _a)));
    }, {});
};
var transformFormFields = function (formFieldValues) {
    return lodash_1.default.map(formFieldValues, function (value) { return value; });
};
var transformGlideVars = function (elements, recordValues) {
    var glidevarSection = {};
    var elementsData = [];
    elements
        .filter(function (element) { return element.dictionary.type === 'glide_var'; })
        .forEach(function (element) {
        var name = element.name, _a = element.dictionary, caption = _a.name, captionDisplay = _a.label, modelTable = element.modelTable, glidevars = element.glidevars;
        if (!glidevars)
            return;
        var fields = [];
        glidevars.forEach(function (variable) {
            var fieldName = name + "." + modelTable + "." + variable.name;
            elementsData.push(__assign(__assign({}, variable), { name: fieldName }));
            fields.push(fieldName);
        });
        var section = { caption: caption, captionDisplay: captionDisplay, fields: fields };
        glidevarSection[caption] = section;
    });
    return { glidevarSection: glidevarSection, elementsData: elementsData };
};
var transformSections = function (sections, formSettings, showVariableEditor, glidevarSection) {
    var defaultSection = lodash_1.default.get(formSettings, 'defaultSection.sysId', NaN);
    var allSections = sections.reduce(function (acc, section) {
        //if (!section.rows || !section.rows.length) section.rows = [];
        var newRows = section.rows.reduce(function (accuRows, cols) {
            var newCols = cols.reduce(function (accCols, col) {
                var newFields = col.fields.reduce(function (accFields, field) {
                    if (!glidevarSection[field])
                        return __spreadArray(__spreadArray([], accFields), [field]);
                    return __spreadArray(__spreadArray([], accFields), glidevarSection[field].fields);
                }, []);
                return !newFields.length
                    ? accCols
                    : __spreadArray(__spreadArray([], accCols), [{ fields: newFields }]);
            }, []);
            return !newCols.length ? accuRows : __spreadArray(__spreadArray([], accuRows), [newCols]);
        }, []);
        return __spreadArray(__spreadArray([], acc), [__assign(__assign({}, section), { rows: newRows })]);
    }, []);
    var sectionsWithVariableEditor = showVariableEditor
        ? lodash_1.default.concat(allSections, { captionDisplay: 'Variables' })
        : allSections;
    return sectionsWithVariableEditor.map(function (section, index) { return (__assign(__assign({}, section), { id: index, 
        //this is to align with glideFormFaction
        caption: (section.caption || section.captionDisplay || '')
            .toLowerCase()
            .replace(' ', '_')
            .replace(/[^0-9a-z_]/gi, ''), label: section.captionDisplay, defaultSection: defaultSection === section.sysId, expanded: true })); });
};
var trasnformAnnotation = function (annotations) {
    return lodash_1.default.reduce(annotations, function (annotationsById, annotation) {
        var _a;
        return (__assign(__assign({}, annotationsById), (_a = {}, _a[annotation.sysId] = __assign(__assign({}, annotation), { type: 'annotation', name: 'annotation.' + annotation.sysId }), _a)));
    }, {});
};
var createTransform = function (getValueOrDefault) { return function (data, state, properties, declarativeUIActions) {
    if (declarativeUIActions === void 0) { declarativeUIActions = {}; }
    var isFormReadonly = state.isFormReadonly, view = state.record.view;
    var table = properties.table, orgSysId = properties.sysId;
    var isValidRecord = getValueOrDefault(IS_VALID_RECORD, false)(data);
    var isNewRecord = orgSysId == '-1';
    var canReadRecord = getValueOrDefault(CAN_READ_RECORD, false)(data);
    var isTemplateComponentEnabled = getValueOrDefault(ENCODED_RECORD_KEY)(data);
    var newSysId = getValueOrDefault(SYS_ID_KEY)(data);
    var encodedRecord = getValueOrDefault(ENCODED_RECORD_KEY)(data);
    var recordValues = getValueOrDefault(RECORD_VALUES_KEY, false)(data);
    var formTabs = getValueOrDefault(FORM_TABS_KEY)(data);
    var formSettings = getValueOrDefault(FORM_SETTINGS_KEY)(data);
    var orgFieldElements = getValueOrDefault(FIELD_ELEMENTS_KEY, [])(data).filter(function (el) { return lodash_1.default.get(el, 'dictionary.canRead') !== false; });
    var baseTable = getValueOrDefault(BASE_TABLE)(data);
    var isScriptableTable = getValueOrDefault(IS_SCRIPTABLE_TABLE, false)(data);
    var lastErrorMessage = getValueOrDefault(LAST_ERROR_MESSAGE)(data);
    var domainSeparation = getValueOrDefault(DOMAIN_SEPARATION)(data);
    var formatters = transformFormatter(getValueOrDefault(FORMATTER_QUERY_KEY, [])(data));
    var showVariableEditor = isValidFormatter(formatters, SERVICE_CATALOG_VEDITOR) ||
        isValidFormatter(formatters, SERVICE_CATALOG_QUESTION_EDITOR);
    var _a = transformGlideVars(orgFieldElements, recordValues), glidevarSection = _a.glidevarSection, glidevarElements = _a.elementsData;
    var fieldElements = __spreadArray(__spreadArray([], orgFieldElements), glidevarElements);
    var sections = transformSections(getValueOrDefault(SECTION_LAYOUT, [])(data), formSettings, showVariableEditor, glidevarSection);
    var relatedLists = isNewRecord
        ? []
        : transformRelatedLists(getValueOrDefault(RELATED_LISTS_QUERY_KEY, [])(data));
    var fieldStates = getValueOrDefault(FIELD_STATES_QUERY_KEY, [])(data).reduce(function (fieldStates, state) {
        var _a;
        return (__assign(__assign({}, fieldStates), (_a = {}, _a[state.name] = state, _a)));
    }, {});
    var sectionSysId = lodash_1.default.get(sections, '[0].sysId') || '';
    var configurationItems = [
        {
            order: exports.CONTEXTUAL_LINK_NAMES.relatedLists.order,
            label: exports.CONTEXTUAL_LINK_NAMES.relatedLists.name,
            url: encodeURIComponent("slushbucket.do?sysparm_referring_url=" + table + ".do&sysparm_view=" + view + "&sysparm_list=" + table + "&sysparm_form=related_list")
        },
        {
            order: exports.CONTEXTUAL_LINK_NAMES.formLayout.order,
            label: exports.CONTEXTUAL_LINK_NAMES.formLayout.name,
            url: encodeURIComponent("slushbucket.do?sysparm_referring_url=" + table + ".do&sysparm_view=" + view + "&sysparm_list=" + sectionSysId + "&sysparm_form=section")
        }
    ];
    var variablesLayout = getValueOrDefault(VARIABLES_LAYOUT)(data);
    var annotations = trasnformAnnotation(getValueOrDefault(ANNOTATIONS_QUERY_KEY, [])(data));
    var formFieldValues = transformFormFieldValues(table, newSysId, recordValues, fieldElements, fieldStates, isFormReadonly, declarativeUIActions, variablesLayout, annotations);
    var formFields = transformFormFields(formFieldValues);
    return {
        isValidRecord: isValidRecord,
        isNewRecord: isNewRecord,
        canReadRecord: canReadRecord,
        isTemplateComponentEnabled: isTemplateComponentEnabled,
        sysId: newSysId,
        encodedRecord: encodedRecord,
        recordValues: recordValues,
        fieldElements: fieldElements,
        baseTable: baseTable,
        table: table,
        isScriptableTable: isScriptableTable,
        lastErrorMessage: lastErrorMessage,
        domainSeparation: domainSeparation,
        formatters: formatters,
        showVariableEditor: showVariableEditor,
        sections: sections,
        relatedLists: relatedLists,
        fieldStates: fieldStates,
        formFieldValues: formFieldValues,
        formFields: formFields,
        formTabs: formTabs,
        formSettings: formSettings,
        configurationItems: configurationItems
    };
}; };
var createFormLayoutDataSource = function (queryPrefix) {
    if (queryPrefix === void 0) { queryPrefix = ''; }
    var baseKey = "" + queryPrefix + LAYOUT_QUERY_KEY + "." + FORM_LAYOUT_QUERY_KEY;
    var getValueOrDefault = utils_1.getValue(baseKey);
    var transform = createTransform(getValueOrDefault);
    return utils_1.createDataProviderDataSource({
        query: QUERY_FRAGMENT,
        variables: ['table', 'sysId', 'query', 'view'],
        transform: transform,
        props: {
            table: { default: '' },
            sysId: { default: '' },
            query: { default: '' },
            view: { default: '' }
        },
        selectableProps: {
            isValidRecord: {},
            isNewRecord: {},
            canReadRecord: {},
            isTemplateComponentEnabled: {},
            sysId: {},
            recordValues: {},
            fieldElements: {},
            baseTable: {},
            table: {},
            isScriptableTable: {},
            lastErrorMessage: {},
            domainSeparation: {},
            formatters: {},
            showVariableEditor: {},
            sections: {},
            relatedLists: {},
            fieldStates: {},
            formFieldValues: {},
            formFields: {},
            formSettings: {},
            formTabs: {},
            configurationItems: {}
        }
    });
};
exports.createFormLayoutDataSource = createFormLayoutDataSource;
