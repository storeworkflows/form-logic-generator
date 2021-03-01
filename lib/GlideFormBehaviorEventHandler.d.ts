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
    onStateChange(oldState: any, newState: any): void;
}
