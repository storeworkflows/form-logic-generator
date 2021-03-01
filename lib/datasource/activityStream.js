"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createActivityStreamDataSource = exports.QUERY_FRAGMENT = exports.GET_STREAM = exports.TIMESTAMP_KEY = exports.FIELDS_KEY = exports.ENTRIES_KEY = exports.ACTIVITY_QUERY_KEY = void 0;
var utils_1 = require("../utils");
var lodash_1 = __importDefault(require("lodash"));
var ACTIVITY_STREAM_INNER_SCHEMA = "\nsysTimestamp\nisDelta\nentries {\n\ttype\n\tsysCreatedOnAdjusted\n\tsysCreatedBy\n\tuserImage\n\tinitials\n\tfieldColor\n\tsysId: uid\n\tentryItem {\n\t\t... on GlideActivity_AuditType {\n\t\t\tauditValues {\n\t\t\t\tfieldLabel\n\t\t\t\tnewValue\n\t\t\t\toldValue\n\t\t\t\thtmlNewValue\n\t\t\t\thtmlOldValue\n\t\t\t\ttype\n\t\t\t}\n\t\t\t__typename\n\t\t}\n\t\t... on GlideActivity_JournalType {\n\t\t\tfieldLabel\n\t\t\tfieldName\n\t\t\tsanitizeHtmlValue\n\t\t\t__typename\n\t\t}\n\t\t... on GlideActivity_AttachmentType {\n\t\t\tsysId\n\t\t\tfileName\n\t\t\tstate\n\t\t\tdownloadPath\n\t\t\timagePath\n\t\t\tsizeBytes\n\t\t\tcontentType\n\t\t\textension\n\t\t\t__typename\n\t\t}\n\t\t... on GlideActivity_EmailType {\n\t\t\tfields {\n\t\t\t\tsubject\n\t\t\t\tuser\n\t\t\t\trecipients\n\t\t\t\tcopied\n\t\t\t\ttype\n\t\t\t}\n\t\t\tdisplayPath\n\t\t\t__typename\n\t\t}\n\t}\n}\n";
var ACTIVITY_STREAM_FILTER_INNER_SCHEMA = "\nfields {\n\tisSelected:active\n\tlabel\n\tname\n}\n";
function getQueryFragments() {
    return "\n\t" + ACTIVITY_STREAM_INNER_SCHEMA + "\n\t" + ACTIVITY_STREAM_FILTER_INNER_SCHEMA + "\n\t";
}
exports.ACTIVITY_QUERY_KEY = 'GlideActivity_Query';
exports.ENTRIES_KEY = 'entries';
exports.FIELDS_KEY = 'fields';
exports.TIMESTAMP_KEY = 'sysTimestamp';
exports.GET_STREAM = 'getStream';
exports.QUERY_FRAGMENT = "\n" + exports.ACTIVITY_QUERY_KEY + " {\n\t" + exports.GET_STREAM + "(table: $table, sysId: $sysId, view: $view) {\n\t\t" + getQueryFragments() + "\n\t}\n}\n";
var createTransform = function (getValueOrDefault) { return function (data) {
    var stream = getValueOrDefault(exports.GET_STREAM, null)(data);
    var entries = getValueOrDefault(exports.GET_STREAM + "." + exports.ENTRIES_KEY, [])(data);
    var visible = !lodash_1.default.isNull(stream);
    var filterOptions = getValueOrDefault(exports.GET_STREAM + "." + exports.FIELDS_KEY, [])(data);
    var timestamp = getValueOrDefault(exports.GET_STREAM + "." + exports.TIMESTAMP_KEY, '')(data);
    return {
        entries: entries,
        visible: visible,
        filterOptions: filterOptions,
        timestamp: timestamp
    };
}; };
var createActivityStreamDataSource = function (queryPrefix) {
    if (queryPrefix === void 0) { queryPrefix = ''; }
    var baseKey = "" + queryPrefix + exports.ACTIVITY_QUERY_KEY;
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
            entries: {
                default: []
            },
            filterOptions: {
                default: []
            },
            visible: {
                default: false
            },
            timestamp: {}
        }
    });
};
exports.createActivityStreamDataSource = createActivityStreamDataSource;
