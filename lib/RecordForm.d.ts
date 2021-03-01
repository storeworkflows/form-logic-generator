import { IVariables } from "./interface/IVariables";
export default class RecordForm {
    _template: string;
    _variables: IVariables;
    isReadonly(state: any, view: string, isWhitelistedForEdit?: boolean): any;
    getRecordValueProps(recordValues: any, fieldName: any): {
        value: any;
        displayValue: any;
        valuesList: any;
        display_value_list: any;
    };
    getUiDomain(data: any, referringTable: any, referringRecordId: any): {
        tableDisplayValue: any;
        fields: any;
    };
    updatingProperties(data: any, state: any, properties: any): {
        formData: any;
        configurationItems: any[];
    };
    load(variables: IVariables, id: any, setState: any): Promise<void>;
}
