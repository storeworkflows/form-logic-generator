declare const uiPolicyParser: {
    parseGraphQLResponse: typeof parseGraphQLResponse;
    parseGraphQLPolicy: typeof parseGraphQLPolicy;
    parseGraphQLPolicyActions: typeof parseGraphQLPolicyActions;
    parseGraphQLPolicyListActions: typeof parseGraphQLPolicyListActions;
    parseGraphQLPolicyConditions: typeof parseGraphQLPolicyConditions;
};
declare function parseGraphQLPolicyActions(actions: any): any;
declare function parseGraphQLPolicyListActions(actions: any): any;
declare function parseGraphQLPolicyConditions(conditions: any): any;
declare function parseGraphQLPolicy(policy: any): any;
declare function parseGraphQLResponse(uiPolicies: any): any;
export default uiPolicyParser;
