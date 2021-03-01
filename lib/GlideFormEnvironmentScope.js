"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlideFormEnvironmentScope = exports.NS_NOW = exports.FORMAT = exports.GET_MESSAGES = exports.GET_MESSAGE = exports.GLIDE_RECORD = exports.GLIDE_AJAX = exports.G_UI_SCRIPTS = exports.G_AW = exports.G_SERVICE_CATALOG = exports.G_USER = exports.G_UI_ACTIONS = exports.G_SCRATCHPAD = exports.G_MODAL = exports.G_FORM = void 0;
var GlideClientScriptFactory_1 = require("./GlideClientScriptFactory");
var GlideVariableScope_1 = require("./GlideVariableScope");
var GlideUIActions_1 = __importDefault(require("./GlideUIActions"));
// @ts-ignore
var library_translate_1 = require("@servicenow/library-translate");
var Notification_enum_1 = require("./enum/Notification.enum");
exports.G_FORM = 'g_form';
exports.G_MODAL = 'g_modal';
exports.G_SCRATCHPAD = 'g_scratchpad';
exports.G_UI_ACTIONS = 'g_ui_actions';
exports.G_USER = 'g_user';
exports.G_SERVICE_CATALOG = 'g_service_catalog';
var G_ALERT_INTELLIGENCE = 'g_alert_intelligence';
exports.G_AW = 'g_aw';
exports.G_UI_SCRIPTS = 'g_ui_scripts';
exports.GLIDE_AJAX = 'GlideAjax';
exports.GLIDE_RECORD = 'GlideRecord';
exports.GET_MESSAGE = 'getMessage';
exports.GET_MESSAGES = 'getMessages';
exports.FORMAT = 'format';
exports.NS_NOW = 'NOW';
var GlideFormEnvironmentScope = /** @class */ (function (_super) {
    __extends(GlideFormEnvironmentScope, _super);
    function GlideFormEnvironmentScope() {
        var _this = _super.call(this) || this;
        // sandbox variables
        var variables = {
            window: null,
            document: null,
            $: null,
            jQuery: null,
            $$: null,
            $j: null,
            angular: null,
            snmCabrillo: null,
            cabrillo: null
        };
        _this.set(variables);
        return _this;
    }
    GlideFormEnvironmentScope.prototype.setServiceCatalogAPI = function (serviceCatalog) {
        this.set(exports.G_SERVICE_CATALOG, serviceCatalog);
    };
    GlideFormEnvironmentScope.prototype.setAlertIntelligenceAPI = function (alertIntelligence) {
        this.set(G_ALERT_INTELLIGENCE, alertIntelligence);
    };
    GlideFormEnvironmentScope.prototype.setAgentWorkspaceAPI = function (awApi) {
        this.set(exports.G_AW, awApi);
    };
    GlideFormEnvironmentScope.prototype.setScratchpad = function (scratchPad) {
        if (!scratchPad)
            return {};
        var parsed = {};
        try {
            parsed = JSON.parse(scratchPad);
            parsed.getValue = function (name) {
                return this.get(exports.G_SCRATCHPAD)[name];
            }.bind(this);
        }
        catch (e) {
            console.error('Exception while parsing g_scratchpad', e, scratchPad);
        }
        this.set(exports.G_SCRATCHPAD, parsed);
    };
    GlideFormEnvironmentScope.prototype.setGlideAPIs = function (glideAjax, glideRecord) {
        this.set(exports.GLIDE_AJAX, glideAjax);
        this.set(exports.GLIDE_RECORD, glideRecord);
    };
    GlideFormEnvironmentScope.prototype.setLocalizationMethods = function (preloadedMessages, sendRequest) {
        this.set(exports.GET_MESSAGE, "");
        this.set(exports.GET_MESSAGES, "");
        this.set(exports.FORMAT, "");
    };
    GlideFormEnvironmentScope.prototype.setNamespaces = function () {
        this.set(exports.NS_NOW, {});
    };
    GlideFormEnvironmentScope.prototype.setModal = function (glideModalFactory, formModal) {
        return void 0;
    };
    GlideFormEnvironmentScope.prototype.setUser = function (glideUser, userData) {
        // glideUser expects a userId, not sys_id
        userData.userId = userData.sys_id;
        var g_user = new glideUser(userData);
        this.set(exports.G_USER, g_user);
    };
    GlideFormEnvironmentScope.prototype.setForm = function (glideFormFactory, changeSubscriber, propChangeSubscriber, stateSubscriber, liveUpdatedSubscriber, config) {
        var uiMessageHandler = function (g_form, messageType, messageStr) {
            var type;
            var message = messageStr;
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
        var messages = this.generateErrorMessages();
        var g_form = glideFormFactory.create(config.tableName, config.sysId, config.formFields, this.get(exports.G_UI_ACTIONS), {
            encodedRecord: config.encodedRecord,
            sections: config.sections,
            variablesLayout: config.variablesLayout,
            relatedLists: config.relatedLists,
            viewName: config.viewName,
            attachments: config.attachments,
            uiMessageHandler: uiMessageHandler,
            submitPromises: false,
            messages: messages,
            reloadForm: config.reloadForm,
            useCatalogVariableFieldHandler: true,
            uniqueValue: config.uniqueValue
        });
        var EVENT_CHANGED = 'changed';
        var EVENT_CHANGE = 'change';
        var EVENT_PROPERTY_CHANGE = 'propertyChange';
        var EVENT_STATE_CHANGE = 'stateChange';
        var EVENT_LIVE_UPDATED = 'liveUpdated';
        // wire up form events
        var changedFields = {};
        g_form.$private.events.on(EVENT_CHANGE, function (fieldName) {
            changedFields[fieldName] = true;
        });
        g_form.$private.events.on(EVENT_CHANGED, function () {
            if (changeSubscriber) {
                changeSubscriber(changedFields);
            }
            changedFields = {};
        });
        if (propChangeSubscriber) {
            g_form.$private.events.on(EVENT_PROPERTY_CHANGE, propChangeSubscriber);
        }
        if (stateSubscriber) {
            g_form.$private.events.on(EVENT_STATE_CHANGE, stateSubscriber);
        }
        if (liveUpdatedSubscriber) {
            g_form.$private.events.on(EVENT_LIVE_UPDATED, liveUpdatedSubscriber);
        }
        this.set(exports.G_FORM, g_form);
    };
    GlideFormEnvironmentScope.prototype.generateErrorMessages = function () {
        return {
            MANDATORY_MESSAGE: library_translate_1.t('The following mandatory fields are not filled in'),
            FIELD_ERROR_MESSAGE: library_translate_1.t('The following fields contain errors')
        };
    };
    GlideFormEnvironmentScope.prototype.setUIActions = function (uiActions, submitSubscriber, sendRequest, record) {
        var _this = this;
        var onClickFactory = new GlideClientScriptFactory_1.GlideClientScriptFactory('onClick', 'g_form');
        onClickFactory.scope = this;
        var g_ui_actions = new GlideUIActions_1.default(uiActions, function (action, options) {
            var runOn = options.runOn;
            var g_form = _this.get(exports.G_FORM);
            var table = record.table;
            var sysId = record.sysId;
            switch (runOn) {
                case 'server':
                    return sendRequest('/api/now/ui/ui_action/' + action.sysId, 'POST', {
                        params: {
                            sysparm_table: table,
                            sysparm_sys_id: sysId
                        },
                        body: {
                            encodedRecord: g_form.getEncodedRecord(),
                            fields: g_form.serialize()
                        }
                    })
                        .then(function (response) {
                        // parse the UI Action API response
                        var data = response.data;
                        var result = data.result;
                        var record = result.record, redirect = result.redirect, operation = result.operation;
                        if (submitSubscriber) {
                            submitSubscriber({
                                record: record,
                                redirect: redirect,
                                operation: operation
                            });
                        }
                        return data;
                    })
                        .catch(function (response) {
                        var data = response.data;
                        var result = data.result || data;
                        var status = result.status, _a = result.error, message = _a.message, detail = _a.detail;
                        if (status === 'failure') {
                            console.error({
                                type: Notification_enum_1.NotificationEnum.ADD,
                                error: message,
                                timestamp: Date.now()
                            });
                        }
                    });
                case 'client': {
                    // TODO: consider caching?
                    // TODO: remove private API usage
                    g_form.$private.userState.setRunningAction(action.name, action.sysId);
                    var script = onClickFactory.create(action.clientScript);
                    var promise = void 0;
                    try {
                        var response = script.invoke();
                        promise = Promise.resolve(response);
                    }
                    catch (e) {
                        console.error({
                            type: Notification_enum_1.NotificationEnum.ADD,
                            message: library_translate_1.t('Failed to execute the UI Action. Please contact your administrator.'),
                            timestamp: Date.now()
                        });
                        promise = Promise.reject();
                    }
                    return promise.finally(function () {
                        g_form.$private.userState.resetRunningAction();
                    });
                }
            }
        }, function (action) {
            var g_form = _this.get(exports.G_FORM);
            return g_form.$private.validateForm(action.name);
        }, function (action) {
            var g_form = _this.get(exports.G_FORM);
            var submitResult = g_form.submit(action.sysId);
            return !submitResult
                ? Promise.reject(submitResult)
                : Promise.resolve(submitResult);
        }, function () { return _this.get(exports.G_FORM); });
        this.set(exports.G_UI_ACTIONS, g_ui_actions);
    };
    GlideFormEnvironmentScope.prototype.setUIScripts = function (uiScriptFactory, uiScripts) {
        if (uiScripts === void 0) { uiScripts = []; }
        this.set(exports.G_UI_SCRIPTS, uiScriptFactory.create(uiScripts));
    };
    GlideFormEnvironmentScope.prototype.setITSMWorkbench = function () {
        return void 0;
    };
    return GlideFormEnvironmentScope;
}(GlideVariableScope_1.GlideVariableScope));
exports.GlideFormEnvironmentScope = GlideFormEnvironmentScope;
