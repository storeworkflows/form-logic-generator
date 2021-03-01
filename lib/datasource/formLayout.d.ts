export declare const SC_SCRIPTS_QUERY_KEY = "CatalogClientScriptingEnvironment_Scripts";
export declare const SC_POLICIES_QUERY_KEY = "CatalogClientScriptingEnvironment_Policies";
export declare const VARIABLE_LAYOUT_QUERY_FRAGMENT = "\nvariablesLayout {\n\tname\n\ttype\n\tparent\n \t... on GlideLayout_ContainerVariableFieldLayoutType {\n\t\tcaption\n\t\tcaptionDisplay\n\t\tlayout\n\t\tcolumns {\n\t\t\tfields {\n\t\t\t\tname\n\t\t\t\ttype\n\t\t\t}\n\t\t}\n\t}\n}\n";
export declare const CATALOG_SCRIPTS_FRAGMENT: string;
export declare const CATALOG_POLICIES_FRAGMENT: string;
export declare const GlideElementVariables_ELEMENTS_QUERY_FRAGMENT = "\n_elements {\n    ... on GlideLayout_MultiRowVariableSetType {\n      type\n      name\n      variableName\n      label\n      containerType\n      canRead\n      canWrite\n      canCreate\n      id\n      maxRows\n      fields {\n        name\n        id\n        label\n        type\n      }\n      rowData {\n        row {\n          id\n          name\n          value\n          displayValue\n        }\n      }\n    }\n    ... on GlideLayout_SingleRowVariableSetType {\n      type\n      id\n      name\n      label\n      containerType\n      canRead\n      canWrite\n      canCreate\n      variableName\n    }\n    ... on GlideLayout_ChoiceQuestionElementType {\n      type\n      id\n      name\n      variableName\n      label\n      order\n      catalogItem\n      variableSet\n      mandatory\n      canRead\n      canWrite\n      canCreate\n      variableAttributes\n      defaultValue\n      lookupTable\n      lookupValue\n      lookupLabel\n      includeNone\n      lookupUnique\n      choiceTable\n      choiceField\n      choiceDirection\n      choices {\n        displayValue: label\n        value\n      }\n      dependentField\n      referringTable\n      referringRecordId\n    }\n    ... on GlideLayout_ReferenceQuestionElementType {\n      type\n      id\n      name\n      variableName\n      label\n      order\n      catalogItem\n      variableSet\n      mandatory\n      canRead\n      canWrite\n      canCreate\n      reference\n      referenceQual\n      listTable\n      useReferenceQualifier\n      variableAttributes\n      defaultValue\n      referringTable\n      referringRecordId\n    }\n    ... on GlideLayout_ContainerQuestionElementType {\n      type\n      id\n      name\n      variableName\n      label\n      order\n      catalogItem\n      variableSet\n      displayTitle\n      layout\n      containerType\n      canRead\n      canWrite\n      canCreate\n      mandatory\n    }\n    ... on GlideLayout_StandardQuestionElementType {\n      type\n      id\n      name\n      variableName\n      label\n      order\n      catalogItem\n      variableSet\n      mandatory\n      canRead\n      canWrite\n      canCreate\n      variableAttributes\n      defaultValue\n      exampleText\n      useConfirmation\n      regExp\n      canDecrypt\n    }\n    ... on GlideLayout_AttachmentQuestionElementType {\n      type\n      id\n      name\n      variableName\n      label\n      order\n      catalogItem\n      variableSet\n      mandatory\n      canRead\n      canWrite\n      canCreate\n      variableAttributes\n      defaultValue\n      contentType\n    }\n  }\n";
export declare const CATALOG_DATALOOKUP_FIELDS_KEY = "catalogDataLookup";
export declare const CATALOG_DATA_LOOKUP_QUERY_FRAGMENT: string;
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
export declare const createFormLayoutDataSource: (queryPrefix?: string) => {
    query: any;
    variables: any;
    getParams: any;
    transform: any;
    props: any;
    selectableProps: any;
    templateVariables: any;
};
