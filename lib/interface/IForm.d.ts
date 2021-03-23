export interface IGlideClientRecord {
    [property: string]: any;
    new (type: string): IGlideClientRecord;
    addQuery(fieldName: string, operator?: string, value?: string): any;
    getEncodedQuery(): string;
    deleteRecord(responseFunction: () => void): boolean;
    get(name: string, value?: string): boolean;
    getTableName(): string;
    hasNext(): boolean;
    insert(responseFunction: () => void): boolean;
    next(): boolean;
    addOrderBy(column: string): void;
    orderBy(f: string): void;
    query(responseFunction: (results: IGlideClientRecord) => void): boolean;
    setLimit(maxQuery: number): void;
    getLimit(): number;
}
export interface IgForm {
    flash(widgetName: string, color: string, count: number): void;
    hideAllFieldMsgs(type?: string): void;
    hideErrorBox(input: string): void;
    hideRelatedList(listTableName: string): void;
    hideRelatedLists(): void;
    setDisplay(fieldName: string, isVisible: boolean): void;
    setVisible(fieldName: string, isVisible: boolean): void;
    showErrorBox(input: string, message: string, scrollForm?: boolean): void;
    showFieldMsg(input: string, message: string, type: string, scrollForm?: boolean): void;
    showRelatedList(listTableName: string): void;
    showRelatedLists(): void;
    getControl(fieldName: string): HTMLElement;
    getElement(id: string): HTMLElement;
    getIntValue(fieldName: string): number;
    getReference(fieldName: string, callback: () => void): IGlideClientRecord;
    getDecimalValue(fieldName: string): string;
    getValue(fieldName: string): string;
    isMandatory(fieldName: string): boolean;
    clearValue(fieldName: string): void;
    setDisabled(fieldName: string, isDisable: boolean): void;
    setMandatory(fieldName: string, isMandatory: boolean): void;
    setReadOnly(fieldName: string, isReadOnly: boolean): void;
    setValue(fieldName: string, value: string, displayValue?: string): void;
    addOption(fieldName: string, choiceValue: string, choiceLabel: string, choiceIndex?: number): void;
    clearOptions(fieldName: string): void;
    removeOption(fieldName: string, choiceValue: string): void;
    getActionName(): string;
    getFormElement(): string;
    getSections(): string;
    getTableName(): string;
    getUniqueValue(): string;
    isNewRecord(): boolean;
    addErrorMessage(message: string): void;
    addInfoMessage(message: string): void;
    clearMessages(): void;
    enableAttachments(): void;
    disableAttachments(): void;
    save(): void;
    submit(): void;
    serialize(): any;
    getEncodedRecord(): string;
}
export interface IgUser {
    userName: string;
    userID: string;
    firstName: string;
    lastName: string;
    getClientData(key: string): string;
    getFullName(): string;
    hasRole(role: string): boolean;
    hasRoleExactly(role: string): boolean;
    hasRoleFromList(roles: string): boolean;
    hasRoles(): boolean;
}
export interface IgUIActions {
    click(sysId: string): void;
    getAction(sysId: string): any;
    getActionByName(name: string): any;
    getActions(): Array<any>;
    getActiveActionName(): any;
    getSaveActionName(): void;
    submit(sysId: string, options: any): void;
}
export interface IField {
    [property: string]: any;
}
export interface ISection {
    caption: string;
    captionDisplay: string;
    defaultSection: boolean;
    expanded: boolean;
    id: number;
    label: string;
    rows: Array<any>;
    sysId: string;
}
export interface IForm {
    gForm: IgForm;
    gUser: IgUser;
    gUIActions: IgUIActions;
    fields: IField;
    sections: Array<ISection>;
    isNewRecord: boolean;
    isValidRecord: boolean;
}
