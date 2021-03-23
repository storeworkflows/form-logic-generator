"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFieldValidatorDataSource = exports.QUERY_FRAGMENT = exports.VALIDATION_SCRIPTS_KEY = exports.FIELD_VALIDATOR_KEY = exports.FIELD_VALIDATOR_QUERY_KEY = void 0;
var utils_1 = require("../utils");
exports.FIELD_VALIDATOR_QUERY_KEY = 'GlideFieldValidator_Query';
exports.FIELD_VALIDATOR_KEY = 'validators';
exports.VALIDATION_SCRIPTS_KEY = 'validationScripts';
exports.QUERY_FRAGMENT = "\n" + exports.FIELD_VALIDATOR_QUERY_KEY + " {\n\t" + exports.FIELD_VALIDATOR_KEY + "(table: $table, sysId: $sysId, view: $view) {\n\t\tvalidationScripts {\n\t\t\tinternalType\n\t\t\tscript:validator\n\t\t\tdescription\n\t\t\tfields\n\t\t}\n\t}\n}";
var createTransform = function (getValueOrDefault) { return function (data) {
    var scripts = getValueOrDefault(exports.VALIDATION_SCRIPTS_KEY, [])(data);
    return {
        fieldValidators: scripts
    };
}; };
var createFieldValidatorDataSource = function (queryPrefix) {
    if (queryPrefix === void 0) { queryPrefix = ''; }
    var baseKey = "" + queryPrefix + exports.FIELD_VALIDATOR_QUERY_KEY + "." + exports.FIELD_VALIDATOR_KEY;
    var getValueOrDefault = utils_1.getValue(baseKey);
    var transform = createTransform(getValueOrDefault);
    return utils_1.createDataProviderDataSource({
        query: exports.QUERY_FRAGMENT,
        variables: ['table', 'sysId', 'view'],
        transform: transform,
        props: {
            table: { default: '' },
            sysId: { default: '' },
            view: { default: '' }
        },
        selectableProps: {
            fieldValidators: {
                default: {}
            }
        }
    });
};
exports.createFieldValidatorDataSource = createFieldValidatorDataSource;
