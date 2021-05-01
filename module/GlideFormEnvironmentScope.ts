import { GlideClientScriptFactory } from './GlideClientScriptFactory';
import { GlideVariableScope } from './GlideVariableScope';
import GlideUIActions from './GlideUIActions';
// @ts-ignore
import { t } from "@servicenow/library-translate";
import {IScratchPad} from "./interface/IScratchPad";
import {NotificationEnum} from "./enum/Notification.enum";
import IGlideRecord from "./interface/IAddQuery";

export const G_FORM = 'g_form';
export const G_MODAL = 'g_modal';
export const G_SCRATCHPAD = 'g_scratchpad';
export const G_UI_ACTIONS = 'g_ui_actions';
export const G_USER = 'g_user';
export const G_SERVICE_CATALOG = 'g_service_catalog';
const G_ALERT_INTELLIGENCE = 'g_alert_intelligence';
export const G_AW = 'g_aw';
export const G_UI_SCRIPTS = 'g_ui_scripts';

export const GLIDE_AJAX = 'GlideAjax';
export const GLIDE_RECORD = 'GlideRecord';
export const GET_MESSAGE = 'getMessage';
export const GET_MESSAGES = 'getMessages';
export const FORMAT = 'format';

export const NS_NOW = 'NOW';

export class GlideFormEnvironmentScope extends GlideVariableScope {
    constructor() {
        super();

        // sandbox variables

        const variables: {
            window: Window,
            document: Document,
            $: any,
            jQuery: any,
            $$: any,
            $j: any,
            angular: any,
            snmCabrillo: any,
            cabrillo: any
        } = {
            window: null,
            document: null,
            $: null,
            jQuery: null,
            $$: null,
            $j: null,
            angular: null,
            snmCabrillo: null,
            cabrillo: null
        }

        this.set(variables);
    }

    setServiceCatalogAPI(serviceCatalog: any) {
        this.set(G_SERVICE_CATALOG, serviceCatalog);
    }

    setAlertIntelligenceAPI(alertIntelligence: any) {
        this.set(G_ALERT_INTELLIGENCE, alertIntelligence);
    }

    setAgentWorkspaceAPI(awApi: any) {
        this.set(G_AW, awApi);
    }

    setScratchpad(scratchPad: any) {
        if (!scratchPad) return {};

        let parsed: IScratchPad = {};
        try {
            parsed = JSON.parse(scratchPad);
            parsed.getValue = function(name: string) {
                return this.get(G_SCRATCHPAD)[name];
            }.bind(this);
        } catch (e) {
            console.error(
                'Exception while parsing g_scratchpad',
                e,
                scratchPad
            );
        }
        this.set(G_SCRATCHPAD, parsed);
    }

    setGlideAPIs(glideAjax: any, glideRecord: IGlideRecord) {
        this.set(GLIDE_AJAX, glideAjax);
        this.set(GLIDE_RECORD, glideRecord);
    }

    setLocalizationMethods(preloadedMessages: any, sendRequest: any) {

        this.set(GET_MESSAGE, "");
        this.set(GET_MESSAGES, "");
        this.set(FORMAT, "");
    }

    setNamespaces() {
        this.set(NS_NOW, {});
    }

    setModal(glideModalFactory: any, formModal: any): void {
      return void 0
    }

    setUser(glideUser: any, userData: any) {
        // glideUser expects a userId, not sys_id
        userData.userId = userData.sys_id;
        let g_user = new glideUser(userData);
        this.set(G_USER, g_user);
    }

    setForm(
        glideFormFactory: any,
        changeSubscriber: any,
        propChangeSubscriber: any,
        stateSubscriber: any,
        liveUpdatedSubscriber: any,
        config: any
    ) {
        const uiMessageHandler = (g_form: any, messageType: any, messageStr: any) => {
            let type;
            let message = messageStr;
            switch (messageType) {
                default:
                    return false;
                case 'mandatoryMessage':
                    type = 'error';
                    message = message.replace(/\n/g, '<br>');
                    break;
                case 'clearMessages':
                    return true;
                case 'infoMessage':
                    type = 'info';
                    break;
                case 'errorMessage':
                    type = 'error';
                    break;
                case 'warningMessage':
                    type = 'warning';
                    break;
            }
            return true;
        };

        const messages = this.generateErrorMessages();

        let g_form = glideFormFactory.create(
            config.tableName,
            config.sysId,
            config.formFields,
            this.get(G_UI_ACTIONS),
            {
                encodedRecord: config.encodedRecord,
                sections: config.sections,
                variablesLayout: config.variablesLayout,
                relatedLists: config.relatedLists,
                viewName: config.viewName,
                attachments: config.attachments,
                uiMessageHandler: uiMessageHandler,
                submitPromises: false,
                messages,
                reloadForm: config.reloadForm,
                useCatalogVariableFieldHandler: true,
                uniqueValue: config.uniqueValue
            }
        );

        const EVENT_CHANGED = 'changed';
        const EVENT_CHANGE = 'change';
        const EVENT_PROPERTY_CHANGE = 'propertyChange';
        const EVENT_STATE_CHANGE = 'stateChange';
        const EVENT_LIVE_UPDATED = 'liveUpdated';

        // wire up form events
        var changedFields: any = {};
        g_form.$private.events.on(EVENT_CHANGE, function(fieldName: any) {
            changedFields[fieldName] = true;
        });

        g_form.$private.events.on(EVENT_CHANGED, () => {
            if (changeSubscriber) {
                changeSubscriber(changedFields);
            }
            changedFields = {};
        });
        if (propChangeSubscriber) {
            g_form.$private.events.on(
                EVENT_PROPERTY_CHANGE,
                propChangeSubscriber
            );
        }
        if (stateSubscriber) {
            g_form.$private.events.on(EVENT_STATE_CHANGE, stateSubscriber);
        }
        if (liveUpdatedSubscriber) {
            console.log({liveUpdatedSubscriber})
            g_form.$private.events.on(
                EVENT_LIVE_UPDATED,
                liveUpdatedSubscriber
            );
        }
        this.set(G_FORM, g_form);
    }

    generateErrorMessages() {
        return {
            MANDATORY_MESSAGE: t(
                'The following mandatory fields are not filled in'
            ),
            FIELD_ERROR_MESSAGE: t('The following fields contain errors')
        };
    }

    setUIActions(uiActions: any, submitSubscriber: any, sendRequest: any, record: any) {
        let onClickFactory = new GlideClientScriptFactory('onClick', 'g_form');
        onClickFactory.scope = this;

        let g_ui_actions = new GlideUIActions(
            uiActions,
            (action: any, options: any) => {
                const { runOn } = options;
                const g_form = this.get(G_FORM);
                const table = record.table;
                const sysId = record.sysId;
                switch (runOn) {
                    case 'server':
                        return sendRequest(
                            '/api/now/ui/ui_action/' + action.sysId,
                            'POST',
                            {
                                params: {
                                    sysparm_table: table,
                                    sysparm_sys_id: sysId
                                },
                                body: {
                                    encodedRecord: g_form.getEncodedRecord(),
                                    fields: g_form.serialize()
                                }
                            }
                        )
                            .then((response: any) => {
                                // parse the UI Action API response
                                const { data } = response;
                                const { result } = data;
                                const { record, redirect, operation } = result;
                                if (submitSubscriber) {
                                    submitSubscriber({
                                        record,
                                        redirect,
                                        operation
                                    });
                                }
                                return data;
                            })
                            .catch((response: any) => {
                                const { data } = response;
                                const result = data.result || data;
                                const {
                                    status,
                                    error: { message, detail }
                                } = result;
                                if (status === 'failure') {
                                    console.error(
                                        {
                                            type: NotificationEnum.ADD,
                                            error: message,
                                            timestamp: Date.now()
                                        }
                                    )
                                }
                            });
                    case 'client': {
                        // TODO: consider caching?
                        // TODO: remove private API usage
                        g_form.$private.userState.setRunningAction(
                            action.name,
                            action.sysId
                        );
                        let script = onClickFactory.create(action.clientScript);
                        let promise;
                        try {
                            const response = script.invoke();
                            promise = Promise.resolve(response);
                        } catch (e) {
                            console.error({
                                type: NotificationEnum.ADD,
                                message: t(
                                    'Failed to execute the UI Action. Please contact your administrator.'
                                ),
                                timestamp: Date.now()
                            })
                            promise = Promise.reject();
                        }
                        return promise.finally(function() {
                            g_form.$private.userState.resetRunningAction();
                        });
                    }
                }
            },
            (action: any) => {
                const g_form = this.get(G_FORM);
                return g_form.$private.validateForm(action.name);
            },
            (action: any) => {
                const g_form = this.get(G_FORM);
                const submitResult = g_form.submit(action.sysId);
                return !submitResult
                    ? Promise.reject(submitResult)
                    : Promise.resolve(submitResult);
            },
            () => this.get(G_FORM)
        );
        this.set(G_UI_ACTIONS, g_ui_actions);
    }

    setUIScripts(uiScriptFactory: any, uiScripts: any = []) {
        this.set(G_UI_SCRIPTS, uiScriptFactory.create(uiScripts));
    }

    setITSMWorkbench(): void {
        return void 0
    }
}
