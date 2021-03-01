import {getValue, createDataProviderDataSource} from "../utils";

export const FIELD_VALIDATOR_QUERY_KEY = 'GlideFieldValidator_Query';
export const FIELD_VALIDATOR_KEY = 'validators';
export const VALIDATION_SCRIPTS_KEY = 'validationScripts';
export const QUERY_FRAGMENT = `
${FIELD_VALIDATOR_QUERY_KEY} {
	${FIELD_VALIDATOR_KEY}(table: $table, sysId: $sysId, view: $view) {
		validationScripts {
			internalType
			script:validator
			description
			fields
		}
	}
}`;

const createTransform = (getValueOrDefault: any) => (data: any) => {
    const scripts = getValueOrDefault(VALIDATION_SCRIPTS_KEY, [])(data);
    return {
        fieldValidators: scripts
    };
};

export const createFieldValidatorDataSource = (queryPrefix = '') => {
    const baseKey = `${queryPrefix}${FIELD_VALIDATOR_QUERY_KEY}.${FIELD_VALIDATOR_KEY}`;
    const getValueOrDefault = getValue(baseKey);
    const transform = createTransform(getValueOrDefault);

    return createDataProviderDataSource({
        query: QUERY_FRAGMENT,
        variables: ['table', 'sysId', 'view'],
        transform,
        props: {
            table: { default: '' },
            sysId: { default: '' },
            view: { default: '' }
        },
        selectableProps: {
            fieldValidators: {
                default: {}
            }
        }
    });
};
