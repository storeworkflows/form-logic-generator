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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlideFormEnvironment = void 0;
var DataLookUp_1 = require("./datasource/DataLookUp");
var lodash_1 = __importDefault(require("lodash"));
var GlideFormEnvironmentScope_1 = require("./GlideFormEnvironmentScope");
var GlideFormEnvironment = /** @class */ (function () {
    function GlideFormEnvironment(_a) {
        var glideFormEnvironmentFactory = _a.glideFormEnvironmentFactory, glideFormFactory = _a.glideFormFactory, glideAjax = _a.glideAjax, glideRecord = _a.glideRecord, glideModalFactory = _a.glideModalFactory, glideUser = _a.glideUser, uiScriptFactory = _a.uiScriptFactory;
        this.glideFormEnvironmentFactory = glideFormEnvironmentFactory;
        this.glideFormFactory = glideFormFactory;
        this.glideAjax = glideAjax;
        this.glideRecord = glideRecord;
        this.glideModalFactory = glideModalFactory;
        this.glideUser = glideUser;
        this.uiScriptFactory = uiScriptFactory;
        this._scope = new GlideFormEnvironmentScope_1.GlideFormEnvironmentScope();
        this._env = null;
        this._changeSubscriber = null;
        this._propChangeSubscriber = null;
        this._stateSubscriber = null;
        this._submitSubscriber = null;
        this._liveUpdatedSubscriber = null;
        this._gForm = null;
    }
    GlideFormEnvironment.prototype.destroy = function () {
        this._submitSubscriber = null;
        this._changeSubscriber = null;
        this._propChangeSubscriber = null;
        this._stateSubscriber = null;
        this._liveUpdatedSubscriber = null;
        // TODO: destroy the env
        this._env = null;
    };
    Object.defineProperty(GlideFormEnvironment.prototype, "gForm", {
        /**
         * Returns a g_form like object for use within the UI controls
         * @return {GlideForm}
         */
        get: function () {
            if (this._gForm) {
                return this._gForm;
            }
            var g_form = this._scope.get(GlideFormEnvironmentScope_1.G_FORM);
            var facade = {};
            Object.keys(g_form).forEach(function (key) {
                facade[key] = g_form[key];
            });
            facade.setValue = facade.setUserValue;
            this._gForm = facade;
            return this._gForm;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GlideFormEnvironment.prototype, "gUser", {
        get: function () {
            return this._scope.get(GlideFormEnvironmentScope_1.G_USER);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GlideFormEnvironment.prototype, "gUIActions", {
        get: function () {
            return this._scope.get(GlideFormEnvironmentScope_1.G_UI_ACTIONS);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GlideFormEnvironment.prototype, "closeFormAction", {
        get: function () {
            return this._scope.get(GlideFormEnvironmentScope_1.G_AW).closeRecord;
        },
        enumerable: false,
        configurable: true
    });
    GlideFormEnvironment.prototype.onFormSubmit = function (subscriber) {
        this._submitSubscriber = subscriber;
    };
    GlideFormEnvironment.prototype.onChange = function (subscriber) {
        this._changeSubscriber = subscriber;
    };
    GlideFormEnvironment.prototype.onPropChange = function (subscriber) {
        this._propChangeSubscriber = subscriber;
    };
    GlideFormEnvironment.prototype.onStateChange = function (subscriber) {
        this._stateSubscriber = subscriber;
    };
    GlideFormEnvironment.prototype.onLiveUpdated = function (subscriber) {
        this._liveUpdatedSubscriber = subscriber;
    };
    GlideFormEnvironment.prototype.configureWithOptions = function (_a) {
        var _this = this;
        var data = _a.data, formModal = _a.formModal, sendRequest = _a.sendRequest, reloadForm = _a.reloadForm, domainScope = _a.domainScope;
        var _b = data.record, table = _b.table, sysId = _b.sysId, view = _b.view, trueTable = _b.trueTable;
        this._scope.set(data.environment.globals);
        this._scope.setScratchpad(data.environment.globals[GlideFormEnvironmentScope_1.G_SCRATCHPAD]);
        this._scope.setServiceCatalogAPI({ openCatalogItem: function (table, sysId, params) { return void 0; } });
        this._scope.setAlertIntelligenceAPI({ openInsight: function (sysId, params) { return void 0; } });
        this._scope.setLocalizationMethods(__assign(__assign({}, data.environment.messages), data.uiActions.messages), sendRequest);
        this._scope.setGlideAPIs(this.glideAjax, this.glideRecord);
        this._scope.setModal(this.glideModalFactory, formModal);
        this._scope.setUser(this.glideUser, data.currentUser.user);
        this._scope.setITSMWorkbench();
        this._scope.setUIScripts(this.uiScriptFactory, data.uiScripts.scripts);
        this._scope.setNamespaces();
        var submitSubscriber = function (record, redirect, operation) {
            if (_this._submitSubscriber) {
                _this._submitSubscriber.call(_this._submitSubscriber, record, redirect, operation);
            }
        };
        this._scope.setUIActions(data.uiActions.formActions, submitSubscriber, sendRequest, { table: table, sysId: sysId });
        // TODO: fix change lifecycle
        var changeSubscriber = function (changedFields) {
            if (_this._changeSubscriber) {
                // @ts-ignore
                _this._changeSubscriber.call(_this._changeSubscriber, changedFields);
            }
        };
        var propChangeSubscriber = function (type, name, propName, value) {
            if (_this._propChangeSubscriber) {
                _this._propChangeSubscriber.call(_this._propChangeSubscriber, type, name, propName, value);
            }
        };
        var stateSubscriber = function (oldState, newState) {
            if (_this._stateSubscriber) {
                _this._stateSubscriber.call(_this._stateSubscriber, oldState, newState);
            }
        };
        var liveUpdatedSubscriber = function (liveUpdatedFields) {
            if (_this._liveUpdatedSubscriber) {
                _this._liveUpdatedSubscriber.call(_this._liveUpdatedSubscriber, liveUpdatedFields);
            }
        };
        this._gForm = null;
        this._scope.setForm(this.glideFormFactory, changeSubscriber, propChangeSubscriber, stateSubscriber, liveUpdatedSubscriber, {
            tableName: trueTable,
            sysId: sysId,
            formFields: data.layout.formFields,
            encodedRecord: data.layout.encodedRecord,
            sections: data.layout.sections,
            relatedLists: data.layout.relatedLists,
            attachments: data.attachments.props || data.attachments,
            viewName: view,
            modal: formModal,
            variablesLayout: data.layout.variablesLayout,
            reloadForm: reloadForm,
            uniqueValue: data.layout.sysId
        });
        this._dataLookup = DataLookUp_1.createDataLookup(this._scope.get(GlideFormEnvironmentScope_1.G_FORM), data.dataLookup.fields, sendRequest, data.layout.encodedRecord);
        this._scope.setAgentWorkspaceAPI({
            openRecord: function () { return void 0; },
            closeRecord: function () { return void 0; },
            setSectionExpanded: function () { return void 0; },
            domainScopeProvider: function () { return void 0; }
        });
        var clientScripts = data.environment.clientScripts;
        var uiPolicies = data.environment.uiPolicies;
        var catalogClientScripts = data.environment.catalogClientScripts;
        var catalogUiPolicies = data.environment.catalogUiPolicies;
        if (catalogClientScripts || catalogUiPolicies) {
            if (!lodash_1.default.isEmpty(catalogClientScripts))
                clientScripts = lodash_1.default.mergeWith(clientScripts, catalogClientScripts, this.customizer);
            if (!lodash_1.default.isEmpty(catalogUiPolicies))
                uiPolicies = uiPolicies.concat(catalogUiPolicies);
        }
        // all scoped variables should be configured, initialize scripts
        var environment = this.glideFormEnvironmentFactory.createWithConfiguration(this._scope.get(GlideFormEnvironmentScope_1.G_FORM), this._scope.get(GlideFormEnvironmentScope_1.G_USER), this._scope.get(GlideFormEnvironmentScope_1.G_SCRATCHPAD), clientScripts, uiPolicies, this._scope.get(GlideFormEnvironmentScope_1.G_MODAL), data.validationScripts.fieldValidators, this._scope.get(GlideFormEnvironmentScope_1.G_UI_SCRIPTS));
        // apply new scope
        var g_env = environment.g_env;
        lodash_1.default.forEach(this._scope.getVariables(), function (val, key) {
            g_env.registerExtensionPoint(key, val);
        });
        this._env = environment;
    };
    GlideFormEnvironment.prototype.customizer = function (objValue, srcValue) {
        if (lodash_1.default.isArray(objValue))
            return objValue.concat(srcValue);
    };
    /**
     * Fires the glide form environment
     */
    GlideFormEnvironment.prototype.initialize = function () {
        // TODO: initialize UI Action scripts
        this._env.initialize();
        // TODO: should be created along with the env?
        if (this._dataLookup) {
            this._dataLookup.initialize();
        }
    };
    return GlideFormEnvironment;
}());
exports.GlideFormEnvironment = GlideFormEnvironment;
