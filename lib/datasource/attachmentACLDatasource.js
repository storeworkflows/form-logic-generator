"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAttachmentAclDataSource = void 0;
var utils_1 = require("../utils");
var ATTACHMENT_ACL_QUERY_KEY = 'GlideAttachmentQuery_Query';
var ATTACHMENT_ACL_ATTACHMENTS_KEY = 'attachments';
var QUERY_FRAGMENT = "\n\t" + ATTACHMENT_ACL_QUERY_KEY + " {\n\t\t" + ATTACHMENT_ACL_ATTACHMENTS_KEY + " (table: $table, sysId: $sysId) {\n\t\t\tcanCreate\n\t\t}\n\t}\n";
var createTransform = function (getValueOrDefault) { return function (data) {
    var canCreate = getValueOrDefault('canCreate', false)(data);
    return {
        canCreate: canCreate
    };
}; };
var createAttachmentAclDataSource = function (queryPrefix) {
    if (queryPrefix === void 0) { queryPrefix = ''; }
    var baseKey = "" + queryPrefix + ATTACHMENT_ACL_QUERY_KEY + "." + ATTACHMENT_ACL_ATTACHMENTS_KEY;
    var getValueOrDefault = utils_1.getValue(baseKey);
    var transform = createTransform(getValueOrDefault);
    return utils_1.createDataProviderDataSource({
        query: QUERY_FRAGMENT,
        variables: ['table', 'sysId'],
        transform: transform,
        props: {
            table: { default: '' },
            sysId: { default: '' }
        },
        selectableProps: {
            canCreate: {
                default: {}
            }
        }
    });
};
exports.createAttachmentAclDataSource = createAttachmentAclDataSource;
