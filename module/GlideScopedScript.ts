import _ from 'lodash';

export class GlideScopedScript {
    private _scopedFunction: any;
    private _id: string;
    private readonly _function: string;
    private _parameters: [];
    private readonly _script: any;
    private _scope: any;

    constructor(functionName: any, functionParameters: any, clientScript: string) {
        this._id = 'GlideScopedScript';
        this._function = functionName;
        this._parameters = functionParameters || [];
        this._script = clientScript;
        this._scope = null;
        this._scopedFunction = null;
    }

    /**
     * Used for log messages
     * @param id
     */
    set id(id) {
        this._id = id;
    }

    get id() {
        return this._id;
    }

    set scope(s) {
        this._scope = s;
    }

    get scope() {
        return this._scope;
    }

    /**
     * Lazy generation of the function
     * @return {Function}
     */
    get scopedFunction() {
        if (!this._scopedFunction) {
            let scopedFunction;
            let scopeVariableNames = "";
            let scopeArguments = [];
            if (this.scope) {
                scopeVariableNames = this.scope.getVariableNames();
                scopeArguments = this.scope.getArguments();
            }
            let functionName = this._function;
            let script = this._script;
            try {
                let scopingFunction = new Function(
                    scopeVariableNames,
                    `return (${script});`
                );

                // create the closure
                scopedFunction = scopingFunction.apply(
                    scopingFunction,
                    scopeArguments
                );
            } catch (e) {
                // Try to accommodate multiple root function declarations
                if (functionName) {
                    // Wrap the whole script in a single function
                    let scopingFunction = new Function(
                        scopeVariableNames,
                        `${script}; return ${functionName};`
                    );

                    // create the closure
                    scopedFunction = scopingFunction.apply(
                        scopingFunction,
                        scopeArguments
                    );
                } else {
                    throw e;
                }
            } finally {
                this._scopedFunction = scopedFunction;
            }
        }
        return this._scopedFunction;
    }

    getArguments(locals: any = {}) {
        let isLocalsArray = _.isArray(locals);
        let scopeVariables = this.scope ? this.scope.getVariables() : {};
        return this._parameters.map((name, index) => {
            if (isLocalsArray) {
                return locals[index];
            } else if (locals[name]) {
                return locals[name];
            } else {
                return scopeVariables[name];
            }
        });
    }

    /**
     * Take optional args to set as an array. Will map by index
     * @alias invoke([...])
     * @param arg1, arg2, ... argN
     * @return {*}
     */
    call(...args: any[]) {
        this.invoke(args.length ? args : undefined);
    }

    /**
     * Take optional args to set as an array or map. Will map by name
     * @param {Object} args
     * @return {*}
     */
    invoke(args = {}) {
        let fn = this.scopedFunction;
        try {
            return fn.apply(fn, this.getArguments(args));
        } catch (e) {
            console.error(
                'SCRIPT:EXEC',
                'Error while running Client Script "' + this.id + '": ' + e
            );
        }
    }
}
