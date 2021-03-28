import _ from "lodash";
import Status from "./enum/Status.enum";
import IRecordChanged from "./interface/IRecordChanged";

export default class GlideFormBehaviorEventHandler {
    private formData;
    private readonly setState;
    private fetchFormDataActions;
    private state: any;
    private prevRecordStatus: Status;
    private _updateState = (newState: any) => {
        this.state = newState;
        this.setState(this.state)
    }

    constructor(formData: any, setState: any, fetchFormDataActions: any) {
        this.formData = formData;
        this.setState = setState;
        this.fetchFormDataActions = fetchFormDataActions;
    }

    private copyObjectAtIndex(array: [], object: {}, index: number) {
        return [
            ...array.slice(0, index),
            _.cloneDeep(object),
            ...array.slice(index + 1)
        ]
    }

    private operationToStatus (operation: string) {
        switch (operation) {
            case 'insert':
                return Status.INSERTED;
            case 'update':
                return Status.UPDATED;
            case 'delete':
                return Status.DELETED;
            default:
                return operation;
        }
    }
    updatingState(stateName: string, matchCallBack: any, payload: any) {
        const items = this.state[stateName];
        const index = items.findIndex(matchCallBack);
        if (index === -1) {
            return;
        }
        const item = items[index];
        const updatedItem = {...item, ...payload};
        this._updateState({
            ...this.state,
            [stateName]: this.copyObjectAtIndex(items, updatedItem, index)
        });
    }

    handleRecordStatusChanged  (status: Status, table: string, sysId: string): void {
        if ([Status.DELETED, Status.INSERTED, Status.UPDATED].includes(this.prevRecordStatus))
            return;

        let payload: IRecordChanged = {
            table: table,
            sys_id: sysId,
            status
        };
        if (
            status === Status.INSERTED ||
            status === Status.UPDATED
        )
            payload = {
                ...payload,
                query: ''
            };

        if (status !== Status.LIVEUPDATED) {
            this.prevRecordStatus = status;
        }
        if ([Status.UNMODIFIED, Status.MODIFIED].includes(status))
            this._updateState({
                ...this.state,
                isDirty: status === Status.MODIFIED
            });
    }

    onStateChange (oldState: any, newState: any): void {
        console.log("GlideFormBehavior", JSON.parse(JSON.stringify(this)));
        const { table, sysId } = this.formData.record;
        this.handleRecordStatusChanged(newState, table, sysId);
    };

}