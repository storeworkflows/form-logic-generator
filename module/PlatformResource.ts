import {sendRequestFactory} from "./utils/http";
import {glideRecordFactory} from "./GlideRecord";
import GlideRequest from "./GlideRequest";
import {GlideFormEnvironment} from "./GlideFormEnvironment";
import GlobalStorage from "./Globals";


export default class PlatformResource {

    private static assignPlatformResources(sendRequest: any) {        // @ts-ignore

        const glideFormEnvironmentFactory = window['glideFormEnvironmentFactory'];        // @ts-ignore

        const glideFormFactory = window['glideFormFactory'];        // @ts-ignore

        const glideAjax = window['GlideAjax'];        // @ts-ignore

        const glideRecord = glideRecordFactory({sendRequest});        // @ts-ignore

        const glideModalFactory = window['glideModalFactory'];        // @ts-ignore

        const glideUser = window['GlideUser'];        // @ts-ignore

        const uiScriptFactory = window['uiScriptFactory'];

        const glideRequest = GlideRequest(sendRequest);
        // inject new request layer
        glideFormFactory.glideRequest = glideRequest;
        glideAjax.glideRequest = glideRequest;
        glideRecord.glideRequest = glideRequest;        // @ts-ignore

        window['GlideRecord'] = glideRecord;

        return {
            glideFormEnvironmentFactory,
            glideFormFactory,
            glideAjax,
            glideRecord,
            glideModalFactory,
            glideUser,
            uiScriptFactory
        };
    }

    loadPlatformResources() {
        let sendRequest = sendRequestFactory();

        // @ts-ignore
        if (typeof window['glideFormFactory'] !== 'undefined') {
            return Promise.resolve(PlatformResource.assignPlatformResources(sendRequest));
        }

        let script = document.createElement('script');
        if (location.hostname === "localhost") {
            script.src = `https://aaronsdev.service-now.com/scripts/sn/common/clientScript/js_includes_clientScript.js`;
        } else {
            script.src = `${location.protocol}//${location.host}/scripts/sn/common/clientScript/js_includes_clientScript.js`;
        }
        let promise = new Promise((resolve, reject) => {
            script.onload = () => {
                resolve(PlatformResource.assignPlatformResources(sendRequest));
            };
            script.onerror = () => {
                reject();
            };
        });
        document.getElementsByTagName('head')[0].appendChild(script);
        return promise;
    }

    async load(id: any): Promise<void> {
        try {
            let glideEnvPromiseResolve: any;
            let glideEnvPromiseReject: any;
            let glideEnvPromise = new Promise((resolve, reject) => {
                glideEnvPromiseResolve = resolve;
                glideEnvPromiseReject = reject;
            });

            let sendRequest = sendRequestFactory();

            GlobalStorage.set(id, {
                sendRequest,
                glideEnvironment: null,
                formModal: null,
                liveUpdate: null,
                eventHandler: null,
                glideEnvPromise
            })

            const resources: any = await this.loadPlatformResources();

            const currentResources = GlobalStorage.get(id);

            if (!currentResources) throw new Error("Error when set default values");

            currentResources.glideEnvironment = new GlideFormEnvironment(
                resources
            );

            glideEnvPromiseResolve(currentResources.glideEnvironment)
        } catch (error) {
            console.warn(`Unable to load platform resources`, error);
            return null
        }
    }
}