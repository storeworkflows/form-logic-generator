export declare const CONTEXTUAL_LINK_NAMES: {
    header: {
        name: any;
        order: number;
    };
    uiActions: {
        name: any;
        order: number;
    };
    ribbon: {
        name: any;
        order: number;
    };
    formLayout: {
        name: any;
        order: number;
    };
    relatedItems: {
        name: any;
        order: number;
    };
    relatedLists: {
        name: any;
        order: number;
    };
    contextualSidePanel: {
        name: any;
        order: number;
    };
};
export declare const DECLARATIVE_ACTIONS_QUERY_KEY = "GlideDeclarativeActions_Query";
export declare const DECLARATIVE_ACTIONS_FORM_QUERY_KEY = "GlideDeclarativeActions_formQuery";
export declare const FORM_DECLARATIVE_ACTIONS_KEY = "formDeclarativeActions";
export declare const FORM_ACTIONS_KEY = "formActions";
export declare const QUERY_FRAGMENT: string;
export declare const createDeclarativeFormActionDataSource: (queryPrefix?: string) => {
    query: any;
    variables: any;
    getParams: any;
    transform: any;
    props: any;
    selectableProps: any;
    templateVariables: any;
};
