export declare const ACTIVITY_QUERY_KEY = "GlideActivity_Query";
export declare const ENTRIES_KEY = "entries";
export declare const FIELDS_KEY = "fields";
export declare const TIMESTAMP_KEY = "sysTimestamp";
export declare const GET_STREAM = "getStream";
export declare const QUERY_FRAGMENT: string;
export declare const createActivityStreamDataSource: (queryPrefix?: string) => {
    query: any;
    variables: any;
    getParams: any;
    transform: any;
    props: any;
    selectableProps: any;
    templateVariables: any;
};
