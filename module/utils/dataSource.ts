import {DATASOURCE_NAMES} from "../constants";
import {createClientScriptEnvironmentDataSource} from "../datasource/clientScriptEnvironmentDataSource";
import _ from "lodash";
import {createAttachmentAclDataSource} from "../datasource/attachmentACLDatasource";
import {createDeclarativeFieldActionDataSource} from "../datasource/declarativeField";
import {createDeclarativeFormActionDataSource} from "../datasource/declarativeForm";
import {createFormLayoutDataSource} from "../datasource/formLayout";
import {createDataLookupDataSource} from "../datasource/DataLookUp";
import {createCurrentUserDataSource} from "../datasource/currentUser";
import {createFieldValidatorDataSource} from "../datasource/fieldValidation";
import {createUIActionDataSource} from "../datasource/uiAction";
import {createUIScriptDataSource} from "../datasource/uiScript";
import {createHeaderDataSource} from "../datasource/header";
import {createViewableRecordTagDataSource} from "../datasource/tag";
import {createRegisteredModalDataSource} from "../datasource/registerModal";
import {createActivityStreamDataSource} from "../datasource/activityStream";
import {createRibbonDataSource} from "../datasource/ribbon";
import {createSpecialHandlingNoteDataSource} from "../datasource/specialHandlingNotes";
import {createSessionMessageDataSource} from "../datasource/sessionMessage";
import {createSimpleFormLayoutDataSource} from "../datasource/simpleFormLayout";
import {QUERY_PREFIX} from "../constants/FormTemplate";

const {
    header,
    tag,
    formDA,
    fieldDA,
    attachmentACL,
    uiAction,
    clientScriptEnv,
    formLayout,
    dataLookup,
    currentUser,
    fieldValidator,
    uiScript,
    registeredModal,
    activityStream,
    ribbon,
    shn,
    sessionMessage,
    simpleFormLayout
} = DATASOURCE_NAMES;

const DATASOURCE_FACOTORY_METHODS = {
    [header]: createHeaderDataSource,
    [tag]: createViewableRecordTagDataSource,
    [formDA]: createDeclarativeFormActionDataSource,
    [fieldDA]: createDeclarativeFieldActionDataSource,
    [attachmentACL]: createAttachmentAclDataSource,
    [uiAction]: createUIActionDataSource,
    [clientScriptEnv]: createClientScriptEnvironmentDataSource,
    [formLayout]: createFormLayoutDataSource,
    [dataLookup]: createDataLookupDataSource,
    [currentUser]: createCurrentUserDataSource,
    [fieldValidator]: createFieldValidatorDataSource,
    [uiScript]: createUIScriptDataSource,
    [registeredModal]: createRegisteredModalDataSource,
    [activityStream]: createActivityStreamDataSource,
    [ribbon]: createRibbonDataSource,
    [shn]: createSpecialHandlingNoteDataSource,
    [sessionMessage]: createSessionMessageDataSource,
    [simpleFormLayout]: createSimpleFormLayoutDataSource
};

export const componentDataSources: any = {
    'now-record-common-header': [header, tag],
    'now-record-common-sidebar': [formDA, attachmentACL],
    'now-record-common-uiactionbar': [uiAction],
    'now-record-form-blob': [
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

const createNestedQueryDataSource = (dataSource: any) => ({
    ...dataSource,
    query: dataSource.query.replace(
        /\$view/g,
        '"$$$$$$$$parent.viewName$$$$$$$$"'
    ),
    variables: _.omit(dataSource.variables, 'view'),
    props: _.omit(dataSource.props, 'view')
});

const hasViewVariable = (dataSource: any) => dataSource.query.indexOf('$view') >= 0;

const createFormDataSource = (dataSource: any) =>
    hasViewVariable(dataSource)
        ? createNestedQueryDataSource(dataSource)
        : dataSource;

const createDataSourceFromName = (queryPrefix: any, name: any) =>
    createFormDataSource(DATASOURCE_FACOTORY_METHODS[name](queryPrefix));

function getProperty(propertyName: any) {
    var defaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    return _.get(window, 'ux_globals.sysprops[\'' + propertyName + '\']', defaultValue);
};

const isAvailable = (ds: any) => {
    if (ds === shn) return !_.isNil(getProperty('sn_shn.note_preferences'));
    return true;
};

export const getDataSourcesForComponents = (queryPrefix: any, components: any) => {
    const allDataSources = [
        ...components.reduce(
            (all: any, component: any) => [...all, ...componentDataSources[component]],
            []
        ),
        sessionMessage
    ];
    const dataSourceNames = Array.from(new Set(allDataSources));
    return dataSourceNames.reduce(
        (dataSources, ds) =>
            !isAvailable(ds)
                ? dataSources
                : {
                    ...dataSources,
                    [ds]: createDataSourceFromName(queryPrefix, ds)
                },
        {}
    );
};

export const getDataSourcesForForm = () => {
    return getDataSourcesForComponents(QUERY_PREFIX, [
        'now-record-common-header',
        'now-record-common-sidebar',
        'now-record-common-uiactionbar',
        'now-record-form-blob',
        'now-activity-combo',
        'sn-component-ribbon-container',
        'sn-component-shn-modal'
    ]);
};

export const getVariables = function getVariables(variableParams: {}, dataSources: any[]) {
    if (!_.isEmpty(variableParams)) return Object.keys(variableParams);

    return dataSources.reduce(function (variables, ds) {
        return _.union(variables, ds.variables);
    }, []);
};

export const getTemplateVariables = function getTemplateVariables(dataSources: any[], templateVariableParams?: {}) {
    if (!_.isEmpty(templateVariableParams)) return Object.keys(templateVariableParams);

    return dataSources.reduce(function (variables: any, ds: { templateVariables: any; }) {
        return _.union(variables, ds.templateVariables);
    }, []);
};

export const isRequired = function isRequired(variable: string, variableParams: any) {
    return _.get(variableParams, variable + '.mandatory', true);
};

export const defaultQueryTemplate = function defaultQueryTemplate(variables: any[], variableParams: any) {
    var queryVariables = variables.map(function (variable) {
        var required = isRequired(variable, variableParams);
        return '$' + variable + ': String' + (required ? '!' : '');
    }).join(', ');
    return 'query(' + queryVariables + '){\n\t\t<<queries>>\n\t}';
};

export const getQuery = function getQuery(dataSources: any[], queryTemplate: string, variables: any, variableParams: any) {
    var queryFragments = dataSources.map(function (ds) {
        return ds.query;
    }).join('\n');
    var template = queryTemplate || defaultQueryTemplate(variables, variableParams);
    return template.replace('<<queries>>', queryFragments);
};

export const getFormDataProvider = (data: { name?: string; dataSources: any; queryTemplate: any; variableParams?: any; templateVariableParams?: any; fetchActionNames?: any; }) => {
    const {
        dataSources,
        queryTemplate,
        variableParams,
        templateVariableParams
    } = data;

    const variables = getVariables(variableParams, dataSources);
    const templateVariables = getTemplateVariables(dataSources, templateVariableParams);
    const query = getQuery(dataSources, queryTemplate, variables, variableParams);

    return query;
}