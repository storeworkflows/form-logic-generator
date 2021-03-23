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
export declare const ITEM_TYPES: {
    SIMPLE: string;
    REFERENCE: string;
    HIGHLIGHTED: string;
};
export declare const createHeaderDataSource: (queryPrefix?: string) => {
    query: any;
    variables: any;
    getParams: any;
    transform: any;
    props: any;
    selectableProps: any;
    templateVariables: any;
};
