export declare class GlideFormEnvironment {
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
