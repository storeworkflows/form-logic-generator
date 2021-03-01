"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDataLookupDataSource = exports.createDataLookup = exports.CATALOG_DATA_LOOKUP_QUERY_FRAGMENT = exports.CATALOG_DATALOOKUP_FIELDS_KEY = void 0;
var utils_1 = require("../utils");
exports.CATALOG_DATALOOKUP_FIELDS_KEY = 'catalogDataLookup';
exports.CATALOG_DATA_LOOKUP_QUERY_FRAGMENT = "\n" + exports.CATALOG_DATALOOKUP_FIELDS_KEY + "(targetTable: $table, targetId: $sysId) {\n  fields {\n    field\n        definitions {\n            name\n            sysId\n        }\n  }\n}\n";
/**
 * DataLookup processes a list of fields that have DataLookup definitions (table: dl_definition)
 * defined for that table/field combination.  The customer can create a table that acts as a
 * decision matrix, setting values based on current form field values
 */
/**
 * Initialize DataLookup, transforming the list of fields into an object, and binding the
 * on change handler.
 *
 * @param gForm {Object}
 * @param fields {Array}
 * @param encodedRecord {String}
 */
function createDataLookup(gForm, fields, sendRequest, encodedRecord) {
    if (!gForm) {
        console.log('g_form is not defined');
        return;
    }
    if (fields.length === 0) {
        console.log("No DataLookup definitions found for " + gForm.getTableName() + " table");
        return;
    }
    var dataLookupInProgress = false;
    var lastSerializedForm = null;
    var dataLookupFields = fields.reduce(function (o, item) {
        o[item.field] = item;
        return o;
    }, {});
    /**
     * Send a request for DataLookup a DataLookup Definition, setting a form value
     * if all the criteria has been met.
     *
     * @param item {Object}
     */
    function _sendRequest(item) {
        return sendRequest("/api/now/ui/datalookup/" + item.sysId, 'POST', {
            params: {
                sysparm_table: gForm.getTableName(),
                sysparm_sys_id: gForm.isNewRecord() ? '-1' : gForm.getSysId()
            },
            body: {
                fields: gForm.serialize(),
                encoded_record: encodedRecord || ''
            }
        }).then(function (response) {
            if (!response.data.result)
                return;
            dataLookupInProgress = true;
            response.data.result.forEach(function (element) {
                gForm.setValue(element.name, element.value, element.displayValue);
            });
            dataLookupInProgress = false;
        }, function (response) {
            console.error("Error processing DataLookup Definition " + item.name, response);
        });
    }
    /**
     * Process a field that has a DataLookup definition defined.  There are built in safeguards to prevent
     * DataLookup definitions triggering themselves, and we count the transactions that we have sent
     * to only process the most recent for that field.
     *
     * @param fieldName {String}
     * @param oldValue {String}
     * @param newValue {String}
     * @param isLoading {boolean}
     */
    function _process(fieldName, oldValue, newValue, isLoading) {
        if (isLoading || !dataLookupFields[fieldName] || dataLookupInProgress) {
            return;
        }
        var serializedForm = gForm.serialize();
        if (!serializedForm || lastSerializedForm === serializedForm) {
            return;
        }
        dataLookupFields[fieldName].definitions.forEach(function (item) {
            lastSerializedForm = serializedForm;
            _sendRequest(item);
        });
    }
    return {
        initialize: function () {
            gForm.$private.events.on('change', _process);
        }
    };
}
exports.createDataLookup = createDataLookup;
var DATALOOKUP_QUERY_KEY = 'GlideDataLookupQuery_Query';
var DATALOOKUP_CONFIG_KEY = 'dataLookup';
var DATALOOKUP_FIELDS_KEY = 'fields';
var QUERY_FRAGMENT = "\n" + DATALOOKUP_QUERY_KEY + " {\n\t" + DATALOOKUP_CONFIG_KEY + "(table: $table) {\n\t\tfields {\n\t\t\tfield\n        \tdefinitions {\n          \t\tname\n          \t\tsysId\n        \t}\n\t\t}\n\t}\n\t" + exports.CATALOG_DATA_LOOKUP_QUERY_FRAGMENT + "\n}\n";
var createTransform = function (getValueOrDefault) { return function (data) {
    var formFields = getValueOrDefault(DATALOOKUP_CONFIG_KEY + "." + DATALOOKUP_FIELDS_KEY, [])(data);
    var catalogFields = getValueOrDefault(exports.CATALOG_DATALOOKUP_FIELDS_KEY + "." + DATALOOKUP_FIELDS_KEY, [])(data);
    var fields = __spreadArray(__spreadArray([], (formFields || [])), (catalogFields || []));
    return {
        fields: fields
    };
}; };
var createDataLookupDataSource = function (queryPrefix) {
    if (queryPrefix === void 0) { queryPrefix = ''; }
    var baseKey = "" + queryPrefix + DATALOOKUP_QUERY_KEY;
    var getValueOrDefault = utils_1.getValue(baseKey);
    var transform = createTransform(getValueOrDefault);
    return utils_1.createDataProviderDataSource({
        query: QUERY_FRAGMENT,
        variables: ['table'],
        transform: transform,
        props: {
            table: { default: '' }
        },
        selectableProps: {
            fields: {
                default: {}
            }
        }
    });
};
exports.createDataLookupDataSource = createDataLookupDataSource;
