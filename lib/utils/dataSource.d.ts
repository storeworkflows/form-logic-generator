export declare const componentDataSources: any;
export declare const getDataSourcesForComponents: (queryPrefix: any, components: any) => any;
export declare const getDataSourcesForForm: () => any;
export declare const getVariables: (variableParams: {}, dataSources: any[]) => any;
export declare const getTemplateVariables: (dataSources: any[], templateVariableParams?: {}) => any;
export declare const isRequired: (variable: string, variableParams: any) => any;
export declare const defaultQueryTemplate: (variables: any[], variableParams: any) => string;
export declare const getQuery: (dataSources: any[], queryTemplate: string, variables: any, variableParams: any) => string;
export declare const getFormDataProvider: (data: {
    name?: string;
    dataSources: any;
    queryTemplate: any;
    variableParams?: any;
    templateVariableParams?: any;
    fetchActionNames?: any;
}) => string;
