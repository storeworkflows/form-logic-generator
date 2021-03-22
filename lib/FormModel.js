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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
var graphqlRequest_1 = __importDefault(require("./graphqlRequest/graphqlRequest"));
var Globals_1 = __importDefault(require("./Globals"));
var lodash_1 = __importDefault(require("lodash"));
var FormTemplate_1 = require("./constants/FormTemplate");
var dataSource_1 = require("./utils/dataSource");
var constants_1 = require("./constants");
var http_1 = require("./utils/http");
var GlideFormBehaviorEventHandler_1 = __importDefault(require("./GlideFormBehaviorEventHandler"));
var PlatformResource_1 = __importDefault(require("./PlatformResource"));
var FormModel = /** @class */ (function () {
    function FormModel() {
        this._template = "query($table: String!, $sysId: String!, $views: String!, $query: String!, $workspaceConfigId: String) {\n\t\t\t\t\t\tGlideRecordDomainQuery_Query {\n\t\t\t\t\t\t\tuiDomain(table: $table, sysId: $sysId, query: $query) {\n\t\t\t\t\t\t\t\ttableDisplayValue\n\t\t\t\t\t\t\t\trecordValues {\n\t\t\t\t\t\t\t\t\tname\n\t\t\t\t\t\t\t\t\tvalue\n\t\t\t\t\t\t\t\t\tdisplayValue\n\t\t\t\t\t\t\t\t\tvaluesList {\n\t\t\t\t\t\t\t\t\t  value\n\t\t\t\t\t\t\t\t\t  displayValue\n\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\tdomainElementData {\n\t\t\t\t\t\t\t\t\tdictionaryData {\n\t\t\t\t\t\t\t\t\t\tlabel\n\t\t\t\t\t\t\t\t\t\tname\n\t\t\t\t\t\t\t\t\t\tinternalType\n\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t... on GlideRecordDomainQuery_ReferenceElementType {\n\t\t\t\t\t\t\t\t\t\treference\n\t\t\t\t\t\t\t\t\t\tuseReferenceQualifier\n\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\t\t\t\t\t\tGlideViewQuery_Query {\n\t\t\t\t\t\t\tuiView(table: $table, views: $views, sysId: $sysId, workspaceConfigId: $workspaceConfigId, query: $query) {\n\t\t\t\t\t\t\t\tisWhitelistedForEdit\n\t\t\t\t\t\t\t\tview\n\t\t\t\t\t\t\t\tglideLayoutItem(table: $table, sysId: $sysId, query: $query) {\n\t\t\t\t\t\t\t\t\t_query {\n\t\t\t\t\t\t\t\t\t\t" + FormTemplate_1.GlideClientScriptingEnvironmentQueryFragment + "\n\t\t\t\t\t\t\t\t\t\t" + FormTemplate_1.UIActionQueryFragment + "\n\t\t\t\t\t\t\t\t\t\t" + FormTemplate_1.LayoutQueryFragment + "\n\t\t\t\t\t\t\t\t\t\t" + FormTemplate_1.UserQueryFragment + "\n\t\t\t\t\t\t\t\t\t\t" + FormTemplate_1.DataLookupFragment + "\n\t\t\t\t\t\t\t\t\t\t" + FormTemplate_1.SessionMessageFragment + "\n\t\t\t\t\t\t\t\t\t\t" + FormTemplate_1.AttachmentAclQueryFragment + "\n\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\t\t\t\t\t}";
    }
    FormModel.prototype.isReadonly = function (state, view, isWhitelistedForEdit) {
        if (state === void 0) { state = {}; }
        if (isWhitelistedForEdit === void 0) { isWhitelistedForEdit = false; }
        var _a = state.properties, _b = _a === void 0 ? {} : _a, _c = _b.readOnlyForm, readOnlyForm = _c === void 0 ? false : _c;
        return ((!isWhitelistedForEdit) ||
            readOnlyForm ||
            false);
    };
    ;
    FormModel.prototype.getRecordValueProps = function (recordValues, fieldName) {
        var recordValue = recordValues.find(function (record) { return record.name === fieldName; });
        return {
            value: recordValue ? recordValue.value : '',
            displayValue: recordValue ? recordValue.displayValue : '',
            valuesList: recordValue && recordValue.valuesList ? recordValue.valuesList : [],
            display_value_list: recordValue && recordValue.valuesList
                ? recordValue.valuesList.map(function (value) { return value.displayValue; })
                : []
        };
    };
    FormModel.prototype.getUiDomain = function (data, referringTable, referringRecordId) {
        var _this = this;
        var uiDomain = lodash_1.default.get(data, 'GlideRecordDomainQuery_Query.uiDomain') || {};
        var tableDisplayValue = uiDomain.tableDisplayValue, domainElementData = uiDomain.domainElementData, recordValues = uiDomain.recordValues;
        if (lodash_1.default.isEmpty(domainElementData))
            return null;
        var fields = domainElementData
            .filter(function (elm) { return elm && elm.dictionaryData; })
            .map(function (elm, index) {
            var _a = elm.dictionaryData, label = _a.label, name = _a.name, internalType = _a.internalType, reference = elm.reference;
            return __assign(__assign({ name: name,
                label: label }, _this.getRecordValueProps(recordValues, name)), { reference: reference,
                referringTable: referringTable,
                referringRecordId: referringRecordId, type: 'domain_id' === internalType ? 'reference' : internalType, mandatory: index == 0 });
        });
        return {
            tableDisplayValue: tableDisplayValue,
            fields: fields
        };
    };
    ;
    FormModel.prototype.updatingProperties = function (data, state, properties) {
        try {
            var table = properties.table, sysId = properties.sysId, views = properties.views, query = properties.query, readOnlyForm = properties.readOnlyForm, active = properties.active, defaultTab = properties.defaultTab, hideDetails = properties.hideDetails, workspaceConfigId = properties.workspaceConfigId;
            var dataSources_1 = dataSource_1.getDataSourcesForForm();
            var computedView = lodash_1.default.get(data, 'GlideViewQuery_Query.uiView.view');
            var isWhitelistedForEdit = lodash_1.default.get(data, 'GlideViewQuery_Query.uiView.isWhitelistedForEdit');
            var uiDomain = this.getUiDomain(data, table, sysId);
            var trueTable = table;
            var record = {
                table: table,
                sysId: sysId,
                views: views,
                query: query,
                view: computedView,
                trueTable: trueTable,
                isWhitelistedForEdit: isWhitelistedForEdit
            };
            var isFormReadonly = this.isReadonly(state, computedView, isWhitelistedForEdit);
            var isMissingWorkspaceView = isFormReadonly && !readOnlyForm && !isWhitelistedForEdit;
            // clear the data fetchers
            var newState_1 = __assign(__assign({}, state), { record: record,
                isFormReadonly: isFormReadonly });
            var configurationItems_1 = [];
            var update = Object.keys(dataSources_1).reduce(function (update, name) {
                var _a;
                var updatedData = name === constants_1.DATASOURCE_NAMES.formLayout
                    ? dataSources_1[name].transform(data, newState_1, properties, (update.declarativeUIActions || {})
                        .declarativeFieldActions)
                    : dataSources_1[name].transform(data, newState_1, properties);
                if (updatedData.configurationItems || updatedData.configurationItem)
                    configurationItems_1 = __spreadArray(__spreadArray([], configurationItems_1), (updatedData.configurationItems || [
                        updatedData.configurationItem
                    ]));
                return __assign(__assign({}, update), (_a = {}, _a[name] = updatedData, _a));
            }, {});
            configurationItems_1 = lodash_1.default.orderBy(configurationItems_1, ['order']);
            return {
                formData: __assign({ isReadOnly: isFormReadonly, isMissingWorkspaceView: isMissingWorkspaceView,
                    uiDomain: uiDomain, record: __assign(__assign({}, record), { sys_id: update[constants_1.DATASOURCE_NAMES.formLayout].sysId }), workspaceConfigId: workspaceConfigId ||
                        lodash_1.default.get(state, 'behaviors.wsConfigSysId', '') }, update),
                configurationItems: configurationItems_1
            };
        }
        catch (error) {
            console.error(error);
        }
    };
    ;
    FormModel.prototype.load = function (variables, id, setState) {
        return __awaiter(this, void 0, void 0, function () {
            var fetch_1, response, data, _a, formData, configurationItems, globals_1, gEnv, gForm, gUser, gUIActions, _b, fields, sections, isNewRecord, isValidRecord, formModel, error_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, new PlatformResource_1.default().load(id)];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, graphqlRequest_1.default({
                                operationName: "",
                                query: this._template,
                                variables: variables
                            })];
                    case 2:
                        fetch_1 = _c.sent();
                        return [4 /*yield*/, fetch_1.json()];
                    case 3:
                        response = _c.sent();
                        data = lodash_1.default.get(response, "[0].data");
                        _a = this.updatingProperties(data, __assign(__assign({}, variables), { properties: __assign({}, variables) }), __assign({}, variables)), formData = _a.formData, configurationItems = _a.configurationItems;
                        globals_1 = Globals_1.default.get(id);
                        return [4 /*yield*/, globals_1.glideEnvPromise];
                    case 4:
                        gEnv = _c.sent();
                        gEnv.configureWithOptions({
                            data: formData,
                            formModal: {},
                            sendRequest: http_1.sendRequestFactory(),
                            reloadForm: function () { return ""; },
                            domainScope: {}
                        });
                        globals_1.eventHandler = new GlideFormBehaviorEventHandler_1.default(formData, setState, {});
                        gEnv.onStateChange(globals_1.eventHandler.onStateChange);
                        gEnv.onFormSubmit(function (submitResult) {
                            // need to clean up liveUpdate immediately
                            if (globals_1.liveUpdate) {
                                globals_1.liveUpdate.liveUpdate.destroy();
                                globals_1[id].liveUpdate = null;
                            }
                            globals_1.eventHandler.onFormSubmit(submitResult);
                        });
                        gEnv.onChange(globals_1.eventHandler.onChange);
                        gEnv.onPropChange(globals_1.eventHandler.onPropChange);
                        gEnv.onLiveUpdated(globals_1.eventHandler.onLiveUpdated);
                        gEnv.initialize();
                        gForm = gEnv.gForm, gUser = gEnv.gUser, gUIActions = gEnv.gUIActions;
                        _b = formData.layout, fields = _b.formFieldValues, sections = _b.sections, isNewRecord = _b.isNewRecord, isValidRecord = _b.isValidRecord;
                        formModel = {
                            gForm: gForm, gUser: gUser, gUIActions: gUIActions, fields: fields, sections: sections, isNewRecord: isNewRecord, isValidRecord: isValidRecord
                        };
                        console.log(formModel);
                        setState(formModel);
                        return [3 /*break*/, 6];
                    case 5:
                        error_1 = _c.sent();
                        console.error(error_1);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    return FormModel;
}());
exports.default = FormModel;
