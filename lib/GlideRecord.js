"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.glideRecordFactory = void 0;
var lodash_1 = __importDefault(require("lodash"));
var changeValues = {};
function changedFields(object) {
    Object.entries(object).forEach(function (_a) {
        var fieldName = _a[0];
        if (object.getValue(fieldName) !== object[fieldName])
            if (!object.ignoreNames[fieldName])
                changeValues[fieldName] = object[fieldName];
    });
    return changeValues;
}
function _logError(code, msg) {
    /* eslint-disable no-console */
    if (console && console.error) {
        console.error('(GlideRecord) [' + code + '] ' + msg);
    }
    /* eslint-enable no-console */
}
function _logWarn(code, msg) {
    /* eslint-disable no-console */
    if (console && console.warn) {
        console.warn('(GlideRecord) [' + code + '] ' + msg);
    }
    /* eslint-enable no-console */
}
function glideRecordFactory(_a) {
    var sendRequest = _a.sendRequest;
    return /** @class */ (function () {
        function GlideRecord(tableName) {
            var _this = this;
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
                Object.entries(this).forEach(function (_a) {
                    var xname = _a[0];
                    _this.ignoreNames[xname] = true;
                });
            }
            else {
                Object.entries(this).forEach(function (_a) {
                    var xname = _a[0];
                    if (!_this.ignoreNames[xname]) { // @ts-ignore
                        delete _this[xname];
                    }
                });
            }
            this.initialized = true;
        }
        GlideRecord.prototype.query = function (callback) {
            if (typeof callback !== 'function') {
                _logWarn('Q:NOCB', 'Query must be called with a callback function');
                return;
            }
            return sendRequest('/api/now/ui/glideRecord/' + this.tableName, 'GET', {
                params: {
                    sysparm_display_value: 'all',
                    sysparm_table: this.tableName,
                    sysparm_query: this.getEncodedQuery(),
                    sysparm_limit: this.getLimit()
                },
                body: {}
            }).then(this._queryResponse.bind(this, callback), this._queryErrorResponse.bind(this, callback));
        };
        GlideRecord.prototype._queryResponse = function (callback, response) {
            if (!response.data.result)
                return;
            this.recordSet = response.data.result || [];
            callback(this);
        };
        GlideRecord.prototype._queryErrorResponse = function (callback, response) {
            if (response === void 0) { response = {}; }
            var _a = response.data, _b = _a === void 0 ? {} : _a, _c = _b.error, _d = _c === void 0 ? {} : _c, _e = _d.message, message = _e === void 0 ? "" : _e, _f = _d.detail, detail = _f === void 0 ? "" : _f, status = response.status;
            _logWarn('Q:FAILED', "Query failed: status=" + status + " message=" + message + ", detail=" + detail);
            this.recordSet = [];
            callback(this);
        };
        GlideRecord.prototype.get = function ( /* fieldName, value, callback */) {
            var callback;
            if (arguments.length == 2 && typeof arguments[1] === 'function') {
                this.addQuery('sys_id', undefined, arguments[0]);
                callback = arguments[1];
            }
            else if (arguments.length == 3 &&
                typeof arguments[2] === 'function') {
                this.addQuery(arguments[0], undefined, arguments[1]);
                callback = arguments[2];
            }
            else {
                _logWarn('GET:NOCB', 'Get must be called with a callback function');
                return;
            }
            this.query(this._getResponse.bind(this, callback));
        };
        GlideRecord.prototype._getResponse = function (callback, response) {
            if (!response)
                return;
            this.next();
            callback(this);
        };
        GlideRecord.prototype.updateRecord = function (callback) {
            if (typeof callback !== 'function') {
                _logError('Q:NOCB', 'UpdateRecord must be called with a callback function');
                return;
            }
            var change = changedFields(this);
            return sendRequest('/api/now/ui/glideRecord/' +
                this.tableName +
                '/' +
                this.getValue('sys_id'), 'PUT', {
                headers: {
                    'X-WantSessionNotificationMessages': true,
                    'X-No-Response-Body': true
                },
                params: {
                    sysparm_display_value: true
                },
                body: change
            }).then(callback(this));
        };
        GlideRecord.prototype.deleteRecord = function (callback) {
            if (typeof callback !== 'function') {
                _logError('Q:NOCB', 'DeleteRecord must be called with a callback function');
                return;
            }
            return sendRequest('/api/now/ui/glideRecord/' +
                this.tableName +
                '/' +
                this.getValue('sys_id'), 'DELETE', {
                params: {},
                body: {}
            }).then(callback(this));
        };
        GlideRecord.prototype.addQuery = function (field, operator, value) {
            if (operator === void 0) { operator = "="; }
            var args = [];
            Array.prototype.push.apply(args, arguments);
            var name = args.shift();
            var oper = args.shift();
            var fieldValue = args.shift();
            this.conditions.push({ name: name, oper: oper, fieldValue: fieldValue });
        };
        GlideRecord.prototype.hasNext = function () {
            return this.currentRow + 1 < this.recordSet.length;
        };
        GlideRecord.prototype.next = function () {
            return this._next();
        };
        GlideRecord.prototype._next = function () {
            if (!this.hasNext())
                return false;
            this.loadRow(this.currentRow + 1);
            return true;
        };
        GlideRecord.prototype.loadRow = function (index) {
            var _this = this;
            this.currentRow = index;
            var currentRow = this.getCurrentRow();
            lodash_1.default.each(currentRow, function (value, key) {
                if (lodash_1.default.isObject(value))
                    value = value.value;
                // @ts-ignore
                _this[key] = value;
            });
        };
        GlideRecord.prototype._loadRecordSet = function (records) {
            this.recordSet = records || [];
        };
        GlideRecord.prototype.setEncodedQuery = function (queryString) {
            this.encodedQuery = queryString;
        };
        GlideRecord.prototype.getEncodedQuery = function () {
            var qc = [];
            var ec = this.encodedQuery;
            if (ec) {
                qc.push(ec);
            }
            this.conditions.forEach(function (q) {
                qc.push(q.name + q.oper + q.fieldValue);
            });
            return '^' + qc.join('^');
        };
        GlideRecord.prototype.orderBy = function (field) {
            this.addOrderBy(field);
        };
        GlideRecord.prototype.orderByDesc = function (field) {
            this.orderByDescFields.push(field);
        };
        GlideRecord.prototype.setLimit = function (maxRows) {
            this.limit = maxRows;
        };
        GlideRecord.prototype.getLimit = function () {
            return this.limit;
        };
        GlideRecord.prototype.setValue = function (fieldName, fieldValue) {
            changeValues[fieldName] = fieldValue;
        };
        GlideRecord.prototype.getValue = function (fieldName) {
            var current = this.getCurrentRow();
            return current && current[fieldName]
                ? current[fieldName].value : '';
        };
        GlideRecord.prototype.getDisplayValue = function (fieldName) {
            var current = this.getCurrentRow();
            if (!fieldName) {
                return current ? current['display_value'] : '';
            }
            else if (current && current[fieldName]) {
                return current[fieldName].display_value;
            }
            return '';
        };
        GlideRecord.prototype.getCurrentRow = function () {
            return this.recordSet[this.currentRow];
        };
        GlideRecord.prototype.getRowCount = function () {
            return this.recordSet.length;
        };
        GlideRecord.prototype.getTableName = function () {
            return this.tableName;
        };
        GlideRecord.prototype.toString = function () {
            return 'GlideRecord';
        };
        GlideRecord.prototype.addOrderBy = function (field) {
            this.orderByFields.push(field);
        };
        return GlideRecord;
    }());
}
exports.glideRecordFactory = glideRecordFactory;
