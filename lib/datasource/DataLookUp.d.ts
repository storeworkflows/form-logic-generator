export declare const CATALOG_DATALOOKUP_FIELDS_KEY = "catalogDataLookup";
export declare const CATALOG_DATA_LOOKUP_QUERY_FRAGMENT: string;
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
export declare function createDataLookup(gForm: any, fields: any, sendRequest: any, encodedRecord: string): {
    initialize: () => void;
};
export declare const createDataLookupDataSource: (queryPrefix?: string) => {
    query: any;
    variables: any;
    getParams: any;
    transform: any;
    props: any;
    selectableProps: any;
    templateVariables: any;
};
