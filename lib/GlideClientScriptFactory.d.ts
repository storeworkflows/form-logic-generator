import { GlideScopedScript } from './GlideScopedScript';
/**
 * Convenience for creating scripts of a certain type
 */
export declare class GlideClientScriptFactory {
    private readonly _name;
    private readonly _parameters;
    private _scripts;
    private _scope;
    constructor(functionName: string, ...functionParameters: string[]);
    set scope(scope: any);
    get scope(): any;
    create(script: string, id?: string): GlideScopedScript;
}
