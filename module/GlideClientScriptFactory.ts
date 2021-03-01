import { GlideScopedScript } from './GlideScopedScript';

/**
 * Convenience for creating scripts of a certain type
 */
export class GlideClientScriptFactory {
    private readonly _name: any;
    private readonly _parameters: any[];
    private _scripts: any[];
    private _scope: any;

    constructor(functionName: string, ...functionParameters: string[]) {
        this._name = functionName;
        this._parameters = functionParameters;
        this._scripts = [];
    }

    set scope(scope) {
        this._scope = scope;
        this._scripts.map(script => {
            script.scope = scope;
        });
    }

    get scope() {
        return this._scope;
    }

    create(script: string, id = "") {
        let clientScript = new GlideScopedScript(
            this._name,
            this._parameters,
            script
        );
        if (id) {
            clientScript.id = id;
        }
        if (this.scope) {
            clientScript.scope = this.scope;
        }
        this._scripts.push(clientScript);
        return clientScript;
    }
}
