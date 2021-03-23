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
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFormDataProvider = exports.getQuery = exports.defaultQueryTemplate = exports.isRequired = exports.getTemplateVariables = exports.getVariables = exports.getDataSourcesForForm = exports.getDataSourcesForComponents = exports.componentDataSources = void 0;
var constants_1 = require("../constants");
var clientScriptEnvironmentDataSource_1 = require("../datasource/clientScriptEnvironmentDataSource");
var lodash_1 = __importDefault(require("lodash"));
var attachmentACLDatasource_1 = require("../datasource/attachmentACLDatasource");
var declarativeField_1 = require("../datasource/declarativeField");
var declarativeForm_1 = require("../datasource/declarativeForm");
var formLayout_1 = require("../datasource/formLayout");
var DataLookUp_1 = require("../datasource/DataLookUp");
var currentUser_1 = require("../datasource/currentUser");
var fieldValidation_1 = require("../datasource/fieldValidation");
var uiAction_1 = require("../datasource/uiAction");
var uiScript_1 = require("../datasource/uiScript");
var header_1 = require("../datasource/header");
var tag_1 = require("../datasource/tag");
var registerModal_1 = require("../datasource/registerModal");
var activityStream_1 = require("../datasource/activityStream");
var ribbon_1 = require("../datasource/ribbon");
var specialHandlingNotes_1 = require("../datasource/specialHandlingNotes");
var sessionMessage_1 = require("../datasource/sessionMessage");
var simpleFormLayout_1 = require("../datasource/simpleFormLayout");
var FormTemplate_1 = require("../constants/FormTemplate");
var header = constants_1.DATASOURCE_NAMES.header, tag = constants_1.DATASOURCE_NAMES.tag, formDA = constants_1.DATASOURCE_NAMES.formDA, fieldDA = constants_1.DATASOURCE_NAMES.fieldDA, attachmentACL = constants_1.DATASOURCE_NAMES.attachmentACL, uiAction = constants_1.DATASOURCE_NAMES.uiAction, clientScriptEnv = constants_1.DATASOURCE_NAMES.clientScriptEnv, formLayout = constants_1.DATASOURCE_NAMES.formLayout, dataLookup = constants_1.DATASOURCE_NAMES.dataLookup, currentUser = constants_1.DATASOURCE_NAMES.currentUser, fieldValidator = constants_1.DATASOURCE_NAMES.fieldValidator, uiScript = constants_1.DATASOURCE_NAMES.uiScript, registeredModal = constants_1.DATASOURCE_NAMES.registeredModal, activityStream = constants_1.DATASOURCE_NAMES.activityStream, ribbon = constants_1.DATASOURCE_NAMES.ribbon, shn = constants_1.DATASOURCE_NAMES.shn, sessionMessage = constants_1.DATASOURCE_NAMES.sessionMessage, simpleFormLayout = constants_1.DATASOURCE_NAMES.simpleFormLayout;
var DATASOURCE_FACOTORY_METHODS = (_a = {},
    _a[header] = header_1.createHeaderDataSource,
    _a[tag] = tag_1.createViewableRecordTagDataSource,
    _a[formDA] = declarativeForm_1.createDeclarativeFormActionDataSource,
    _a[fieldDA] = declarativeField_1.createDeclarativeFieldActionDataSource,
    _a[attachmentACL] = attachmentACLDatasource_1.createAttachmentAclDataSource,
    _a[uiAction] = uiAction_1.createUIActionDataSource,
    _a[clientScriptEnv] = clientScriptEnvironmentDataSource_1.createClientScriptEnvironmentDataSource,
    _a[formLayout] = formLayout_1.createFormLayoutDataSource,
    _a[dataLookup] = DataLookUp_1.createDataLookupDataSource,
    _a[currentUser] = currentUser_1.createCurrentUserDataSource,
    _a[fieldValidator] = fieldValidation_1.createFieldValidatorDataSource,
    _a[uiScript] = uiScript_1.createUIScriptDataSource,
    _a[registeredModal] = registerModal_1.createRegisteredModalDataSource,
    _a[activityStream] = activityStream_1.createActivityStreamDataSource,
    _a[ribbon] = ribbon_1.createRibbonDataSource,
    _a[shn] = specialHandlingNotes_1.createSpecialHandlingNoteDataSource,
    _a[sessionMessage] = sessionMessage_1.createSessionMessageDataSource,
    _a[simpleFormLayout] = simpleFormLayout_1.createSimpleFormLayoutDataSource,
    _a);
exports.componentDataSources = {
    'now-record-common-header': [header, tag],
    'now-record-common-sidebar': [formDA, attachmentACL],
    'now-record-common-uiactionbar': [uiAction],
    'now-record-form-blob': [
        clientScriptEnv,
        fieldDA,
        formDA,
        formLayout,
        currentUser,
        uiAction,
        dataLookup,
        fieldValidator
    ],
    'now-activity-combo': [activityStream],
    'now-activity-stream-connected': [activityStream],
    'sn-component-ribbon-container': [ribbon],
    'sn-component-shn-modal': [shn],
    'sn-form-internal-simple-form': [fieldDA, simpleFormLayout],
    'now-record-form-section-column-layout': [
        clientScriptEnv,
        attachmentACL,
        fieldDA,
        formDA,
        formLayout,
        dataLookup,
        currentUser,
        fieldValidator,
        uiScript,
        registeredModal,
        uiAction,
        sessionMessage
    ]
};
var createNestedQueryDataSource = function (dataSource) { return (__assign(__assign({}, dataSource), { query: dataSource.query.replace(/\$view/g, '"$$$$$$$$parent.viewName$$$$$$$$"'), variables: lodash_1.default.omit(dataSource.variables, 'view'), props: lodash_1.default.omit(dataSource.props, 'view') })); };
var hasViewVariable = function (dataSource) { return dataSource.query.indexOf('$view') >= 0; };
var createFormDataSource = function (dataSource) {
    return hasViewVariable(dataSource)
        ? createNestedQueryDataSource(dataSource)
        : dataSource;
};
var createDataSourceFromName = function (queryPrefix, name) {
    return createFormDataSource(DATASOURCE_FACOTORY_METHODS[name](queryPrefix));
};
function getProperty(propertyName) {
    var defaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    return lodash_1.default.get(window, 'ux_globals.sysprops[\'' + propertyName + '\']', defaultValue);
}
;
var isAvailable = function (ds) {
    if (ds === shn)
        return !lodash_1.default.isNil(getProperty('sn_shn.note_preferences'));
    return true;
};
var getDataSourcesForComponents = function (queryPrefix, components) {
    var allDataSources = __spreadArray(__spreadArray([], components.reduce(function (all, component) { return __spreadArray(__spreadArray([], all), exports.componentDataSources[component]); }, [])), [
        sessionMessage
    ]);
    var dataSourceNames = Array.from(new Set(allDataSources));
    return dataSourceNames.reduce(function (dataSources, ds) {
        var _a;
        return !isAvailable(ds)
            ? dataSources
            : __assign(__assign({}, dataSources), (_a = {}, _a[ds] = createDataSourceFromName(queryPrefix, ds), _a));
    }, {});
};
exports.getDataSourcesForComponents = getDataSourcesForComponents;
var getDataSourcesForForm = function () {
    return exports.getDataSourcesForComponents(FormTemplate_1.QUERY_PREFIX, [
        'now-record-common-uiactionbar',
        'now-record-form-blob',
    ]);
};
exports.getDataSourcesForForm = getDataSourcesForForm;
var getVariables = function getVariables(variableParams, dataSources) {
    if (!lodash_1.default.isEmpty(variableParams))
        return Object.keys(variableParams);
    return dataSources.reduce(function (variables, ds) {
        return lodash_1.default.union(variables, ds.variables);
    }, []);
};
exports.getVariables = getVariables;
var getTemplateVariables = function getTemplateVariables(dataSources, templateVariableParams) {
    if (!lodash_1.default.isEmpty(templateVariableParams))
        return Object.keys(templateVariableParams);
    return dataSources.reduce(function (variables, ds) {
        return lodash_1.default.union(variables, ds.templateVariables);
    }, []);
};
exports.getTemplateVariables = getTemplateVariables;
var isRequired = function isRequired(variable, variableParams) {
    return lodash_1.default.get(variableParams, variable + '.mandatory', true);
};
exports.isRequired = isRequired;
var defaultQueryTemplate = function defaultQueryTemplate(variables, variableParams) {
    var queryVariables = variables.map(function (variable) {
        var required = exports.isRequired(variable, variableParams);
        return '$' + variable + ': String' + (required ? '!' : '');
    }).join(', ');
    return 'query(' + queryVariables + '){\n\t\t<<queries>>\n\t}';
};
exports.defaultQueryTemplate = defaultQueryTemplate;
var getQuery = function getQuery(dataSources, queryTemplate, variables, variableParams) {
    var queryFragments = dataSources.map(function (ds) {
        return ds.query;
    }).join('\n');
    var template = queryTemplate || exports.defaultQueryTemplate(variables, variableParams);
    return template.replace('<<queries>>', queryFragments);
};
exports.getQuery = getQuery;
var getFormDataProvider = function (data) {
    var dataSources = data.dataSources, queryTemplate = data.queryTemplate, variableParams = data.variableParams, templateVariableParams = data.templateVariableParams;
    var variables = exports.getVariables(variableParams, dataSources);
    var templateVariables = exports.getTemplateVariables(dataSources, templateVariableParams);
    var query = exports.getQuery(dataSources, queryTemplate, variables, variableParams);
    return query;
};
exports.getFormDataProvider = getFormDataProvider;
