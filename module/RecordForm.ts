import {IVariables} from "./interface/IVariables";
import graphqlRequest from "./graphqlRequest/graphqlRequest";
import GlobalStorage from "./Globals";

import _ from "lodash";

import {
    GlideClientScriptingEnvironmentQueryFragment,
    UIActionQueryFragment,
    UserQueryFragment,
    DataLookupFragment,
    SessionMessageFragment,
    AttachmentAclQueryFragment,
    LayoutQueryFragment
} from "./constants/FormTemplate";
import {getDataSourcesForForm} from "./utils/dataSource";
import {DATASOURCE_NAMES} from "./constants";
import {GlideFormEnvironment} from "./GlideFormEnvironment";
import {sendRequestFactory} from "./utils/http";
import GlideFormBehaviorEventHandler from "./GlideFormBehaviorEventHandler";
import {IForm, IgForm} from "./interface/IForm";
import {IgEnv} from "./interface/IgEnv";

export default class RecordForm {
    _template: string = `query($table: String!, $sysId: String!, $views: String!, $query: String!, $workspaceConfigId: String) {
						GlideRecordDomainQuery_Query {
							uiDomain(table: $table, sysId: $sysId, query: $query) {
								tableDisplayValue
								recordValues {
									name
									value
									displayValue
									valuesList {
									  value
									  displayValue
									}
								}
								domainElementData {
									dictionaryData {
										label
										name
										internalType
									}
									... on GlideRecordDomainQuery_ReferenceElementType {
										reference
										useReferenceQualifier
									}
								}
							}
						}
						GlideViewQuery_Query {
							uiView(table: $table, views: $views, sysId: $sysId, workspaceConfigId: $workspaceConfigId, query: $query) {
								isWhitelistedForEdit
								view
								glideLayoutItem(table: $table, sysId: $sysId, query: $query) {
									_query {
										${GlideClientScriptingEnvironmentQueryFragment}
										${UIActionQueryFragment}
										${LayoutQueryFragment}
										${UserQueryFragment}
										${DataLookupFragment}
										${SessionMessageFragment}
										${AttachmentAclQueryFragment}
									}
								}
							}
						}
					}`
    _variables: IVariables;

    isReadonly(state: any = {}, view: string, isWhitelistedForEdit: boolean = false) {
        const {
            properties: {readOnlyForm = false} = {}
        } = state;
        return (
            (!isWhitelistedForEdit) ||
            readOnlyForm ||
            false
        );
    };

    getRecordValueProps(recordValues: any, fieldName: any) {
        const recordValue = recordValues.find((record: any) => record.name === fieldName);
        return {
            value: recordValue ? recordValue.value : '',
            displayValue: recordValue ? recordValue.displayValue : '',
            valuesList:
                recordValue && recordValue.valuesList ? recordValue.valuesList : [],
            display_value_list:
                recordValue && recordValue.valuesList
                    ? recordValue.valuesList.map((value: any) => value.displayValue)
                    : []
        };
    }

    getUiDomain(data: any, referringTable: any, referringRecordId: any) {
        const uiDomain = _.get(data, 'GlideRecordDomainQuery_Query.uiDomain') || {};
        const {tableDisplayValue, domainElementData, recordValues} = uiDomain;
        if (_.isEmpty(domainElementData)) return null;
        const fields = domainElementData
            .filter((elm: any) => elm && elm.dictionaryData)
            .map((elm: any, index: any) => {
                const {
                    dictionaryData: {label, name, internalType},
                    reference
                } = elm;
                return {
                    name,
                    label,
                    ...this.getRecordValueProps(recordValues, name),
                    reference,
                    referringTable,
                    referringRecordId,
                    type: 'domain_id' === internalType ? 'reference' : internalType,
                    mandatory: index == 0
                };
            });
        return {
            tableDisplayValue,
            fields
        };
    };

    updatingProperties(data: any, state: any, properties: any) {
        try {
            const {
                table,
                sysId,
                views,
                query,
                readOnlyForm,
                active,
                defaultTab,
                hideDetails,
                workspaceConfigId
            } = properties;

            const dataSources = getDataSourcesForForm();
            const computedView = _.get(data, 'GlideViewQuery_Query.uiView.view');
            const isWhitelistedForEdit = _.get(data, 'GlideViewQuery_Query.uiView.isWhitelistedForEdit');

            console.log({dataSources, state, properties, computedView, isWhitelistedForEdit})


            const uiDomain = this.getUiDomain(data, table, sysId);
            const trueTable = table;
            const record = {
                table,
                sysId,
                views,
                query,
                view: computedView,
                trueTable,
                isWhitelistedForEdit
            };
            const isFormReadonly = this.isReadonly(
                state,
                computedView,
                isWhitelistedForEdit
            );
            const isMissingWorkspaceView =
                isFormReadonly && !readOnlyForm && !isWhitelistedForEdit;

            // clear the data fetchers
            const newState = {
                ...state,
                record,
                isFormReadonly
            };

            let configurationItems: any[] = [];
            const update: any = Object.keys(dataSources).reduce((update: any, name) => {
                const updatedData =
                    name === DATASOURCE_NAMES.formLayout
                        ? dataSources[name].transform(
                        data,
                        newState,
                        properties,
                        (update.declarativeUIActions || {})
                            .declarativeFieldActions
                        )
                        : dataSources[name].transform(data, newState, properties);
                if (updatedData.configurationItems || updatedData.configurationItem)
                    configurationItems = [
                        ...configurationItems,
                        ...(updatedData.configurationItems || [
                            updatedData.configurationItem
                        ])
                    ];
                return {
                    ...update,
                    [name]: updatedData
                };
            }, {});
            configurationItems = _.orderBy(configurationItems, ['order']);

            return {
                formData: {
                    isReadOnly: isFormReadonly,
                    isMissingWorkspaceView,
                    uiDomain,
                    record: {
                        ...record,
                        sys_id: update[DATASOURCE_NAMES.formLayout].sysId
                    },
                    workspaceConfigId:
                        workspaceConfigId ||
                        _.get(state, 'behaviors.wsConfigSysId', ''),
                    ...update
                },
                configurationItems
            };
        } catch (error) {
            console.error(error)
        }
    };


    async load(variables: IVariables, id: any, setState: any): Promise<void> {
        try {
            const fetch = await graphqlRequest({
                operationName: "",
                query: this._template,
                variables
            });

            const response = await fetch.json();

            const data = _.get(response, "[0].data");
            
            const {formData, configurationItems} = this.updatingProperties(data, {
                ...variables,
                properties: {...variables}
            }, {...variables});
            const globals = GlobalStorage.get(id);


            const gEnv: GlideFormEnvironment = await globals.glideEnvPromise;
            gEnv.configureWithOptions({
                data: formData,
                formModal: {},
                sendRequest: sendRequestFactory(),
                reloadForm: () => "",
                domainScope: {}
            })


            globals.eventHandler = new GlideFormBehaviorEventHandler(formData, setState, {});

            gEnv.onStateChange(globals.eventHandler.onStateChange);
            gEnv.onFormSubmit((submitResult: any) => {
                // need to clean up liveUpdate immediately
                if (globals.liveUpdate) {
                    globals.liveUpdate.liveUpdate.destroy();
                    globals[id].liveUpdate = null;
                }
                globals.eventHandler.onFormSubmit(submitResult);
            });
            gEnv.onChange(globals.eventHandler.onChange);
            gEnv.onPropChange(globals.eventHandler.onPropChange);
            gEnv.onLiveUpdated(globals.eventHandler.onLiveUpdated);

            gEnv.initialize();

            const {gForm, gUser, gUIActions}: IgEnv = gEnv;
            const {layout: {formFieldValues: fields, sections, isNewRecord, isValidRecord}} = formData;

            const formModel: IForm = {
                gForm, gUser, gUIActions, fields, sections, isNewRecord, isValidRecord
            };

            setState(formModel)
        } catch (error) {
            console.error(error)
        }
    }
}