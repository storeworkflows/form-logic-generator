"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = __importDefault(require("lodash"));
var uiPolicyParser = {
    parseGraphQLResponse: parseGraphQLResponse,
    parseGraphQLPolicy: parseGraphQLPolicy,
    parseGraphQLPolicyActions: parseGraphQLPolicyActions,
    parseGraphQLPolicyListActions: parseGraphQLPolicyListActions,
    parseGraphQLPolicyConditions: parseGraphQLPolicyConditions
};
function convertFields(o) {
    var result = {};
    lodash_1.default.forEach(o, function (val, key) {
        result[lodash_1.default.snakeCase(key)] = val;
    });
    delete result.typename;
    return result;
}
function parseGraphQLPolicyActions(actions) {
    var results = [];
    lodash_1.default.forEach(actions, function (action) {
        if (action.name !== null) {
            var result = convertFields(action);
            results.push(result);
        }
    });
    return results;
}
function parseGraphQLPolicyListActions(actions) {
    var results = [];
    lodash_1.default.forEach(actions, function (action) {
        if (action.relatedList !== null) {
            results.push({
                name: action.relatedList,
                visible: action.visible
            });
        }
    });
    return results;
}
function parseGraphQLPolicyConditions(conditions) {
    var results = [];
    lodash_1.default.forEach(conditions, function (condition) {
        var result = convertFields(condition);
        // Remap some field values
        result.pre_evaluated_term =
            String(result.pre_evaluated_term) === 'true';
        result.pre_evaluated_term_result =
            String(result.pre_evaluated_term_result) === 'true';
        // ignore endquery for now
        if (result.term !== 'EQ') {
            results.push(result);
        }
    });
    return results;
}
function parseGraphQLPolicy(policy) {
    var result = convertFields(policy);
    result.actions = parseGraphQLPolicyActions(policy.actions);
    result.list_actions = parseGraphQLPolicyListActions(policy.actions);
    result.conditions = parseGraphQLPolicyConditions(policy.conditions);
    result.onload = result.on_load;
    result.script_true = policy.scriptTrue;
    result.script_false = policy.scriptFalse;
    return result;
}
function parseGraphQLResponse(uiPolicies) {
    var results = [];
    lodash_1.default.forEach(uiPolicies, function (policy) {
        results.push(uiPolicyParser.parseGraphQLPolicy(policy));
    });
    return results;
}
exports.default = uiPolicyParser;
