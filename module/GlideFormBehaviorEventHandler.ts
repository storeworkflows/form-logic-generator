import _ from "lodash";
import Status from "./enum/Status.enum";
import IRecordChanged from "./interface/IRecordChanged";

const PROPERTY_CHANGE_FORM = 'FORM';
const PROPERTY_CHANGE_FIELD = 'FIELD';
const PROPERTY_CHANGE_SECTION = 'SECTION';
const PROPERTY_CHANGE_RELATED_LIST = 'RELATED_LIST';

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
        this.state = formData;
        this.setState = setState;
        this.fetchFormDataActions = fetchFormDataActions;
        this.onStateChange = this.onStateChange.bind(this);
        this.updatingState = this.updatingState.bind(this);
        this.handleRecordStatusChanged = this.handleRecordStatusChanged.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onPropChange = this.onPropChange.bind(this);
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

    onChange (changedFields: {})  {
        const gFormFields = this.formData.layout.formFieldValues;
        const updatedFields: any = Object.keys(changedFields).reduce(
            (fields: any, fieldName) => {
                fields[fieldName] = _.cloneDeep(
                        gFormFields[fieldName]);
                return updatedFields;
            },
            {}
        );
        this._updateState({
            ...this.state,
            layout: {
                ...this.state.layout,
                formFieldValues: {
                    ...this.state.layout.formFieldValues,
                    ...updatedFields
                }
            }
        });
    }

    onPropChange (type: any, name: string | number, propName: string, value: any) {
        console.log("onPropChanged", {type, name, propName, value, state: this.state});

        switch (type) {
            case PROPERTY_CHANGE_FORM:
                if (propName === 'messages') {
                    this._updateState({
                        ...this.state,
                        layout: {
                            ...this.state.layout,
                            formFieldValues: _.cloneDeep(this.state.layout.formFieldValues)
                        }
                    });
                }
                break;
            case PROPERTY_CHANGE_FIELD: {
                this._updateState({..._.cloneDeep(this.state)});
                break;
            }
        }
    }

    onStateChange (oldState: any, newState: any): void {
        console.log("GlideFormBehavior", oldState, newState);
        const { table, sysId } = this.formData.record;
        this.handleRecordStatusChanged(newState, table, sysId);
    };

}