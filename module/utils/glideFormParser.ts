import _ from 'lodash';
/**
 * Create some data structures for fields and stuff
 * @param {Array} fieldValues
 * @param {Array} fieldElements
 * @param {Array} fieldStates
 */
export function parseCatalogFields(
    fields: any,
    fieldValues: any,
    catalogFields: any,
    fieldStates: any
) {
    try {
        _.forEach(catalogFields, fieldElement => {
            const { name } = fieldElement;
            if (fields[name]) {
                console.warn('Already defined field ! ');
                return;
            }

            // variables attributes are key value pairs separated by comma. ex: max_length=5,max_units=hours
            const attributes = _.get(fieldElement, 'variableAttributes', '')
                .split(',')
                .reduce((acc: any, attr: any) => {
                    const parts = attr.split('=', 2);
                    if (parts.length > 0) {
                        const value = parts.length === 2 ? parts[1] : '';
                        acc[_.camelCase(parts[0])] = value;
                    }
                    return acc;
                }, {});

            const canWrite = _.get(fieldElement, 'canWrite', true);
            const canCreate = _.get(fieldElement, 'canCreate', true);
            const canRead = _.get(fieldElement, 'canRead', true);
            const readonly = _.get(fieldStates, [name, 'readonly'], false);
            const hidden = _.get(fieldStates, [name, 'hidden'], false);
            const mandatory =
                _.get(fieldStates, [name, 'mandatory'], false) ||
                _.get(fieldElement, 'mandatory', false);
            const field = _.assign(
                {},
                fieldElement,
                {
                    canWrite: canWrite,
                    sys_readonly: !canCreate || !canWrite,
                    readonly: readonly || !canCreate || !canWrite,
                    visible: !hidden && canRead,
                    mandatory: mandatory,
                    variable_name: fieldElement.variableName,
                    _cat_variable: true /*Need this for gForm Operation*/,
                    is_variable: true /*Need this for Save Operation*/,
                    maxLength: attributes.maxLength,
                    maxUnit: attributes.maxUnit
                },
                fieldValues[name]
            );
            if (field.type === 'masked') {
                field.confirmationValue = field.value;
            }
            fields[name] = field;
        });
    } catch (exception) {
        console.log('Error while processing catalog elements', exception);
    }
}

export function parseFieldGraphQLResponse(
    tableName: any,
    sysId: any,
    fieldValues: any,
    fieldElements: any = [],
    fieldStates: any = [],
    annotations: any = []
) {
    let fields: any = {};

    if (!fieldValues) {
        // record not found or ACL says no sesame
        return fields;
    }

    fieldValues = fieldValues.reduce((values: any, fieldValue: any) => {
        let o: any = {
            value: fieldValue.value,
            displayValue: fieldValue.displayValue
        };

        // For multi value fields like glide_list
        if (fieldValue.valuesList.length) {
            o.display_value_list = [];
            fieldValue.valuesList.forEach((item: any) => {
                o.display_value_list.push(item.displayValue);
            });
        } else {
            o.valuesList = [];
            o.display_value_list = [];
        }
        values[fieldValue.name] = o;
        return values;
    }, {});

    try {
        // aggregate into fields object
        _.forEach(fieldElements, fieldElement => {
            const { name, dictionary } = fieldElement;
            let fieldState = fieldStates[name] || {};
            let visible = fieldState.hidden !== true;

            // move values from dictionary to field
            const {
                label,
                type,
                dependentField,
                dependentTable,
                canWrite,
                isMandatory,
                isReadonly,
                sys_readonly
            } = dictionary;

            if (type === 'glide_var') return;

            let field: any = _.assign(
                {},
                fieldElement,
                {
                    type,
                    dictionary,
                    name,
                    label,
                    visible,
                    readonly: fieldState.readonly || false,
                    mandatory: fieldState.mandatory || false,
                    dependentField,
                    dependentTable,
                    referringTable: tableName,
                    referringRecordId: sysId
                },
                fieldValues[name]
            );

            switch (field.type) {
                case 'journal_input':
                    // @note: clearing the display value since the display value is the journal history
                    field = Object.assign(field, {
                        displayValue: ''
                    });
                    break;
                case 'currency':
                case 'currency2':
                case 'price': {
                    const {
                        value,
                        code,
                        defaultCurrency,
                        currencyCodes
                    } = fieldElement;
                    field = Object.assign(field, {
                        value: value,
                        code: code,
                        defaultCurrency: defaultCurrency,
                        currencyCodes: currencyCodes
                    });
                    break;
                }
                case 'phone_number_e164': {
                    const { value, country, countryCodes } = fieldElement;
                    field = Object.assign(field, {
                        value,
                        country,
                        countryCodes
                    });
                    break;
                }
                case 'file_attachment': {
                    const { state, contentType } = fieldElement;
                    field = Object.assign(field, {
                        state,
                        contentType
                    });
                    break;
                }
                case 'table_name': {
                    const { displayValue } = fieldElement;
                    field = Object.assign(field, {
                        displayValue
                    });
                }
                case 'glide_list':
                case 'reference': {
                    const {
                        isReferenceScriptableTable,
                        referenceError
                    } = fieldElement;
                    const messages = isReferenceScriptableTable
                        ? [{ type: 'error', message: referenceError }]
                        : [];

                    field = {
                        ...field,
                        messages: [...(field.messages || []), ...messages]
                    };
                    break;
                }
                case 'variables':
                    parseCatalogFields(
                        fields,
                        fieldValues,
                        fieldElement['variables'],
                        fieldStates
                    );
                    break;
            }

            // ACLs and dictionary attributes have final say in field props
            field.sys_readonly = sys_readonly;
            if (!canWrite) field.readonly = true;

            if (isReadonly) field.readonly = true;

            if (isMandatory) field.mandatory = true;

            fields[name] = field;
        });
    } catch (e) {
        console.log('Error while processing fields', e);
    }
    //annotation is not a GlideElement type and
    //does not have all the dictionary values other types have
    Object.assign(fields, annotations);

    return fields;
}

export default {
    parseFieldGraphQLResponse
};
