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
exports.parseFieldGraphQLResponse = exports.parseCatalogFields = void 0;
var lodash_1 = __importDefault(require("lodash"));
/**
 * Create some data structures for fields and stuff
 * @param {Array} fieldValues
 * @param {Array} fieldElements
 * @param {Array} fieldStates
 */
function parseCatalogFields(fields, fieldValues, catalogFields, fieldStates) {
    try {
        lodash_1.default.forEach(catalogFields, function (fieldElement) {
            var name = fieldElement.name;
            if (fields[name]) {
                console.warn('Already defined field ! ');
                return;
            }
            // variables attributes are key value pairs separated by comma. ex: max_length=5,max_units=hours
            var attributes = lodash_1.default.get(fieldElement, 'variableAttributes', '')
                .split(',')
                .reduce(function (acc, attr) {
                var parts = attr.split('=', 2);
                if (parts.length > 0) {
                    var value = parts.length === 2 ? parts[1] : '';
                    acc[lodash_1.default.camelCase(parts[0])] = value;
                }
                return acc;
            }, {});
            var canWrite = lodash_1.default.get(fieldElement, 'canWrite', true);
            var canCreate = lodash_1.default.get(fieldElement, 'canCreate', true);
            var canRead = lodash_1.default.get(fieldElement, 'canRead', true);
            var readonly = lodash_1.default.get(fieldStates, [name, 'readonly'], false);
            var hidden = lodash_1.default.get(fieldStates, [name, 'hidden'], false);
            var mandatory = lodash_1.default.get(fieldStates, [name, 'mandatory'], false) ||
                lodash_1.default.get(fieldElement, 'mandatory', false);
            var field = lodash_1.default.assign({}, fieldElement, {
                canWrite: canWrite,
                sys_readonly: !canCreate || !canWrite,
                readonly: readonly || !canCreate || !canWrite,
                visible: !hidden && canRead,
                mandatory: mandatory,
                variable_name: fieldElement.variableName,
                _cat_variable: true /*Need this for gForm Operation*/,
                is_variable: true /*Need this for Save Operation*/,
                maxLength: attributes.maxLength,
                maxUnit: attributes.maxUnit
            }, fieldValues[name]);
            if (field.type === 'masked') {
                field.confirmationValue = field.value;
            }
            fields[name] = field;
        });
    }
    catch (exception) {
        console.log('Error while processing catalog elements', exception);
    }
}
exports.parseCatalogFields = parseCatalogFields;
function parseFieldGraphQLResponse(tableName, sysId, fieldValues, fieldElements, fieldStates, annotations) {
    if (fieldElements === void 0) { fieldElements = []; }
    if (fieldStates === void 0) { fieldStates = []; }
    if (annotations === void 0) { annotations = []; }
    var fields = {};
    if (!fieldValues) {
        // record not found or ACL says no sesame
        return fields;
    }
    fieldValues = fieldValues.reduce(function (values, fieldValue) {
        var o = {
            value: fieldValue.value,
            displayValue: fieldValue.displayValue
        };
        // For multi value fields like glide_list
        if (fieldValue.valuesList.length) {
            o.display_value_list = [];
            fieldValue.valuesList.forEach(function (item) {
                o.display_value_list.push(item.displayValue);
            });
        }
        else {
            o.valuesList = [];
            o.display_value_list = [];
        }
        values[fieldValue.name] = o;
        return values;
    }, {});
    try {
        // aggregate into fields object
        lodash_1.default.forEach(fieldElements, function (fieldElement) {
            var name = fieldElement.name, dictionary = fieldElement.dictionary;
            var fieldState = fieldStates[name] || {};
            var visible = fieldState.hidden !== true;
            // move values from dictionary to field
            var label = dictionary.label, type = dictionary.type, dependentField = dictionary.dependentField, dependentTable = dictionary.dependentTable, canWrite = dictionary.canWrite, isMandatory = dictionary.isMandatory, isReadonly = dictionary.isReadonly, sys_readonly = dictionary.sys_readonly;
            if (type === 'glide_var')
                return;
            var field = lodash_1.default.assign({}, fieldElement, {
                type: type,
                dictionary: dictionary,
                name: name,
                label: label,
                visible: visible,
                readonly: fieldState.readonly || false,
                mandatory: fieldState.mandatory || false,
                dependentField: dependentField,
                dependentTable: dependentTable,
                referringTable: tableName,
                referringRecordId: sysId
            }, fieldValues[name]);
            switch (field.type) {
                case 'journal_input':
                    // @note: clearing the display value since the display value is the journal history
                    field = Object.assign(field, {
                        displayValue: ''
                    });
                    break;
                case 'currency':
                case 'currency2':
                case 'price': {
                    var value = fieldElement.value, code = fieldElement.code, defaultCurrency = fieldElement.defaultCurrency, currencyCodes = fieldElement.currencyCodes;
                    field = Object.assign(field, {
                        value: value,
                        code: code,
                        defaultCurrency: defaultCurrency,
                        currencyCodes: currencyCodes
                    });
                    break;
                }
                case 'phone_number_e164': {
                    var value = fieldElement.value, country = fieldElement.country, countryCodes = fieldElement.countryCodes;
                    field = Object.assign(field, {
                        value: value,
                        country: country,
                        countryCodes: countryCodes
                    });
                    break;
                }
                case 'file_attachment': {
                    var state = fieldElement.state, contentType = fieldElement.contentType;
                    field = Object.assign(field, {
                        state: state,
                        contentType: contentType
                    });
                    break;
                }
                case 'table_name': {
                    var displayValue = fieldElement.displayValue;
                    field = Object.assign(field, {
                        displayValue: displayValue
                    });
                }
                case 'glide_list':
                case 'reference': {
                    var isReferenceScriptableTable = fieldElement.isReferenceScriptableTable, referenceError = fieldElement.referenceError;
                    var messages = isReferenceScriptableTable
                        ? [{ type: 'error', message: referenceError }]
                        : [];
                    field = __assign(__assign({}, field), { messages: __spreadArray(__spreadArray([], (field.messages || [])), messages) });
                    break;
                }
                case 'variables':
                    parseCatalogFields(fields, fieldValues, fieldElement['variables'], fieldStates);
                    break;
            }
            // ACLs and dictionary attributes have final say in field props
            field.sys_readonly = sys_readonly;
            if (!canWrite)
                field.readonly = true;
            if (isReadonly)
                field.readonly = true;
            if (isMandatory)
                field.mandatory = true;
            fields[name] = field;
        });
    }
    catch (e) {
        console.log('Error while processing fields', e);
    }
    //annotation is not a GlideElement type and
    //does not have all the dictionary values other types have
    Object.assign(fields, annotations);
    return fields;
}
exports.parseFieldGraphQLResponse = parseFieldGraphQLResponse;
exports.default = {
    parseFieldGraphQLResponse: parseFieldGraphQLResponse
};
