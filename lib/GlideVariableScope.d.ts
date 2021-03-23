export declare class GlideVariableScope {
    private readonly _variables;
    private _variableNames;
    constructor();
    getVariables(): any;
    getVariableNames(): string[];
    getArguments(): any[];
    get(variable: string): any;
    /**
     * Add variables to the scope
     * @param {*} variable - if an object is provided, all keys will be applied
     * @param [value]
     */
    set(variable: any, value?: string | object | null): void;
    unset(variable: string): void;
}
