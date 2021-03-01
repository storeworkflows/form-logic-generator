declare module '@swf/form-logic-generator/FormModel' {
  import { IVariables } from "@swf/form-logic-generator/interface/IVariables";
  export default class FormModel {
      _template: string;
      _variables: IVariables;
      isReadonly(state: any, view: string, isWhitelistedForEdit?: boolean): any;
      getRecordValueProps(recordValues: any, fieldName: any): {
          value: any;
          displayValue: any;
          valuesList: any;
          display_value_list: any;
      };
      getUiDomain(data: any, referringTable: any, referringRecordId: any): {
          tableDisplayValue: any;
          fields: any;
      };
      updatingProperties(data: any, state: any, properties: any): {
          formData: any;
          configurationItems: any[];
      };
      load(variables: IVariables, id: any, setState: any): Promise<void>;
  }

}
declare module '@swf/form-logic-generator/GlideClientScriptFactory' {
  import { GlideScopedScript } from '@swf/form-logic-generator/GlideScopedScript';
  /**
   * Convenience for creating scripts of a certain type
   */
  export class GlideClientScriptFactory {
      private readonly _name;
      private readonly _parameters;
      private _scripts;
      private _scope;
      constructor(functionName: string, ...functionParameters: string[]);
      set scope(scope: any);
      get scope(): any;
      create(script: string, id?: string): GlideScopedScript;
  }

}
declare module '@swf/form-logic-generator/GlideFormBehaviorEventHandler' {
  import Status from "@swf/form-logic-generator/enum/Status.enum";
  export default class GlideFormBehaviorEventHandler {
      private formData;
      private readonly setState;
      private fetchFormDataActions;
      private state;
      private prevRecordStatus;
      private _updateState;
      constructor(formData: any, setState: any, fetchFormDataActions: any);
      private copyObjectAtIndex;
      private operationToStatus;
      updatingState(stateName: string, matchCallBack: any, payload: any): void;
      handleRecordStatusChanged(status: Status, table: string, sysId: string): void;
      onStateChange(oldState: any, newState: any): void;
  }

}
declare module '@swf/form-logic-generator/GlideFormEnvironment' {
  export class GlideFormEnvironment {
      private glideFormEnvironmentFactory;
      private readonly glideFormFactory;
      private readonly glideAjax;
      private readonly glideRecord;
      private readonly glideModalFactory;
      private readonly glideUser;
      private readonly uiScriptFactory;
      private _scope;
      private _env;
      private _changeSubscriber;
      private _propChangeSubscriber;
      private _stateSubscriber;
      private _submitSubscriber;
      private _liveUpdatedSubscriber;
      private _gForm;
      private _dataLookup;
      constructor({ glideFormEnvironmentFactory, glideFormFactory, glideAjax, glideRecord, glideModalFactory, glideUser, uiScriptFactory }: {
          glideFormEnvironmentFactory: any;
          glideFormFactory: any;
          glideAjax: any;
          glideRecord: any;
          glideModalFactory: any;
          glideUser: any;
          uiScriptFactory: any;
      });
      destroy(): void;
      /**
       * Returns a g_form like object for use within the UI controls
       * @return {GlideForm}
       */
      get gForm(): null;
      get gUser(): any;
      get gUIActions(): any;
      get closeFormAction(): any;
      onFormSubmit(subscriber: any): void;
      onChange(subscriber: any): void;
      onPropChange(subscriber: any): void;
      onStateChange(subscriber: any): void;
      onLiveUpdated(subscriber: any): void;
      configureWithOptions({ data, formModal, sendRequest, reloadForm, domainScope }: {
          data: any;
          formModal: any;
          sendRequest: any;
          reloadForm: any;
          domainScope: any;
      }): void;
      customizer(objValue: any, srcValue: any): any[];
      /**
       * Fires the glide form environment
       */
      initialize(): void;
  }

}
declare module '@swf/form-logic-generator/GlideFormEnvironmentScope' {
  import { GlideVariableScope } from '@swf/form-logic-generator/GlideVariableScope';
  import IGlideRecord from "@swf/form-logic-generator/interface/IAddQuery";
  export const G_FORM = "g_form";
  export const G_MODAL = "g_modal";
  export const G_SCRATCHPAD = "g_scratchpad";
  export const G_UI_ACTIONS = "g_ui_actions";
  export const G_USER = "g_user";
  export const G_SERVICE_CATALOG = "g_service_catalog";
  export const G_AW = "g_aw";
  export const G_UI_SCRIPTS = "g_ui_scripts";
  export const GLIDE_AJAX = "GlideAjax";
  export const GLIDE_RECORD = "GlideRecord";
  export const GET_MESSAGE = "getMessage";
  export const GET_MESSAGES = "getMessages";
  export const FORMAT = "format";
  export const NS_NOW = "NOW";
  export class GlideFormEnvironmentScope extends GlideVariableScope {
      constructor();
      setServiceCatalogAPI(serviceCatalog: any): void;
      setAlertIntelligenceAPI(alertIntelligence: any): void;
      setAgentWorkspaceAPI(awApi: any): void;
      setScratchpad(scratchPad: any): {};
      setGlideAPIs(glideAjax: any, glideRecord: IGlideRecord): void;
      setLocalizationMethods(preloadedMessages: any, sendRequest: any): void;
      setNamespaces(): void;
      setModal(glideModalFactory: any, formModal: any): void;
      setUser(glideUser: any, userData: any): void;
      setForm(glideFormFactory: any, changeSubscriber: any, propChangeSubscriber: any, stateSubscriber: any, liveUpdatedSubscriber: any, config: any): void;
      generateErrorMessages(): {
          MANDATORY_MESSAGE: any;
          FIELD_ERROR_MESSAGE: any;
      };
      setUIActions(uiActions: any, submitSubscriber: any, sendRequest: any, record: any): void;
      setUIScripts(uiScriptFactory: any, uiScripts?: any): void;
      setITSMWorkbench(): void;
  }

}
declare module '@swf/form-logic-generator/GlideRecord' {
  export function glideRecordFactory({ sendRequest }: any): {
      new (tableName: any): {
          readonly tableName: any;
          encodedQuery: any;
          readonly conditions: any;
          readonly orderByFields: any;
          readonly orderByDescFields: any;
          limit: number;
          readonly _callback: any;
          currentRow: number;
          recordSet: any;
          readonly initialized: boolean;
          readonly ignoreNames: any;
          query(callback: any): any;
          _queryResponse(callback: any, response: any): void;
          _queryErrorResponse(callback: any, response?: {}): void;
          get(): void;
          _getResponse(callback: any, response: any): void;
          updateRecord(callback: any): any;
          deleteRecord(callback: any): any;
          addQuery(field: any, operator: string, value: any): void;
          hasNext(): boolean;
          next(): boolean;
          _next(): boolean;
          loadRow(index: any): void;
          _loadRecordSet(records: any): void;
          setEncodedQuery(queryString: any): void;
          getEncodedQuery(): string;
          orderBy(field: any): void;
          orderByDesc(field: any): void;
          setLimit(maxRows: any): void;
          getLimit(): number;
          setValue(fieldName: any, fieldValue: any): void;
          getValue(fieldName: any): any;
          getDisplayValue(fieldName: any): any;
          getCurrentRow(): any;
          getRowCount(): any;
          getTableName(): any;
          toString(): string;
          addOrderBy(field: any): void;
      };
      glideRequest: {
          getAngularURL: (path: any, parameters: any) => string;
          get: (url: any, options: any) => any;
          post: (url: any, options: any) => any;
          put: (url: any, options: any) => any;
          patch: (url: any, options: any) => any;
      };
  };

}
declare module '@swf/form-logic-generator/GlideRequest' {
  class GlideRequest {
      private sendRequest;
      private static applyOptions;
      private requestFactory;
      private static getAngularURL;
      private get;
      private post;
      private put;
      private patch;
      getFactory({ sendRequest }: any): {
          getAngularURL: typeof GlideRequest.getAngularURL;
          get: (url: string, options: any) => any;
          post: (url: string, options: any) => any;
          put: (url: string, options: any) => any;
          patch: (url: string, options: any) => any;
      };
  }
  const _default: GlideRequest;
  export default _default;

}
declare module '@swf/form-logic-generator/GlideScopedScript' {
  export class GlideScopedScript {
      private _scopedFunction;
      private _id;
      private readonly _function;
      private _parameters;
      private readonly _script;
      private _scope;
      constructor(functionName: any, functionParameters: any, clientScript: string);
      /**
       * Used for log messages
       * @param id
       */
      set id(id: string);
      get id(): string;
      set scope(s: any);
      get scope(): any;
      /**
       * Lazy generation of the function
       * @return {Function}
       */
      get scopedFunction(): any;
      getArguments(locals?: any): any[];
      /**
       * Take optional args to set as an array. Will map by index
       * @alias invoke([...])
       * @param arg1, arg2, ... argN
       * @return {*}
       */
      call(...args: any[]): void;
      /**
       * Take optional args to set as an array or map. Will map by name
       * @param {Object} args
       * @return {*}
       */
      invoke(args?: {}): any;
  }

}
declare module '@swf/form-logic-generator/GlideUIAction' {
  export function createUIAction(options: {
      name: string;
      sysId: string;
      label: string;
      type: string;
      hasClientScript: boolean;
      clientScript: string;
      hint: string;
  }): {
      readonly sysId: string;
      readonly name: string;
      readonly type: string;
      readonly label: string;
      readonly hasClientScript: boolean;
      readonly clientScript: string;
      readonly hint: string;
  };

}
declare module '@swf/form-logic-generator/GlideUIActions' {
  export default class GlideUIActions {
      private getActions;
      private readonly getAction;
      private getSaveActionName;
      private getActionByName;
      private submit;
      private click;
      private getActiveActionName;
      constructor(uiActions: any, actionExecutor: any, formSubmitValidator: any, formSubmitExecutor: any, gFormAccessor: any);
  }

}
declare module '@swf/form-logic-generator/GlideVariableScope' {
  export class GlideVariableScope {
      private readonly _variables;
      private _variableNames;
      constructor();
      getVariables(): any;
      getVariableNames(): string[];
      getArguments(): any[];
      get(variable: string): any;
      /**
       * Add variables to the scope
       * @param {*} variable - if an object is provided, all keys will be applied
       * @param [value]
       */
      set(variable: any, value?: string | object | null): void;
      unset(variable: string): void;
  }

}
declare module '@swf/form-logic-generator/Globals' {
  class GlobalStorage {
      private _wm;
      constructor();
      clear(): void;
      delete(k: object): boolean;
      get(k: object): any;
      has(k: object): boolean;
      set(k: object, v: any): this;
  }
  const _default: GlobalStorage;
  export default _default;

}
declare module '@swf/form-logic-generator/PlatformResource' {
  export default class PlatformResource {
      private static assignPlatformResources;
      private loadPlatformResources;
      load(id: any): Promise<void>;
  }

}
declare module '@swf/form-logic-generator/constants/FormDatasourceName' {
  export const DATASOURCE_NAMES: {
      header: string;
      tag: string;
      formDA: string;
      fieldDA: string;
      attachmentACL: string;
      uiAction: string;
      clientScriptEnv: string;
      formLayout: string;
      dataLookup: string;
      currentUser: string;
      fieldValidator: string;
      uiScript: string;
      registeredModal: string;
      activityStream: string;
      ribbon: string;
      shn: string;
      sessionMessage: string;
      simpleFormLayout: string;
  };

}
declare module '@swf/form-logic-generator/constants/FormTemplate' {
  export const SC_SCRIPTS_QUERY_KEY = "CatalogClientScriptingEnvironment_Scripts";
  export const SC_POLICIES_QUERY_KEY = "CatalogClientScriptingEnvironment_Policies";
  export const VARIABLE_LAYOUT_QUERY_FRAGMENT = "\nvariablesLayout {\n\tname\n\ttype\n\tparent\n \t... on GlideLayout_ContainerVariableFieldLayoutType {\n\t\tcaption\n\t\tcaptionDisplay\n\t\tlayout\n\t\tcolumns {\n\t\t\tfields {\n\t\t\t\tname\n\t\t\t\ttype\n\t\t\t}\n\t\t}\n\t}\n}\n";
  export const CATALOG_SCRIPTS_FRAGMENT: string;
  export const CATALOG_POLICIES_FRAGMENT: string;
  export const GlideElementVariables_ELEMENTS_QUERY_FRAGMENT = "\n_elements {\n    ... on GlideLayout_MultiRowVariableSetType {\n      type\n      name\n      variableName\n      label\n      containerType\n      canRead\n      canWrite\n      canCreate\n      id\n      maxRows\n      fields {\n        name\n        id\n        label\n        type\n      }\n      rowData {\n        row {\n          id\n          name\n          value\n          displayValue\n        }\n      }\n    }\n    ... on GlideLayout_SingleRowVariableSetType {\n      type\n      id\n      name\n      label\n      containerType\n      canRead\n      canWrite\n      canCreate\n      variableName\n    }\n    ... on GlideLayout_ChoiceQuestionElementType {\n      type\n      id\n      name\n      variableName\n      label\n      order\n      catalogItem\n      variableSet\n      mandatory\n      canRead\n      canWrite\n      canCreate\n      variableAttributes\n      defaultValue\n      lookupTable\n      lookupValue\n      lookupLabel\n      includeNone\n      lookupUnique\n      choiceTable\n      choiceField\n      choiceDirection\n      choices {\n        displayValue: label\n        value\n      }\n      dependentField\n      referringTable\n      referringRecordId\n    }\n    ... on GlideLayout_ReferenceQuestionElementType {\n      type\n      id\n      name\n      variableName\n      label\n      order\n      catalogItem\n      variableSet\n      mandatory\n      canRead\n      canWrite\n      canCreate\n      reference\n      referenceQual\n      listTable\n      useReferenceQualifier\n      variableAttributes\n      defaultValue\n      referringTable\n      referringRecordId\n    }\n    ... on GlideLayout_ContainerQuestionElementType {\n      type\n      id\n      name\n      variableName\n      label\n      order\n      catalogItem\n      variableSet\n      displayTitle\n      layout\n      containerType\n      canRead\n      canWrite\n      canCreate\n      mandatory\n    }\n    ... on GlideLayout_StandardQuestionElementType {\n      type\n      id\n      name\n      variableName\n      label\n      order\n      catalogItem\n      variableSet\n      mandatory\n      canRead\n      canWrite\n      canCreate\n      variableAttributes\n      defaultValue\n      exampleText\n      useConfirmation\n      regExp\n      canDecrypt\n    }\n    ... on GlideLayout_AttachmentQuestionElementType {\n      type\n      id\n      name\n      variableName\n      label\n      order\n      catalogItem\n      variableSet\n      mandatory\n      canRead\n      canWrite\n      canCreate\n      variableAttributes\n      defaultValue\n      contentType\n    }\n  }\n";
  export const CATALOG_DATALOOKUP_FIELDS_KEY = "catalogDataLookup";
  export const CATALOG_DATA_LOOKUP_QUERY_FRAGMENT: string;
  export const LAYOUT_QUERY_KEY = "GlideLayout_Query";
  export const FORM_LAYOUT_QUERY_KEY = "formLayout";
  export const RECORD_VALUES_KEY = "recordValues";
  export const FIELD_ELEMENTS_KEY = "elementsData";
  export const FORMATTER_QUERY_KEY = "formatters";
  export const ANNOTATIONS_QUERY_KEY = "annotations";
  export const RELATED_LISTS_QUERY_KEY = "relatedLists";
  export const FIELD_VARIABLES_KEY = "variables";
  export const LayoutQueryFragment: string;
  export const SCRIPTING_QUERY_KEY = "GlideClientScriptingEnvironment_Query";
  export const GLOBALS_QUERY_KEY = "ClientScriptingEnvironment_Globals";
  export const UI_POLICIES_QUERY_KEY = "ClientScriptingEnvironment_Policies";
  export const CLIENT_SCRIPTS_QUERY_KEY = "ClientScriptingEnvironment_Scripts";
  export const GlideClientScriptingEnvironmentQueryFragment: string;
  export const UI_ACTION_QUERY_KEY = "GlideUIAction_Query";
  export const UI_ACTIONS_KEY = "uiActions";
  export const UI_ACTION_FORM_ACTIONS = "formActions";
  export const UI_ACTION_NODES = "uiActionNodes";
  export const UIActionQueryFragment: string;
  export const USER_QUERY_KEY = "GlideDomain_Query";
  export const USER_QUERY_USER_KEY = "user";
  export const UserQueryFragment: string;
  export const DATALOOKUP_QUERY_KEY = "GlideDataLookupQuery_Query";
  export const DATALOOKUP_CONFIG_KEY = "dataLookup";
  export const DATALOOKUP_FIELDS_KEY = "fields";
  export const DataLookupFragment: string;
  export const SESSION_MESSAGE_QUERY_KEY = "GlideDomain_Query";
  export const SESSION_MESSAGE_CONFIG_KEY = "session";
  export const SESSION_MESSAGE_NOTIFICATIONS_KEY = "notifications";
  export const SessionMessageFragment: string;
  export const ATTACHMENT_ACL_QUERY_KEY = "GlideAttachmentQuery_Query";
  export const ATTACHMENT_ACL_ATTACHMENTS_KEY = "attachments";
  export const AttachmentAclQueryFragment: string;
  export const QUERY_PREFIX = "GlideViewQuery_Query.uiView.glideLayoutItem._query.";

}
declare module '@swf/form-logic-generator/constants/ScriptingActions' {
  export const WORKSPACE_FORM_ACTION = "WORKSPACE_FORM_ACTION";
  export const RECORD_NOTIFICATIONS_CHANGED = "RECORD_NOTIFICATIONS_CHANGED";
  export const ADD_NOTIFICATIONS = "ADD_NOTIFICATIONS";
  export const CLEAR_NOTIFICATIONS = "CLEAR_NOTIFICATIONS";
  export const REMOVE_NOTIFICATION = "REMOVE_NOTIFICATION";
  export const PREVIEW_RECORD = "PREVIEW_RECORD";
  export const FORM_UPDATE_HEADER = "FORM_UPDATE_HEADER";
  export const SET_FIELDS_VALUE = "SET_FIELDS_VALUE";
  export const EXECUTE_UI_ACTION = "EXECUTE_UI_ACTION";
  export const REFERENCE_INFO_CLICK = "REFERENCE_INFO_CLICK";
  export const PHONE_ADDON_ACTION_CLICK = "PHONE_ADDON_ACTION_CLICK";
  export const OPEN_PHONE = "OPEN_PHONE";
  export const TOGGLE_DOMAIN_SCOPE = "TOGGLE_DOMAIN_SCOPE";
  export const EXTERNAL_ACTIONS: {
      SEND_FORM_NOTIFICATION: string;
  };
  export const CONTENT_ITEMS_SELECTED = "CONTENT_ITEMS_SELECTED";
  export const QUERY_CHANGED = "QUERY_CHANGED";

}
declare module '@swf/form-logic-generator/constants' {
  export const DATASOURCE_NAMES: {
      header: string;
      tag: string;
      formDA: string;
      fieldDA: string;
      attachmentACL: string;
      uiAction: string;
      clientScriptEnv: string;
      formLayout: string;
      dataLookup: string;
      currentUser: string;
      fieldValidator: string;
      uiScript: string;
      registeredModal: string;
      activityStream: string;
      ribbon: string;
      shn: string;
      sessionMessage: string;
      simpleFormLayout: string;
  };

}
declare module '@swf/form-logic-generator/datasource/DataLookUp' {
  export const CATALOG_DATALOOKUP_FIELDS_KEY = "catalogDataLookup";
  export const CATALOG_DATA_LOOKUP_QUERY_FRAGMENT: string;
  /**
   * DataLookup processes a list of fields that have DataLookup definitions (table: dl_definition)
   * defined for that table/field combination.  The customer can create a table that acts as a
   * decision matrix, setting values based on current form field values
   */
  /**
   * Initialize DataLookup, transforming the list of fields into an object, and binding the
   * on change handler.
   *
   * @param gForm {Object}
   * @param fields {Array}
   * @param encodedRecord {String}
   */
  export function createDataLookup(gForm: any, fields: any, sendRequest: any, encodedRecord: string): {
      initialize: () => void;
  };
  export const createDataLookupDataSource: (queryPrefix?: string) => {
      query: any;
      variables: any;
      getParams: any;
      transform: any;
      props: any;
      selectableProps: any;
      templateVariables: any;
  };

}
declare module '@swf/form-logic-generator/datasource/activityStream' {
  export const ACTIVITY_QUERY_KEY = "GlideActivity_Query";
  export const ENTRIES_KEY = "entries";
  export const FIELDS_KEY = "fields";
  export const TIMESTAMP_KEY = "sysTimestamp";
  export const GET_STREAM = "getStream";
  export const QUERY_FRAGMENT: string;
  export const createActivityStreamDataSource: (queryPrefix?: string) => {
      query: any;
      variables: any;
      getParams: any;
      transform: any;
      props: any;
      selectableProps: any;
      templateVariables: any;
  };

}
declare module '@swf/form-logic-generator/datasource/attachmentACLDatasource' {
  export const createAttachmentAclDataSource: (queryPrefix?: string) => {
      query: any;
      variables: any;
      getParams: any;
      transform: any;
      props: any;
      selectableProps: any;
      templateVariables: any;
  };

}
declare module '@swf/form-logic-generator/datasource/clientScriptEnvironmentDataSource' {
  export const SCRIPTING_QUERY_KEY = "GlideClientScriptingEnvironment_Query";
  export const GLOBALS_QUERY_KEY = "ClientScriptingEnvironment_Globals";
  export const UI_POLICIES_QUERY_KEY = "ClientScriptingEnvironment_Policies";
  export const CLIENT_SCRIPTS_QUERY_KEY = "ClientScriptingEnvironment_Scripts";
  export const QUERY_FRAGMENT: string;
  export const createClientScriptEnvironmentDataSource: (queryPrefix?: string) => {
      query: any;
      variables: any;
      getParams: any;
      transform: any;
      props: any;
      selectableProps: any;
      templateVariables: any;
  };

}
declare module '@swf/form-logic-generator/datasource/currentUser' {
  export const USER_QUERY_KEY = "GlideDomain_Query";
  export const USER_QUERY_USER_KEY = "user";
  export const QUERY_FRAGMENT: string;
  export const createCurrentUserDataSource: (queryPrefix?: string) => {
      query: any;
      variables: any;
      getParams: any;
      transform: any;
      props: any;
      selectableProps: any;
      templateVariables: any;
  };

}
declare module '@swf/form-logic-generator/datasource/declarativeField' {
  export const DECLARATIVE_ACTIONS_QUERY_KEY = "GlideDeclarativeActions_Query";
  export const DECLARATIVE_ACTIONS_FIELD_QUERY_KEY = "GlideDeclarativeActions_fieldQuery";
  export const FIELD_DECLARATIVE_ACTIONS_KEY = "fieldDeclarativeActions";
  export const FIELD_ACTIONS_KEY = "fieldActions";
  export const QUERY_FRAGMENT: string;
  export const createDeclarativeFieldActionDataSource: (queryPrefix?: string) => {
      query: any;
      variables: any;
      getParams: any;
      transform: any;
      props: any;
      selectableProps: any;
      templateVariables: any;
  };

}
declare module '@swf/form-logic-generator/datasource/declarativeForm' {
  export const CONTEXTUAL_LINK_NAMES: {
      header: {
          name: any;
          order: number;
      };
      uiActions: {
          name: any;
          order: number;
      };
      ribbon: {
          name: any;
          order: number;
      };
      formLayout: {
          name: any;
          order: number;
      };
      relatedItems: {
          name: any;
          order: number;
      };
      relatedLists: {
          name: any;
          order: number;
      };
      contextualSidePanel: {
          name: any;
          order: number;
      };
  };
  export const DECLARATIVE_ACTIONS_QUERY_KEY = "GlideDeclarativeActions_Query";
  export const DECLARATIVE_ACTIONS_FORM_QUERY_KEY = "GlideDeclarativeActions_formQuery";
  export const FORM_DECLARATIVE_ACTIONS_KEY = "formDeclarativeActions";
  export const FORM_ACTIONS_KEY = "formActions";
  export const QUERY_FRAGMENT: string;
  export const createDeclarativeFormActionDataSource: (queryPrefix?: string) => {
      query: any;
      variables: any;
      getParams: any;
      transform: any;
      props: any;
      selectableProps: any;
      templateVariables: any;
  };

}
declare module '@swf/form-logic-generator/datasource/fieldValidation' {
  export const FIELD_VALIDATOR_QUERY_KEY = "GlideFieldValidator_Query";
  export const FIELD_VALIDATOR_KEY = "validators";
  export const VALIDATION_SCRIPTS_KEY = "validationScripts";
  export const QUERY_FRAGMENT: string;
  export const createFieldValidatorDataSource: (queryPrefix?: string) => {
      query: any;
      variables: any;
      getParams: any;
      transform: any;
      props: any;
      selectableProps: any;
      templateVariables: any;
  };

}
declare module '@swf/form-logic-generator/datasource/formLayout' {
  export const SC_SCRIPTS_QUERY_KEY = "CatalogClientScriptingEnvironment_Scripts";
  export const SC_POLICIES_QUERY_KEY = "CatalogClientScriptingEnvironment_Policies";
  export const VARIABLE_LAYOUT_QUERY_FRAGMENT = "\nvariablesLayout {\n\tname\n\ttype\n\tparent\n \t... on GlideLayout_ContainerVariableFieldLayoutType {\n\t\tcaption\n\t\tcaptionDisplay\n\t\tlayout\n\t\tcolumns {\n\t\t\tfields {\n\t\t\t\tname\n\t\t\t\ttype\n\t\t\t}\n\t\t}\n\t}\n}\n";
  export const CATALOG_SCRIPTS_FRAGMENT: string;
  export const CATALOG_POLICIES_FRAGMENT: string;
  export const GlideElementVariables_ELEMENTS_QUERY_FRAGMENT = "\n_elements {\n    ... on GlideLayout_MultiRowVariableSetType {\n      type\n      name\n      variableName\n      label\n      containerType\n      canRead\n      canWrite\n      canCreate\n      id\n      maxRows\n      fields {\n        name\n        id\n        label\n        type\n      }\n      rowData {\n        row {\n          id\n          name\n          value\n          displayValue\n        }\n      }\n    }\n    ... on GlideLayout_SingleRowVariableSetType {\n      type\n      id\n      name\n      label\n      containerType\n      canRead\n      canWrite\n      canCreate\n      variableName\n    }\n    ... on GlideLayout_ChoiceQuestionElementType {\n      type\n      id\n      name\n      variableName\n      label\n      order\n      catalogItem\n      variableSet\n      mandatory\n      canRead\n      canWrite\n      canCreate\n      variableAttributes\n      defaultValue\n      lookupTable\n      lookupValue\n      lookupLabel\n      includeNone\n      lookupUnique\n      choiceTable\n      choiceField\n      choiceDirection\n      choices {\n        displayValue: label\n        value\n      }\n      dependentField\n      referringTable\n      referringRecordId\n    }\n    ... on GlideLayout_ReferenceQuestionElementType {\n      type\n      id\n      name\n      variableName\n      label\n      order\n      catalogItem\n      variableSet\n      mandatory\n      canRead\n      canWrite\n      canCreate\n      reference\n      referenceQual\n      listTable\n      useReferenceQualifier\n      variableAttributes\n      defaultValue\n      referringTable\n      referringRecordId\n    }\n    ... on GlideLayout_ContainerQuestionElementType {\n      type\n      id\n      name\n      variableName\n      label\n      order\n      catalogItem\n      variableSet\n      displayTitle\n      layout\n      containerType\n      canRead\n      canWrite\n      canCreate\n      mandatory\n    }\n    ... on GlideLayout_StandardQuestionElementType {\n      type\n      id\n      name\n      variableName\n      label\n      order\n      catalogItem\n      variableSet\n      mandatory\n      canRead\n      canWrite\n      canCreate\n      variableAttributes\n      defaultValue\n      exampleText\n      useConfirmation\n      regExp\n      canDecrypt\n    }\n    ... on GlideLayout_AttachmentQuestionElementType {\n      type\n      id\n      name\n      variableName\n      label\n      order\n      catalogItem\n      variableSet\n      mandatory\n      canRead\n      canWrite\n      canCreate\n      variableAttributes\n      defaultValue\n      contentType\n    }\n  }\n";
  export const CATALOG_DATALOOKUP_FIELDS_KEY = "catalogDataLookup";
  export const CATALOG_DATA_LOOKUP_QUERY_FRAGMENT: string;
  export const CONTEXTUAL_LINK_NAMES: {
      header: {
          name: any;
          order: number;
      };
      uiActions: {
          name: any;
          order: number;
      };
      ribbon: {
          name: any;
          order: number;
      };
      formLayout: {
          name: any;
          order: number;
      };
      relatedItems: {
          name: any;
          order: number;
      };
      relatedLists: {
          name: any;
          order: number;
      };
      contextualSidePanel: {
          name: any;
          order: number;
      };
  };
  export const createFormLayoutDataSource: (queryPrefix?: string) => {
      query: any;
      variables: any;
      getParams: any;
      transform: any;
      props: any;
      selectableProps: any;
      templateVariables: any;
  };

}
declare module '@swf/form-logic-generator/datasource/header' {
  export const CONTEXTUAL_LINK_NAMES: {
      header: {
          name: any;
          order: number;
      };
      uiActions: {
          name: any;
          order: number;
      };
      ribbon: {
          name: any;
          order: number;
      };
      formLayout: {
          name: any;
          order: number;
      };
      relatedItems: {
          name: any;
          order: number;
      };
      relatedLists: {
          name: any;
          order: number;
      };
      contextualSidePanel: {
          name: any;
          order: number;
      };
  };
  export const ITEM_TYPES: {
      SIMPLE: string;
      REFERENCE: string;
      HIGHLIGHTED: string;
  };
  export const createHeaderDataSource: (queryPrefix?: string) => {
      query: any;
      variables: any;
      getParams: any;
      transform: any;
      props: any;
      selectableProps: any;
      templateVariables: any;
  };

}
declare module '@swf/form-logic-generator/datasource/registerModal' {
  export const REGISTERED_MODAL_QUERY_KEY = "GlideRegisteredModalQuery_Query";
  export const REGISTERED_MODAL_KEY = "registeredModals";
  export const MODALS_KEY = "modals";
  export const QUERY_FRAGMENT: string;
  export const createRegisteredModalDataSource: (queryPrefix?: string) => {
      query: any;
      variables: any;
      getParams: any;
      transform: any;
      props: any;
      selectableProps: any;
      templateVariables: any;
  };

}
declare module '@swf/form-logic-generator/datasource/ribbon' {
  export const RIBBON_QUERY_KEY = "AppRibbonConfig_Query";
  export const RIBBON_CONFIG_KEY = "ribbonConfig";
  export const QUERY_FRAGMENT: string;
  export const createRibbonDataSource: (queryPrefix?: string) => {
      query: any;
      variables: any;
      getParams: any;
      transform: any;
      props: any;
      selectableProps: any;
      templateVariables: any;
  };

}
declare module '@swf/form-logic-generator/datasource/sessionMessage' {
  export const createSessionMessageDataSource: (queryPrefix?: string) => {
      query: any;
      variables: any;
      getParams: any;
      transform: any;
      props: any;
      selectableProps: any;
      templateVariables: any;
  };

}
declare module '@swf/form-logic-generator/datasource/simpleFormLayout' {
  export const createSimpleFormLayoutDataSource: (queryPrefix?: string) => {
      query: any;
      variables: any;
      getParams: any;
      transform: any;
      props: any;
      selectableProps: any;
      templateVariables: any;
  };

}
declare module '@swf/form-logic-generator/datasource/specialHandlingNotes' {
  export const SHN_QUERY_KEY = "GlideSHN_Query";
  export const SHN_ENABLE_KEY = "isSHNEnabled";
  export const SHN_TOTAL_MSGS_KEY = "totalMsg";
  export const QUERY_FRAGMENT: string;
  export const createSpecialHandlingNoteDataSource: (queryPrefix?: string) => {
      query: any;
      variables: any;
      getParams: any;
      transform: any;
      props: any;
      selectableProps: any;
      templateVariables: any;
  };

}
declare module '@swf/form-logic-generator/datasource/tag' {
  export const VIEWABLE_TAG_QUERY_KEY = "GlideViewableTagQuery_Query";
  export const VIEWABLE_RECORD_TAGS = "viewableRecordTags";
  export const QUERY_FRAGMENT: string;
  export const createViewableRecordTagDataSource: (queryPrefix?: string) => {
      query: any;
      variables: any;
      getParams: any;
      transform: any;
      props: any;
      selectableProps: any;
      templateVariables: any;
  };

}
declare module '@swf/form-logic-generator/datasource/uiAction' {
  export const UI_ACTION_TYPES: {
      BUTTON: string;
      MENU: string;
      SPLIT_BUTTON: string;
  };
  export const CONTEXTUAL_LINK_NAMES: {
      header: {
          name: any;
          order: number;
      };
      uiActions: {
          name: any;
          order: number;
      };
      ribbon: {
          name: any;
          order: number;
      };
      formLayout: {
          name: any;
          order: number;
      };
      relatedItems: {
          name: any;
          order: number;
      };
      relatedLists: {
          name: any;
          order: number;
      };
      contextualSidePanel: {
          name: any;
          order: number;
      };
  };
  export const UI_ACTION_QUERY_KEY = "GlideUIAction_Query";
  export const UI_ACTIONS_KEY = "uiActions";
  export const UI_ACTION_FORM_ACTIONS = "formActions";
  export const UI_ACTION_MESSAGES = "messages";
  export const UI_ACTION_NODES = "actionNodes";
  export const QUERY_FRAGMENT: string;
  export const createUIActionDataSource: (queryPrefix?: string) => {
      query: any;
      variables: any;
      getParams: any;
      transform: any;
      props: any;
      selectableProps: any;
      templateVariables: any;
  };
  const _default: {
      query: any;
      variables: any;
      getParams: any;
      transform: any;
      props: any;
      selectableProps: any;
      templateVariables: any;
  };
  export default _default;

}
declare module '@swf/form-logic-generator/datasource/uiScript' {
  export const UI_SCRIPT_QUERY_KEY = "GlideUIScript_Query";
  export const UI_SCRIPT_KEY = "uiScripts";
  export const SCRIPTS_KEY = "scripts";
  export const QUERY_FRAGMENT: string;
  export const createUIScriptDataSource: (queryPrefix?: string) => {
      query: any;
      variables: any;
      getParams: any;
      transform: any;
      props: any;
      selectableProps: any;
      templateVariables: any;
  };

}
declare module '@swf/form-logic-generator/enum/Notification.enum' {
  export enum NotificationEnum {
      ADD = "ADD_NOTIFICATIONS",
      CLEAR = "CLEAR_NOTIFICATIONS",
      CHANGED = "RECORD_NOTIFICATIONS_CHANGED",
      REMOVE = "REMOVE_NOTIFICATION"
  }

}
declare module '@swf/form-logic-generator/enum/Status.enum' {
  enum Status {
      CHANGED = "RECORD_STATUS_CHANGED",
      UPDATED = "updated",
      INSERTED = "inserted",
      DELETED = "deleted",
      LIVEUPDATED = "liveUpdated",
      UNMODIFIED = "unmodified",
      MODIFIED = "modified",
      CLOSED = "closed"
  }
  export default Status;

}
declare module '@swf/form-logic-generator/graphqlRequest/graphqlRequest' {
  export default function graphqlRequest({ operationName, query, variables, params }: {
      operationName?: string;
      query?: {};
      variables?: {};
      params?: {};
  }): Promise<Response>;

}
declare module '@swf/form-logic-generator/graphqlRequest/index' {
  export {};

}
declare module '@swf/form-logic-generator/index' {
  export function getFormModel(variables: any, id: object, updater: any): void;

}
declare module '@swf/form-logic-generator/interface/IAddQuery' {
  interface IGlideRecord {
      query(callback: any): void;
  }
  export default IGlideRecord;

}
declare module '@swf/form-logic-generator/interface/IForm' {
  export interface IGlideClientRecord {
      [property: string]: any;
      new (type: string): IGlideClientRecord;
      addQuery(fieldName: string, operator?: string, value?: string): any;
      getEncodedQuery(): string;
      deleteRecord(responseFunction: () => void): boolean;
      get(name: string, value?: string): boolean;
      getTableName(): string;
      hasNext(): boolean;
      insert(responseFunction: () => void): boolean;
      next(): boolean;
      addOrderBy(column: string): void;
      orderBy(f: string): void;
      query(responseFunction: (results: IGlideClientRecord) => void): boolean;
      setLimit(maxQuery: number): void;
      getLimit(): number;
  }
  export interface IgForm {
      flash(widgetName: string, color: string, count: number): void;
      hideAllFieldMsgs(type?: string): void;
      hideErrorBox(input: string): void;
      hideRelatedList(listTableName: string): void;
      hideRelatedLists(): void;
      setDisplay(fieldName: string, isVisible: boolean): void;
      setVisible(fieldName: string, isVisible: boolean): void;
      showErrorBox(input: string, message: string, scrollForm?: boolean): void;
      showFieldMsg(input: string, message: string, type: string, scrollForm?: boolean): void;
      showRelatedList(listTableName: string): void;
      showRelatedLists(): void;
      getControl(fieldName: string): HTMLElement;
      getElement(id: string): HTMLElement;
      getIntValue(fieldName: string): number;
      getReference(fieldName: string, callback: () => void): IGlideClientRecord;
      getDecimalValue(fieldName: string): string;
      getValue(fieldName: string): string;
      isMandatory(fieldName: string): boolean;
      clearValue(fieldName: string): void;
      setDisabled(fieldName: string, isDisable: boolean): void;
      setMandatory(fieldName: string, isMandatory: boolean): void;
      setReadOnly(fieldName: string, isReadOnly: boolean): void;
      setValue(fieldName: string, value: string, displayValue?: string): void;
      addOption(fieldName: string, choiceValue: string, choiceLabel: string, choiceIndex?: number): void;
      clearOptions(fieldName: string): void;
      removeOption(fieldName: string, choiceValue: string): void;
      getActionName(): string;
      getFormElement(): string;
      getSections(): string;
      getTableName(): string;
      getUniqueValue(): string;
      isNewRecord(): boolean;
      addErrorMessage(message: string): void;
      addInfoMessage(message: string): void;
      clearMessages(): void;
      enableAttachments(): void;
      disableAttachments(): void;
      save(): void;
      submit(): void;
  }
  export interface IgUser {
      userName: string;
      userID: string;
      firstName: string;
      lastName: string;
      getClientData(key: string): string;
      getFullName(): string;
      hasRole(role: string): boolean;
      hasRoleExactly(role: string): boolean;
      hasRoleFromList(roles: string): boolean;
      hasRoles(): boolean;
  }
  export interface IgUIActions {
      click(sysId: string): void;
      getAction(sysId: string): any;
      getActionByName(name: string): any;
      getActions(): Array<any>;
      getActiveActionName(): any;
      getSaveActionName(): void;
      submit(sysId: string, options: any): void;
  }
  export interface IField {
      [property: string]: any;
  }
  export interface ISection {
      caption: string;
      captionDisplay: string;
      defaultSection: boolean;
      expanded: boolean;
      id: number;
      label: string;
      rows: Array<any>;
      sysId: string;
  }
  export interface IForm {
      gForm: IgForm;
      gUser: IgUser;
      gUIActions: IgUIActions;
      fields: IField;
      sections: Array<ISection>;
      isNewRecord: boolean;
      isValidRecord: boolean;
  }

}
declare module '@swf/form-logic-generator/interface/IRecordChanged' {
  interface IRecordChanged {
      table: string;
      sys_id: string;
      status: string;
      query?: string;
  }
  export default IRecordChanged;

}
declare module '@swf/form-logic-generator/interface/IScratchPad' {
  export interface IScratchPad {
      getValue?(name: string): string;
  }

}
declare module '@swf/form-logic-generator/interface/IVariables' {
  export interface IVariables {
      table: string;
      sysId: string;
      views: string;
      query: string;
      workspaceConfigId: string;
  }

}
declare module '@swf/form-logic-generator/interface/IgEnv' {
  import { IgForm, IgUIActions, IgUser } from "@swf/form-logic-generator/interface/IForm";
  export interface IgEnv {
      gForm: IgForm;
      gUser: IgUser;
      gUIActions: IgUIActions;
  }

}
declare module '@swf/form-logic-generator/utils/dataSource' {
  export const componentDataSources: any;
  export const getDataSourcesForComponents: (queryPrefix: any, components: any) => any;
  export const getDataSourcesForForm: () => any;

}
declare module '@swf/form-logic-generator/utils/glideFormParser' {
  /**
   * Create some data structures for fields and stuff
   * @param {Array} fieldValues
   * @param {Array} fieldElements
   * @param {Array} fieldStates
   */
  export function parseCatalogFields(fields: any, fieldValues: any, catalogFields: any, fieldStates: any): void;
  export function parseFieldGraphQLResponse(tableName: any, sysId: any, fieldValues: any, fieldElements?: any, fieldStates?: any, annotations?: any): any;
  const _default: {
      parseFieldGraphQLResponse: typeof parseFieldGraphQLResponse;
  };
  export default _default;

}
declare module '@swf/form-logic-generator/utils/http' {
  export const http: any;
  export function sendRequestFactory(): (url: string, method: string, options: any) => Promise<unknown>;
  /**
   * Encodes the provided parameter object key/values
   * @param {Object} parameters
   * @returns {String} param=value&param2=value2...
   */
  export function encodeURIParameters(obj: any): string;

}
declare module '@swf/form-logic-generator/utils/index' {
  export function getValue(baseKey: string): (key: string, defaultValue: any) => (data: any) => any;
  export function createDataProviderDataSource({ query, variables, getParams, transform, props, selectableProps, templateVariables }: any): {
      query: any;
      variables: any;
      getParams: any;
      transform: any;
      props: any;
      selectableProps: any;
      templateVariables: any;
  };

}
declare module '@swf/form-logic-generator/utils/uiPolicyParser' {
  const uiPolicyParser: {
      parseGraphQLResponse: typeof parseGraphQLResponse;
      parseGraphQLPolicy: typeof parseGraphQLPolicy;
      parseGraphQLPolicyActions: typeof parseGraphQLPolicyActions;
      parseGraphQLPolicyListActions: typeof parseGraphQLPolicyListActions;
      parseGraphQLPolicyConditions: typeof parseGraphQLPolicyConditions;
  };
  function parseGraphQLPolicyActions(actions: any): any;
  function parseGraphQLPolicyListActions(actions: any): any;
  function parseGraphQLPolicyConditions(conditions: any): any;
  function parseGraphQLPolicy(policy: any): any;
  function parseGraphQLResponse(uiPolicies: any): any;
  export default uiPolicyParser;

}
declare module '@swf/form-logic-generator' {
    export function getFormModel(variables: any, id: object, updater: any): void;
}