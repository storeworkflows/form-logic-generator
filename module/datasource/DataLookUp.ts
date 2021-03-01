import {getValue, createDataProviderDataSource} from "../utils";

export const CATALOG_DATALOOKUP_FIELDS_KEY = 'catalogDataLookup';
export const CATALOG_DATA_LOOKUP_QUERY_FRAGMENT = `
${CATALOG_DATALOOKUP_FIELDS_KEY}(targetTable: $table, targetId: $sysId) {
  fields {
    field
        definitions {
            name
            sysId
        }
  }
}
`;

/**
 * DataLookup processes a list of fields that have DataLookup definitions (table: dl_definition)
 * defined for that table/field combination.  The customer can create a table that acts as a
 * decision matrix, setting values based on current form field values
 */

/**
 * Initialize DataLookup, transforming the list of fields into an object, and binding the
 * on change handler.
 *
 * @param gForm {Object}
 * @param fields {Array}
 * @param encodedRecord {String}
 */

export function createDataLookup(gForm: any, fields: any, sendRequest: any, encodedRecord: string) {
    if (!gForm) {
        console.log('g_form is not defined');
        return;
    }

    if (fields.length === 0) {
        console.log(
            `No DataLookup definitions found for ${gForm.getTableName()} table`
        );
        return;
    }

    let dataLookupInProgress = false;
    let lastSerializedForm: any = null;
    const dataLookupFields: any = fields.reduce((o: any, item: any) => {
        o[item.field] = item;
        return o;
    }, {});

    /**
     * Send a request for DataLookup a DataLookup Definition, setting a form value
     * if all the criteria has been met.
     *
     * @param item {Object}
     */
    function _sendRequest(item: any) {
        return sendRequest(`/api/now/ui/datalookup/${item.sysId}`, 'POST', {
            params: {
                sysparm_table: gForm.getTableName(),
                sysparm_sys_id: gForm.isNewRecord() ? '-1' : gForm.getSysId()
            },
            body: {
                fields: gForm.serialize(),
                encoded_record: encodedRecord || ''
            }
        }).then(
            (response: any) => {
                if (!response.data.result) return;
                dataLookupInProgress = true;
                response.data.result.forEach((element: any) => {
                    gForm.setValue(
                        element.name,
                        element.value,
                        element.displayValue
                    );
                });
                dataLookupInProgress = false;
            },
            (response: any) => {
                console.error(
                    `Error processing DataLookup Definition ${item.name}`,
                    response
                );
            }
        );
    }

    /**
     * Process a field that has a DataLookup definition defined.  There are built in safeguards to prevent
     * DataLookup definitions triggering themselves, and we count the transactions that we have sent
     * to only process the most recent for that field.
     *
     * @param fieldName {String}
     * @param oldValue {String}
     * @param newValue {String}
     * @param isLoading {boolean}
     */
    function _process(fieldName: string, oldValue: string, newValue: string, isLoading: boolean) {
        if (isLoading || !dataLookupFields[fieldName] || dataLookupInProgress) {
            return;
        }

        const serializedForm = gForm.serialize();
        if (!serializedForm || lastSerializedForm === serializedForm) {
            return;
        }

        dataLookupFields[fieldName].definitions.forEach((item: any) => {
            lastSerializedForm = serializedForm;
            _sendRequest(item);
        });
    }

    return {
        initialize: function() {
            gForm.$private.events.on('change', _process);
        }
    };
}

const DATALOOKUP_QUERY_KEY = 'GlideDataLookupQuery_Query';
const DATALOOKUP_CONFIG_KEY = 'dataLookup';
const DATALOOKUP_FIELDS_KEY = 'fields';
const QUERY_FRAGMENT = `
${DATALOOKUP_QUERY_KEY} {
	${DATALOOKUP_CONFIG_KEY}(table: $table) {
		fields {
			field
        	definitions {
          		name
          		sysId
        	}
		}
	}
	${CATALOG_DATA_LOOKUP_QUERY_FRAGMENT}
}
`;

const createTransform = (getValueOrDefault:any) => (data: any) => {
    const formFields = getValueOrDefault(
        `${DATALOOKUP_CONFIG_KEY}.${DATALOOKUP_FIELDS_KEY}`,
        []
    )(data);
    const catalogFields = getValueOrDefault(
        `${CATALOG_DATALOOKUP_FIELDS_KEY}.${DATALOOKUP_FIELDS_KEY}`,
        []
    )(data);
    const fields = [...(formFields || []), ...(catalogFields || [])];

    return {
        fields
    };
};

export const createDataLookupDataSource = (queryPrefix = '') => {
    const baseKey = `${queryPrefix}${DATALOOKUP_QUERY_KEY}`;
    const getValueOrDefault = getValue(baseKey);
    const transform = createTransform(getValueOrDefault);

    return createDataProviderDataSource({
        query: QUERY_FRAGMENT,
        variables: ['table'],
        transform,
        props: {
            table: { default: '' }
        },
        selectableProps: {
            fields: {
                default: {}
            }
        }
    });
};

