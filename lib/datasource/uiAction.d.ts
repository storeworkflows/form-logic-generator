export declare const UI_ACTION_TYPES: {
    BUTTON: string;
    MENU: string;
    SPLIT_BUTTON: string;
};
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
export declare const UI_ACTION_QUERY_KEY = "GlideUIAction_Query";
export declare const UI_ACTIONS_KEY = "uiActions";
export declare const UI_ACTION_FORM_ACTIONS = "formActions";
export declare const UI_ACTION_MESSAGES = "messages";
export declare const UI_ACTION_NODES = "actionNodes";
export declare const QUERY_FRAGMENT: string;
export declare const createUIActionDataSource: (queryPrefix?: string) => {
    query: any;
    variables: any;
    getParams: any;
    transform: any;
    props: any;
    selectableProps: any;
    templateVariables: any;
};
declare const _default: {
    query: any;
    variables: any;
    getParams: any;
    transform: any;
    props: any;
    selectableProps: any;
    templateVariables: any;
};
export default _default;
