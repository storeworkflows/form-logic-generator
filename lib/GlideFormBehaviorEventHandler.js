"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = __importDefault(require("lodash"));
var Status_enum_1 = __importDefault(require("./enum/Status.enum"));
var PROPERTY;
(function (PROPERTY) {
    PROPERTY["FORM"] = "FORM";
    PROPERTY["FIELD"] = "FIELD";
    PROPERTY["SECTION"] = "SECTION";
    PROPERTY["RELATED_LIST"] = "RELATED_LIST";
})(PROPERTY || (PROPERTY = {}));
var GlideFormBehaviorEventHandler = /** @class */ (function () {
    function GlideFormBehaviorEventHandler(formData, setState, fetchFormDataActions) {
        var _this = this;
        this._updateState = function (newState) {
            _this.state = newState;
            console.log({ newState: newState, setState: _this.setState });
            _this.setState(_this.state);
        };
        this.formData = formData;
        this.state = formData;
        this.setState = setState;
        this.fetchFormDataActions = fetchFormDataActions;
        this.onStateChange = this.onStateChange.bind(this);
        this.updatingState = this.updatingState.bind(this);
        this.handleRecordStatusChanged = this.handleRecordStatusChanged.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onPropChange = this.onPropChange.bind(this);
    }
    GlideFormBehaviorEventHandler.prototype.copyObjectAtIndex = function (array, object, index) {
        return __spreadArray(__spreadArray(__spreadArray([], array.slice(0, index)), [
            lodash_1.default.cloneDeep(object)
        ]), array.slice(index + 1));
    };
    GlideFormBehaviorEventHandler.prototype.operationToStatus = function (operation) {
        switch (operation) {
            case 'insert':
                return Status_enum_1.default.INSERTED;
            case 'update':
                return Status_enum_1.default.UPDATED;
            case 'delete':
                return Status_enum_1.default.DELETED;
            default:
                return operation;
        }
    };
    GlideFormBehaviorEventHandler.prototype.updatingState = function (stateName, matchCallBack, payload) {
        var _a;
        var items = this.state[stateName];
        var index = items.findIndex(matchCallBack);
        if (index === -1) {
            return;
        }
        var item = items[index];
        var updatedItem = __assign(__assign({}, item), payload);
        this._updateState(__assign(__assign({}, this.state), (_a = {}, _a[stateName] = this.copyObjectAtIndex(items, updatedItem, index), _a)));
    };
    GlideFormBehaviorEventHandler.prototype.handleRecordStatusChanged = function (status, table, sysId) {
        if ([Status_enum_1.default.DELETED, Status_enum_1.default.INSERTED, Status_enum_1.default.UPDATED].includes(this.prevRecordStatus))
            return;
        var payload = {
            table: table,
            sys_id: sysId,
            status: status
        };
        if (status === Status_enum_1.default.INSERTED ||
            status === Status_enum_1.default.UPDATED)
            payload = __assign(__assign({}, payload), { query: '' });
        if (status !== Status_enum_1.default.LIVEUPDATED) {
            this.prevRecordStatus = status;
        }
        if ([Status_enum_1.default.UNMODIFIED, Status_enum_1.default.MODIFIED].includes(status))
            this._updateState(__assign(__assign({}, this.state), { isDirty: status === Status_enum_1.default.MODIFIED }));
    };
    GlideFormBehaviorEventHandler.prototype.onChange = function (changedFields) {
        var gFormFields = this.formData.layout.formFieldValues;
        var updatedFields = Object.keys(changedFields).reduce(function (fields, fieldName) {
            fields[fieldName] = lodash_1.default.cloneDeep(gFormFields[fieldName]);
            return updatedFields;
        }, {});
        this._updateState(__assign(__assign({}, this.state), { layout: __assign(__assign({}, this.state.layout), { formFieldValues: __assign(__assign({}, this.state.layout.formFieldValues), updatedFields) }) }));
    };
    GlideFormBehaviorEventHandler.prototype.onPropChange = function (type, name, propName, value) {
        var _a, _b;
        switch (type) {
            case PROPERTY.SECTION: {
                this._updateState(__assign(__assign({}, this.state), { layout: __assign(__assign({}, this.state.layout), { sections: this.state.layout.sections.map(function (section) {
                            if (section.caption === name) {
                                section[propName] = value;
                            }
                            return section;
                        }) }) }));
                break;
            }
            case PROPERTY.FORM:
                if (propName === 'messages') {
                    this._updateState(__assign(__assign({}, this.state), { layout: __assign(__assign({}, this.state.layout), { formFieldValues: lodash_1.default.cloneDeep(this.state.layout.formFieldValues) }) }));
                }
                break;
            case PROPERTY.FIELD: {
                this._updateState(__assign(__assign({}, this.state), { layout: __assign(__assign({}, this.state.layout), { fieldStates: __assign(__assign({}, this.state.layout.fieldStates), (_a = {}, _a[name] = __assign(__assign({}, this.state.layout.fieldStates[name]), (_b = {}, _b[propName] = value, _b)), _a)) }) }));
                break;
            }
        }
    };
    GlideFormBehaviorEventHandler.prototype.onStateChange = function (oldState, newState) {
        console.log("GlideFormBehavior", oldState, newState);
        var _a = this.formData.record, table = _a.table, sysId = _a.sysId;
        this.handleRecordStatusChanged(newState, table, sysId);
    };
    ;
    return GlideFormBehaviorEventHandler;
}());
exports.default = GlideFormBehaviorEventHandler;
