import Status from "./enum/Status.enum";
export default class GlideFormBehaviorEventHandler {
    private formData;
    private readonly setState;
    private fetchFormDataActions;
    private state;
    private prevRecordStatus;
    private _updateState;
    constructor(formData: any, setState: any, fetchFormDataActions: any);
    private copyObjectAtIndex;
    private operationToStatus;
    updatingState(stateName: string, matchCallBack: any, payload: any): void;
    handleRecordStatusChanged(status: Status, table: string, sysId: string): void;
    onChange(changedFields: {}): void;
    onPropChange(type: any, name: string | number, propName: string, value: any): void;
    onStateChange(oldState: any, newState: any): void;
}
