export declare class GlideScopedScript {
    private _scopedFunction;
    private _id;
    private readonly _function;
    private _parameters;
    private readonly _script;
    private _scope;
    constructor(functionName: any, functionParameters: any, clientScript: string);
    /**
     * Used for log messages
     * @param id
     */
    set id(id: string);
    get id(): string;
    set scope(s: any);
    get scope(): any;
    /**
     * Lazy generation of the function
     * @return {Function}
     */
    get scopedFunction(): any;
    getArguments(locals?: any): any[];
    /**
     * Take optional args to set as an array. Will map by index
     * @alias invoke([...])
     * @param arg1, arg2, ... argN
     * @return {*}
     */
    call(...args: any[]): void;
    /**
     * Take optional args to set as an array or map. Will map by name
     * @param {Object} args
     * @return {*}
     */
    invoke(args?: {}): any;
}
