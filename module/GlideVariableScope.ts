export class GlideVariableScope {
    private readonly _variables: any;
    private _variableNames: string[]
    constructor() {
        this._variables = {};
        this._variableNames = null;
    }

    getVariables() {
        return this._variables;
    }

    getVariableNames() {
        // @note: this will pin the variables
        if (!this._variableNames) {
            this._variableNames = Object.keys(this._variables);
        }
        return this._variableNames;
    }

    getArguments() {
        return this.getVariableNames().map(key => {
            return this._variables[key];
        });
    }

    get(variable: string) {
        return this._variables[variable];
    }

    /**
     * Add variables to the scope
     * @param {*} variable - if an object is provided, all keys will be applied
     * @param [value]
     */
    set(variable: any, value: string|object|null = null) {
        if (typeof variable !== 'string') {
            Object.assign(this._variables, variable);
        } else {
            this._variables[variable] = value;
        }
    }

    unset(variable: string) {
        delete this._variables[variable];
    }
}
