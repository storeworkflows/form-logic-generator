export declare const SCRIPTING_QUERY_KEY = "GlideClientScriptingEnvironment_Query";
export declare const GLOBALS_QUERY_KEY = "ClientScriptingEnvironment_Globals";
export declare const UI_POLICIES_QUERY_KEY = "ClientScriptingEnvironment_Policies";
export declare const CLIENT_SCRIPTS_QUERY_KEY = "ClientScriptingEnvironment_Scripts";
export declare const QUERY_FRAGMENT: string;
export declare const createClientScriptEnvironmentDataSource: (queryPrefix?: string) => {
    query: any;
    variables: any;
    getParams: any;
    transform: any;
    props: any;
    selectableProps: any;
    templateVariables: any;
};
