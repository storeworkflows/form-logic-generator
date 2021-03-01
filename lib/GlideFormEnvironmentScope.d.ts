import { GlideVariableScope } from './GlideVariableScope';
import IGlideRecord from "./interface/IAddQuery";
export declare const G_FORM = "g_form";
export declare const G_MODAL = "g_modal";
export declare const G_SCRATCHPAD = "g_scratchpad";
export declare const G_UI_ACTIONS = "g_ui_actions";
export declare const G_USER = "g_user";
export declare const G_SERVICE_CATALOG = "g_service_catalog";
export declare const G_AW = "g_aw";
export declare const G_UI_SCRIPTS = "g_ui_scripts";
export declare const GLIDE_AJAX = "GlideAjax";
export declare const GLIDE_RECORD = "GlideRecord";
export declare const GET_MESSAGE = "getMessage";
export declare const GET_MESSAGES = "getMessages";
export declare const FORMAT = "format";
export declare const NS_NOW = "NOW";
export declare class GlideFormEnvironmentScope extends GlideVariableScope {
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
