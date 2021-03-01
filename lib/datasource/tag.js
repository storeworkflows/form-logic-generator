"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createViewableRecordTagDataSource = exports.QUERY_FRAGMENT = exports.VIEWABLE_RECORD_TAGS = exports.VIEWABLE_TAG_QUERY_KEY = void 0;
var utils_1 = require("../utils");
exports.VIEWABLE_TAG_QUERY_KEY = "GlideViewableTagQuery_Query";
exports.VIEWABLE_RECORD_TAGS = "viewableRecordTags";
exports.QUERY_FRAGMENT = "\n        " + exports.VIEWABLE_TAG_QUERY_KEY + " {\n            " + exports.VIEWABLE_RECORD_TAGS + " (table: $table, sysId: $sysId) {\n                canCreateGlobalTags\n                enabled\n                records {\n                    name\n                    canEdit\n                    sysId\n                    viewableBy\n                    labelEntry\n                }\n            }\n        }";
var createTransform = function (getValueOrDefault) { return function (data) {
    var recordTags = getValueOrDefault(exports.VIEWABLE_RECORD_TAGS, {})(data);
    return {
        recordTags: recordTags
    };
}; };
var createViewableRecordTagDataSource = function (queryPrefix) {
    if (queryPrefix === void 0) { queryPrefix = ""; }
    var baseKey = "" + queryPrefix + exports.VIEWABLE_TAG_QUERY_KEY;
    var getValueOrDefault = utils_1.getValue(baseKey);
    var transform = createTransform(getValueOrDefault);
    return utils_1.createDataProviderDataSource({
        query: exports.QUERY_FRAGMENT,
        variables: ["table", "sysId"],
        transform: transform,
        props: {
            table: { default: "" },
            sysId: { default: "" }
        },
        selectableProps: {
            recordTags: {
                default: {}
            }
        }
    });
};
exports.createViewableRecordTagDataSource = createViewableRecordTagDataSource;
