
export interface IGlideClientRecord {
    /*
     * The actual record can be any table record, which could have any number of properties.
     * For common models we should extend this interface with the actual properties.
     */
    [property: string]: any;

    new (type: string): IGlideClientRecord;
    /*
     * Adds a filter to return records based on 1, 2, or 3 arguments.
     *  http://wiki.servicenow.com/index.php?title=Using_GlideRecord_to_Query_Tables#Available_JavaScript_Operators
     */
    addQuery(fieldName: string, operator?: string, value?: string): any; // should return QueryCondition

    /*
     * Gets the encoded query as a string.
     */
    getEncodedQuery(): string;

    /*
     * Deletes a single record.
     */
    deleteRecord(responseFunction: () => void): boolean;

    get(name: string, value?: string): boolean;
    /*
     *  Retrieves the table name associated with this GlideRecord.
     */
    getTableName(): string;

    /*
     * Determines if there are any more records in the GlideRecord.
     */
    hasNext(): boolean;

    /*
     * 	Inserts a new record using the field values that have been set for the current record.
     */
    insert(responseFunction: () => void): boolean;
    /*
     * Moves to the next record in the GlideRecord.
     *
     * Returns false if there are no more records
     */
    next(): boolean;
    /*
     * Adds a column to order by in the query.
     */
    addOrderBy(column: string): void;
    /*
     * Specifies and orderBy column(this may be called more than once to order by multiple columns).
     */
    orderBy(f: string): void;
    /*
     * Runs the query against the table based on the addQuery() filter.
     */
    query(responseFunction: (results: IGlideClientRecord) => void): boolean;
    /*
     * Sets the limit for how many records will be returned by the GlideRecord query.
     */
    setLimit(maxQuery: number): void;

    /*
     * Gets the limit of records to be returned by the GlideRecord query.
     */
    getLimit(): number;
}

export interface IgForm {
    /*
             *  Flashes the specified color the specified number of times. Used to draw attention to a particular field.
             */
    flash(widgetName: string, color: string, count: number): void;

    /*
     *  Hides all field messages.
     *  Optional: Provide type to clear only "info" or "error" messages.
     */
    hideAllFieldMsgs(type?: string): void;

    /*
     *  Hides the error message placed by showErrorBox().
     *  Best Practice: Use hideFieldMsg rather than this method whenever possible.
     */
    hideErrorBox(input: string): void;

    /*
     *  Hides the message placed by showFieldMsg().
     */
    hideRelatedList(listTableName: string): void;

    /*
     *  Hides all related lists on the form.
     */
    hideRelatedLists(): void;

    /*
     *  Displays the field if true. Hides the field if false. If the field is hidden, the space is reclaimed.
     *  Best Practice: Use UI Policy rather than this method whenever possible.
     */
    setDisplay(fieldName: string, isVisible: boolean): void;

    /*
     *  Displays the field if true.Hides the field if false.If the field is hidden, the space is left blank.
     *  Best Practice: Use UI Policy rather than this method whenever possible.
     */
    setVisible(fieldName: string, isVisible: boolean): void;

    /*
     *  Displays an error message under the specified form field(either a control object or the name of the field).If the control or field is currently scrolled off the screen, it will be scrolled to.
     *  Optional: Set scrollForm to false to prevent scrolling to the error message offscreen.
     */
    showErrorBox(input: string, message: string, scrollForm?: boolean): void;

    /*
     *  Displays either an informational or error message under the specified form field(either a control object or the name of the field).Type may be either "info" or "error." If the control or field is currently scrolled off the screen, it will be scrolled to.
     *  Optional: Set scrollForm to false to prevent scrolling to the field message offscreen.
     */
    showFieldMsg(input: string, message: string, type: string, scrollForm?: boolean): void;

    /*
     * Displays the specified related list on the form.
     */
    showRelatedList(listTableName: string): void

    /*
     * Displays all related lists on the form.
     */
    showRelatedLists(): void;

    /*
     *  Returns the HTML element for the specified field.Compound fields may contain several HTML elements.
     *  Generally not necessary as there are built- in methods that use the fields on the form.
     */
    getControl(fieldName: string): HTMLElement;

    /*
     *  Returns the HTML element for the field specified via the ID.Compound fields may contain several HTML elements.
     *  Generally not necessary as there are built- in methods that use the fields on the form.
     */
    getElement(id: string): HTMLElement;

    /*
     *  Returns the value of the specified field as an integer. An empty value returns 0.
     */
    getIntValue(fieldName: string): number;

    /*
     *  Returns the GlideRecord for a specified field.
     *  getReference() accepts a second parameter, a callback function.
     *  Warning: This requires a call to the server so using this function will require additional time and may introduce latency to your page.
     */
    getReference(fieldName: string, callback: () => void): IGlideClientRecord;

    /*
     *  Returns the decimal value of the specified field.
     */
    getDecimalValue(fieldName: string): string;

    /*
     *  Returns the value of the specified field.
     */
    getValue(fieldName: string): string;

    /*
     *  Returns true if the field is required.Returns false if the field is optional.
     */
    isMandatory(fieldName: string): boolean;

    ///////////////////////////////////////
    // Change Field
    ///////////////////////////////////////

    /*
     * Removes any value(s) from the specified field.
     */
    clearValue(fieldName: string): void;

    /*
     *  Grays out field and makes it unavailable.
     */
    setDisabled(fieldName: string, isDisable: boolean): void;

    /*
     *  Makes the field required if true.Makes the field optional if false.
     *  Best Practice: Use UI Policy rather than this method whenever possible.
     */
    setMandatory(fieldName: string, isMandatory: boolean): void;

    /*
     *  Makes the field read - only if true.Makes the field editable if false.
     *  Note: Both setReadOnly and setReadonly are functional.
     *  Best Practice: Use UI Policy rather than this method whenever possible.
     */
    setReadOnly(fieldName: string, isReadOnly: boolean): void;

    /*
     *  Sets the value and the display value of a field.Will display value if there is no displayValue.
     *  Note: setValue can cause a stack overflow when used in an OnChange client script.
     *  This is because every time the value is set, it will register as a change, which may re - trigger the OnChange client script.
     *  To prevent this, perform a check that will validate that the new value will be different from the old value.
     *  For example, before performing setValue(fieldName, newValue.toUpperCase());, validate that the short description is not already uppercase.
     *  This will prevent the Client Script from applying the toUpperCase() more than once.
     */
    setValue(fieldName: string, value: string, displayValue?: string): void;
    /*
     *  Adds a choice to a choice list field. If the index is not specified, the choice is added to the end of the list.
     *  Optional: Use the index field to specify a particular place in the list.
     */
    addOption(fieldName: string, choiceValue: string, choiceLabel: string, choiceIndex?: number): void;

    /*
     *  Removes all options from a choice list.
     */
    clearOptions(fieldName: string): void;

    /*
     *  Removes a specific option from a choice list.
     */
    removeOption(fieldName: string, choiceValue: string): void;
    /*
     *  Returns the most recent action name or, for a client script, the sys_id of the UI Action clicked. Note: not available to Wizard Client Scripts.
     */
    getActionName(): string;

    /*
     *  Returns the HTML element for the form.
     */
    getFormElement(): string;

    /*
     *  Returns the elements for the form's sections in an array.
     */
    getSections(): string;

    /*
     *  Returns the name of the table this record belongs to.
     */
    getTableName(): string;

    /*
     *  Returns the sys_id of the record displayed in the form.
     */
    getUniqueValue(): string;

    /*
     *  Returns true if the record has never been saved.Returns false if the record has been saved.
     */
    isNewRecord(): boolean;
    /*
     *  Displays an error message at the top of the form.
     */
    addErrorMessage(message: string): void;

    /*
     *  Displays an informational message at the top of the form.
     */
    addInfoMessage(message: string): void;

    /*
     *  Removes messages that were previously added with addErrorMessage() and addInfoMessage().
     */
    clearMessages(): void;

    /*
     *  Allows new file attachments to be added.Shows the paperclip icon.See also: disableAttachments().
     */
    enableAttachments(): void;

    /*
     *  Prevents new file attachments from being added.Hides the paperclip icon.See also: enableAttachments().
     */
    disableAttachments(): void;

    /*
     *  Saves the record without navigating away from the record(update and stay).
     */
    save(): void;

    /*
     *  Saves the record.User will be taken away from the form, returning them to where they were previously.
     */
    submit(): void;

    serialize(): any

    /*
    * Encode record to base64 string
     */
    getEncodedRecord(): string
}

export interface IgUser {
    userName: string; // User name of the current user.
    userID: string; // Sys_id of the current user.
    firstName: string; // First name of the current user.
    lastName: string; // Last name of the current user.
    /*
     * Gets information for use in client scripts without making an AJAX call to the server.Works with putClientData().For more information, see Session Client Data.
     */
    getClientData(key: string): string;
    getFullName(): string;
    hasRole(role: string): boolean;
    hasRoleExactly(role: string): boolean;
    hasRoleFromList(roles: string): boolean; // roles is comma separated list
    hasRoles(): boolean;
}

export interface IgUIActions {
    click (sysId: string): void,
    getAction (sysId: string): any,
    getActionByName (name: string): any,
    getActions (): Array<any>,
    getActiveActionName (): any
    getSaveActionName (): void,
    submit (sysId: string, options: any): void
}

export interface IField {
    [property: string]: any;
}

export interface ISection {
    caption: string;
    captionDisplay: string
    defaultSection: boolean
    expanded: boolean
    id: number
    label: string
    rows: Array<any>
    sysId: string
}

export interface IForm {
    gForm: IgForm,
    gUser: IgUser,
    formData: any
}