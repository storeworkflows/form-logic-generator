export declare const DECLARATIVE_ACTIONS_QUERY_KEY = "GlideDeclarativeActions_Query";
export declare const DECLARATIVE_ACTIONS_FIELD_QUERY_KEY = "GlideDeclarativeActions_fieldQuery";
export declare const FIELD_DECLARATIVE_ACTIONS_KEY = "fieldDeclarativeActions";
export declare const FIELD_ACTIONS_KEY = "fieldActions";
export declare const QUERY_FRAGMENT: string;
export declare const createDeclarativeFieldActionDataSource: (queryPrefix?: string) => {
    query: any;
    variables: any;
    getParams: any;
    transform: any;
    props: any;
    selectableProps: any;
    templateVariables: any;
};
