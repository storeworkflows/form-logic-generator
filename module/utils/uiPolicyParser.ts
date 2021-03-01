import _ from 'lodash';

const uiPolicyParser = {
    parseGraphQLResponse,
    parseGraphQLPolicy,
    parseGraphQLPolicyActions,
    parseGraphQLPolicyListActions,
    parseGraphQLPolicyConditions
};

function convertFields(o: any) {
    let result: any = {};
    _.forEach(o, (val, key) => {
        result[_.snakeCase(key)] = val;
    });
    delete result.typename;
    return result;
}

function parseGraphQLPolicyActions(actions: any) {
    let results: any = [];
    _.forEach(actions, action => {
        if (action.name !== null) {
            let result = convertFields(action);
            results.push(result);
        }
    });
    return results;
}

function parseGraphQLPolicyListActions(actions: any) {
    let results: any = [];
    _.forEach(actions, action => {
        if (action.relatedList !== null) {
            results.push({
                name: action.relatedList,
                visible: action.visible
            });
        }
    });
    return results;
}

function parseGraphQLPolicyConditions(conditions: any) {
    let results: any = [];
    _.forEach(conditions, (condition: any) => {
        let result: any = convertFields(condition);
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

function parseGraphQLPolicy(policy: any) {
    let result: any = convertFields(policy);
    result.actions = parseGraphQLPolicyActions(policy.actions);
    result.list_actions = parseGraphQLPolicyListActions(policy.actions);
    result.conditions = parseGraphQLPolicyConditions(policy.conditions);
    result.onload = result.on_load;
    result.script_true = policy.scriptTrue;
    result.script_false = policy.scriptFalse;
    return result;
}

function parseGraphQLResponse(uiPolicies: any) {
    let results: any = [];
    _.forEach(uiPolicies, policy => {
        results.push(uiPolicyParser.parseGraphQLPolicy(policy));
    });
    return results;
}

export default uiPolicyParser;
