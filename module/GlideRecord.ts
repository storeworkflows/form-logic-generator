import _ from 'lodash';
import IGlideRecord from "./interface/IAddQuery";

const changeValues: any = {};

function changedFields(object: any) {
    Object.entries(object).forEach(([fieldName]) => {
        if (object.getValue(fieldName) !== object[fieldName])
            if (!object.ignoreNames[fieldName])
                changeValues[fieldName] = object[fieldName];
    });
    return changeValues;
}

function _logError(code: any, msg: any) {
    /* eslint-disable no-console */
    if (console && console.error) {
        console.error('(GlideRecord) [' + code + '] ' + msg);
    }
    /* eslint-enable no-console */
}

function _logWarn(code: any, msg: any) {
    /* eslint-disable no-console */
    if (console && console.warn) {
        console.warn('(GlideRecord) [' + code + '] ' + msg);
    }
    /* eslint-enable no-console */
}

export function glideRecordFactory({ sendRequest }: any) {
    return class GlideRecord implements IGlideRecord{
        readonly tableName: any;
        encodedQuery: any;
        readonly conditions: any;
        readonly orderByFields: any;
        readonly orderByDescFields: any;
        limit;
        readonly _callback: any;
        currentRow;
        recordSet: any;
        readonly initialized;
        readonly ignoreNames: any;
        /*
         * query: "An encoded query string used to filter the results" fields: "A
         * comma-separated list of fields to return in the response" limit: "The
         * maximum number of results returned per page (default: 10,000)"
         */
        static glideRequest: { getAngularURL: (path: any, parameters: any) => string; get: (url: any, options: any) => any; post: (url: any, options: any) => any; put: (url: any, options: any) => any; patch: (url: any, options: any) => any; };
        constructor(tableName: any) {
            this.tableName = tableName;
            this.encodedQuery = '';
            this.conditions = [];
            this.orderByFields = [];
            this.orderByDescFields = [];
            this.limit = 200;
            this._callback = null;
            this.currentRow = -1;
            this.recordSet = [];
            this.initialized = false;

            if (!this.initialized) {
                this.ignoreNames = {};
                // setup an array of names when we are done initializing..
                // we will use this array later to determine what vars the
                // end user has added
                Object.entries(this).forEach(([xname]) => {
                    this.ignoreNames[xname] = true;
                });
            } else {
                Object.entries(this).forEach(([xname]) => {
                    if (!this.ignoreNames[xname]) { // @ts-ignore
                        delete this[xname];
                    }
                });
            }

            this.initialized = true;
        }

        query(callback: any) {
            if (typeof callback !== 'function') {
                _logWarn(
                    'Q:NOCB',
                    'Query must be called with a callback function'
                );
                return;
            }

            return sendRequest(
                '/api/now/ui/glideRecord/' + this.tableName,
                'GET',
                {
                    params: {
                        sysparm_display_value: 'all',
                        sysparm_table: this.tableName,
                        sysparm_query: this.getEncodedQuery(),
                        sysparm_limit: this.getLimit()
                    },
                    body: {}
                }
            ).then(
                this._queryResponse.bind(this, callback),
                this._queryErrorResponse.bind(this, callback)
            );
        }

        _queryResponse(callback: any, response: any) {
            if (!response.data.result) return;

            this.recordSet = response.data.result || [];
            callback(this);
        }

        _queryErrorResponse(callback: any, response = {}) {
            const {
                data: { error: { message = "", detail = "" } = {} } = {},
                status
            }: any = response;
            _logWarn(
                'Q:FAILED',
                `Query failed: status=${status} message=${message}, detail=${detail}`
            );
            this.recordSet = [];
            callback(this);
        }

        get(/* fieldName, value, callback */) {
            let callback;
            if (arguments.length == 2 && typeof arguments[1] === 'function') {
                this.addQuery('sys_id',undefined, arguments[0]);
                callback = arguments[1];
            } else if (
                arguments.length == 3 &&
                typeof arguments[2] === 'function'
            ) {
                this.addQuery(arguments[0], undefined, arguments[1]);
                callback = arguments[2];
            } else {
                _logWarn(
                    'GET:NOCB',
                    'Get must be called with a callback function'
                );
                return;
            }

            this.query(this._getResponse.bind(this, callback));
        }

        _getResponse(callback: any, response: any) {
            if (!response) return;

            this.next();
            callback(this);
        }

        updateRecord(callback: any) {
            if (typeof callback !== 'function') {
                _logError(
                    'Q:NOCB',
                    'UpdateRecord must be called with a callback function'
                );
                return;
            }

            const change = changedFields(this);
            return sendRequest(
                '/api/now/ui/glideRecord/' +
                this.tableName +
                '/' +
                this.getValue('sys_id'),
                'PUT',
                {
                    headers: {
                        'X-WantSessionNotificationMessages': true,
                        'X-No-Response-Body': true
                    },
                    params: {
                        sysparm_display_value: true
                    },
                    body: change
                }
            ).then(callback(this));
        }

        deleteRecord(callback: any) {
            if (typeof callback !== 'function') {
                _logError(
                    'Q:NOCB',
                    'DeleteRecord must be called with a callback function'
                );
                return;
            }

            return sendRequest(
                '/api/now/ui/glideRecord/' +
                this.tableName +
                '/' +
                this.getValue('sys_id'),
                'DELETE',
                {
                    params: {},
                    body: {}
                }
            ).then(callback(this));
        }

        addQuery(field: any, operator = "=", value: any) {
            const args: any = [];
            Array.prototype.push.apply(args, arguments);

            const name = args.shift();
            const oper = args.shift();
            const fieldValue = args.shift();

            this.conditions.push({ name, oper, fieldValue });
        }

        hasNext() {
            return this.currentRow + 1 < this.recordSet.length;
        }

        next() {
            return this._next();
        }

        _next() {
            if (!this.hasNext()) return false;

            this.loadRow(this.currentRow + 1);
            return true;
        }

        loadRow(index: any) {
            this.currentRow = index;
            const currentRow = this.getCurrentRow();
            _.each(currentRow, (value: {value: any}, key) => {
                if (_.isObject(value)) value = value.value;
// @ts-ignore
                this[key] = value;
            });
        }

        _loadRecordSet(records: any) {
            this.recordSet = records || [];
        }

        setEncodedQuery(queryString: any) {
            this.encodedQuery = queryString;
        }

        getEncodedQuery() {
            const qc = [];
            const ec = this.encodedQuery;
            if (ec) {
                qc.push(ec);
            }
            this.conditions.forEach((q: any) => {
                qc.push(q.name + (q.oper || "=") + q.fieldValue);
            });

            return '^' + qc.join('^');
        }

        orderBy(field: any) {
            this.addOrderBy(field);
        }

        orderByDesc(field: any) {
            this.orderByDescFields.push(field);
        }

        setLimit(maxRows: any) {
            this.limit = maxRows;
        }

        getLimit() {
            return this.limit;
        }

        setValue(fieldName: any, fieldValue: any) {
            changeValues[fieldName] = fieldValue;
        }

        getValue(fieldName: any) {
            const current = this.getCurrentRow();
            return current && current[fieldName]
                ? current[fieldName].value : '';
        }

        getDisplayValue(fieldName: any) {
            const current = this.getCurrentRow();
            if (!fieldName) {
                return current ? current['display_value'] : '';
            } else if (current && current[fieldName]) {
                return current[fieldName].display_value;
            }
            return '';
        }

        getCurrentRow() {
            return this.recordSet[this.currentRow];
        }

        getRowCount() {
            return this.recordSet.length;
        }

        getTableName() {
            return this.tableName;
        }

        toString() {
            return 'GlideRecord';
        }

        addOrderBy(field: any) {
            this.orderByFields.push(field);
        }
    };
}
