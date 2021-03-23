"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSpecialHandlingNoteDataSource = exports.QUERY_FRAGMENT = exports.SHN_TOTAL_MSGS_KEY = exports.SHN_ENABLE_KEY = exports.SHN_QUERY_KEY = void 0;
var utils_1 = require("../utils");
exports.SHN_QUERY_KEY = 'GlideSHN_Query';
exports.SHN_ENABLE_KEY = 'isSHNEnabled';
exports.SHN_TOTAL_MSGS_KEY = 'totalMsg';
exports.QUERY_FRAGMENT = "\n" + exports.SHN_QUERY_KEY + "(table: $table, sys_id: $sysId) {\n\t" + exports.SHN_ENABLE_KEY + ",\n\t" + exports.SHN_TOTAL_MSGS_KEY + "\n}\n";
var createTransform = function (getValueOrDefault) { return function (data) {
    var shnEnabled = getValueOrDefault('isSHNEnabled', false)(data);
    var totalMsg = getValueOrDefault(exports.SHN_TOTAL_MSGS_KEY, 0)(data);
    var enabled = shnEnabled && totalMsg > 0;
    return {
        enabled: enabled
    };
}; };
var createSpecialHandlingNoteDataSource = function (queryPrefix) {
    if (queryPrefix === void 0) { queryPrefix = ''; }
    var baseKey = "" + queryPrefix + exports.SHN_QUERY_KEY;
    var getValueOrDefault = utils_1.getValue(baseKey);
    var transform = createTransform(getValueOrDefault);
    return utils_1.createDataProviderDataSource({
        query: exports.QUERY_FRAGMENT,
        variables: ['table', 'sysId'],
        transform: transform,
        props: {
            table: { default: '' },
            sysId: { default: '' }
        },
        selectableProps: {
            shnEnabled: {
                default: false
            }
        }
    });
};
exports.createSpecialHandlingNoteDataSource = createSpecialHandlingNoteDataSource;
