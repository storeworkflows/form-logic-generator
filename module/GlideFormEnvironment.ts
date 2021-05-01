import {createDataLookup} from './datasource/DataLookUp';
import _ from 'lodash';
import {
    GlideFormEnvironmentScope,
    G_FORM,
    G_MODAL,
    G_SCRATCHPAD,
    G_UI_ACTIONS,
    G_USER,
    G_UI_SCRIPTS,
    G_AW
} from './GlideFormEnvironmentScope';

export class GlideFormEnvironment {
    private glideFormEnvironmentFactory: any;
    private readonly glideFormFactory: any;
    private readonly glideAjax: any;
    private readonly glideRecord: any;
    private readonly glideModalFactory: any;
    private readonly glideUser: any;
    private readonly uiScriptFactory: any;
    private _scope: GlideFormEnvironmentScope;
    private _env: {initialize: () => void};
    private _changeSubscriber: () => void;
    private _propChangeSubscriber: () => void;
    private _stateSubscriber: () => void;
    private _submitSubscriber: () => void;
    private _liveUpdatedSubscriber: () => void;
    private _gForm: null;
    private _dataLookup: { initialize: () => void };

    constructor({
                    glideFormEnvironmentFactory,
                    glideFormFactory,
                    glideAjax,
                    glideRecord,
                    glideModalFactory,
                    glideUser,
                    uiScriptFactory
                }: {glideFormEnvironmentFactory: any,
        glideFormFactory: any,
        glideAjax: any,
        glideRecord: any,
        glideModalFactory: any,
        glideUser: any,
        uiScriptFactory: any}) {
        this.glideFormEnvironmentFactory = glideFormEnvironmentFactory;
        this.glideFormFactory = glideFormFactory;
        this.glideAjax = glideAjax;
        this.glideRecord = glideRecord;
        this.glideModalFactory = glideModalFactory;
        this.glideUser = glideUser;
        this.uiScriptFactory = uiScriptFactory;
        this._scope = new GlideFormEnvironmentScope();
        this._env = null;
        this._changeSubscriber = null;
        this._propChangeSubscriber = null;
        this._stateSubscriber = null;
        this._submitSubscriber = null;
        this._liveUpdatedSubscriber = null;
        this._gForm = null;
    }

    destroy() {
        this._submitSubscriber = null;
        this._changeSubscriber = null;
        this._propChangeSubscriber = null;
        this._stateSubscriber = null;
        this._liveUpdatedSubscriber = null;

        // TODO: destroy the env
        this._env = null;
    }

    /**
     * Returns a g_form like object for use within the UI controls
     * @return {GlideForm}
     */
    get gForm() {
        if (this._gForm) {
            return this._gForm;
        }

        let g_form = this._scope.get(G_FORM);
        let facade: any = {};
        Object.keys(g_form).forEach(function (key) {
            facade[key] = g_form[key];
        });
        facade.setValue = facade.setUserValue;
        this._gForm = facade;
        return this._gForm;
    }

    get gUser() {
        return this._scope.get(G_USER);
    }

    get gUIActions() {
        return this._scope.get(G_UI_ACTIONS);
    }

    get closeFormAction() {
        return this._scope.get(G_AW).closeRecord;
    }

    onFormSubmit(subscriber: any) {
        this._submitSubscriber = subscriber;
    }

    onChange(subscriber: any) {
        this._changeSubscriber = subscriber;
    }

    onPropChange(subscriber: any) {
        this._propChangeSubscriber = subscriber;
    }

    onStateChange(subscriber: any) {
        this._stateSubscriber = subscriber;
    }

    onLiveUpdated(subscriber: any) {
        this._liveUpdatedSubscriber = subscriber;
    }

    configureWithOptions({
                             data,
                             formModal,
                             sendRequest,
                             reloadForm,
                             domainScope
                         }: {
        data: any,
        formModal: any,
        sendRequest: any,
        reloadForm: any,
        domainScope: any
    }) {
        const {table, sysId, view, trueTable} = data.record;
        this._scope.set(data.environment.globals);
        this._scope.setScratchpad(data.environment.globals[G_SCRATCHPAD]);
        this._scope.setServiceCatalogAPI({openCatalogItem: function (table: string, sysId: string, params: any): void {return void 0}});
        this._scope.setAlertIntelligenceAPI({openInsight: function (sysId: string, params: any): void {return void 0}});
        this._scope.setLocalizationMethods(
            {
                ...data.environment.messages,
                ...data.uiActions.messages
            },
            sendRequest
        );
        this._scope.setGlideAPIs(this?.glideAjax, this?.glideRecord);
        this._scope.setModal(this?.glideModalFactory, formModal);
        this._scope.setUser(this?.glideUser, data?.currentUser?.user);
        this._scope.setITSMWorkbench();
        this._scope.setUIScripts(this.uiScriptFactory, data.uiScripts?.scripts);
        this._scope.setNamespaces();
        const submitSubscriber = (record: any, redirect: string, operation: string) => {
            if (this._submitSubscriber) {
                this._submitSubscriber.call(
                    this._submitSubscriber,
                    record,
                    redirect,
                    operation
                );
            }
        };

        this._scope.setUIActions(
            data?.uiActions?.formActions,
            submitSubscriber,
            sendRequest,
            {table, sysId}
        );

        // TODO: fix change lifecycle
        const changeSubscriber = (changedFields: any) => {
            if (this._changeSubscriber) {
                // @ts-ignore
                this._changeSubscriber.call(
                    this._changeSubscriber,
                    changedFields
                );
            }
        };

        const propChangeSubscriber = (type:string, name:string, propName:string, value: any) => {
            if (this._propChangeSubscriber) {
                this._propChangeSubscriber.call(
                    this._propChangeSubscriber,
                    type,
                    name,
                    propName,
                    value
                );
            }
        };
        const stateSubscriber = (oldState: any, newState: any) => {
            if (this._stateSubscriber) {
                this._stateSubscriber.call(
                    this._stateSubscriber,
                    oldState,
                    newState
                );
            }
        };
        const liveUpdatedSubscriber = (liveUpdatedFields: any) => {
            console.log("Live update", {liveUpdatedFields});
            if (this._liveUpdatedSubscriber) {
                this._liveUpdatedSubscriber.call(
                    this._liveUpdatedSubscriber,
                    liveUpdatedFields
                );
            }
        };
        this._gForm = null;
        this._scope.setForm(
            this.glideFormFactory,
            changeSubscriber,
            propChangeSubscriber,
            stateSubscriber,
            liveUpdatedSubscriber,
            {
                tableName: trueTable,
                sysId: sysId,
                formFields: data.layout?.formFields,
                encodedRecord: data.layout?.encodedRecord,
                sections: data.layout?.sections,
                relatedLists: data.layout?.relatedLists,
                attachments: data?.attachments?.props || data?.attachments,
                viewName: view,
                modal: formModal,
                variablesLayout: data?.layout?.variablesLayout,
                reloadForm,
                uniqueValue: data?.layout?.sysId
            }
        );

        this._dataLookup = createDataLookup(
            this._scope.get(G_FORM),
            data.dataLookup.fields,
            sendRequest,
            data.layout.encodedRecord
        );

        this._scope.setAgentWorkspaceAPI({
            openRecord: (): void => void 0,
            closeRecord: (): void => void 0,
            setSectionExpanded: (): void => void 0,
            domainScopeProvider: (): void => void 0
        });

        let clientScripts = data.environment.clientScripts;
        let uiPolicies = data.environment.uiPolicies;

        const catalogClientScripts = data.environment.catalogClientScripts;
        const catalogUiPolicies = data.environment.catalogUiPolicies;
        if (catalogClientScripts || catalogUiPolicies) {
            if (!_.isEmpty(catalogClientScripts))
                clientScripts = _.mergeWith(
                    clientScripts,
                    catalogClientScripts,
                    this.customizer
                );
            if (!_.isEmpty(catalogUiPolicies))
                uiPolicies = uiPolicies.concat(catalogUiPolicies);
        }
        // all scoped variables should be configured, initialize scripts
        let environment = this.glideFormEnvironmentFactory.createWithConfiguration(
            this._scope.get(G_FORM),
            this._scope.get(G_USER),
            this._scope.get(G_SCRATCHPAD),
            clientScripts,
            uiPolicies,
            this._scope.get(G_MODAL),
            data.validationScripts.fieldValidators,
            this._scope.get(G_UI_SCRIPTS)
        );

        // apply new scope
        const {g_env} = environment;
        _.forEach(this._scope.getVariables(), (val, key) => {
            g_env.registerExtensionPoint(key, val);
        });
        this._env = environment;
    }

    customizer(objValue: any, srcValue: any) {
        if (_.isArray(objValue)) return objValue.concat(srcValue);
    }

    /**
     * Fires the glide form environment
     */
    initialize() {
        // TODO: initialize UI Action scripts
        this._env.initialize();

        // TODO: should be created along with the env?
        if (this._dataLookup) {
            this._dataLookup.initialize();
        }
    }
}
