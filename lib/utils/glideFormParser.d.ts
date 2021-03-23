/**
 * Create some data structures for fields and stuff
 * @param {Array} fieldValues
 * @param {Array} fieldElements
 * @param {Array} fieldStates
 */
export declare function parseCatalogFields(fields: any, fieldValues: any, catalogFields: any, fieldStates: any): void;
export declare function parseFieldGraphQLResponse(tableName: any, sysId: any, fieldValues: any, fieldElements?: any, fieldStates?: any, annotations?: any): any;
declare const _default: {
    parseFieldGraphQLResponse: typeof parseFieldGraphQLResponse;
};
export default _default;
