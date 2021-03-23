import {getValue, createDataProviderDataSource} from "../utils";

import * as glideFormDataParser from '../utils/glideFormParser';
import _ from 'lodash';

const QUERY_FRAGMENT = `
GlideLayout_Query {
	formLayout(table: $table, view: $view) {
		sectionLayout {
			sysId
			caption
			captionDisplay
			rows {
				fields
			}
		}

		elementsData {
			name: elementName
			dictionary: dictionaryData {
				type: dictionaryType
				dependentField
				dependentTable
				name
				label
				canWrite
				canRead
				canCreate
				internalType
				isMandatory
				sys_readonly: sysReadonly
				attributes {
					name
					value
				}
			}
			... on GlideLayout_ChoiceElementType {
				choices {
					displayValue
					value
				}
			}
			... on GlideLayout_ReferenceElementType {
				reference
				referenceQualifier
				referenceKey
				useReferenceQualifier
				dependent
				dependentOnField
				refAutoCompleter
				refAcOrderBy
				refAcColumns
				refAcColumnsSearch
				refAcDisplayValue
				refQualElements
				refContributions
				isDynamicCreate
				isReferenceScriptableTable
				referenceError
			}
			... on GlideLayout_ValueElementType {
				maxLength
				defaultRows
			}

			... on GlideLayout_TableNameElementType {
				displayValue
			}
		}
	}
}
`;
const LAYOUT_QUERY_KEY = 'GlideLayout_Query';
const FORM_LAYOUT_QUERY_KEY = 'formLayout';
const RECORD_VALUES_KEY = 'recordValues';
const FIELD_ELEMENTS_KEY = 'elementsData';
const SECTION_LAYOUT = 'sectionLayout';

const transformFormFieldValues = (
    table: any,
    recordValues: any,
    fieldElements: any,
    isFormReadonly: any,
    declarativeUIActions: any
) => {
    const formFieldValues = _.reduce(
        glideFormDataParser.parseFieldGraphQLResponse(
            table,
            '-1',
            recordValues,
            fieldElements
        ),
        (fields, field, key) => ({
            ...fields,
            [key]: {
                ...field,
                declarativeUiActions: declarativeUIActions[key]
            }
        }),
        {}
    );
    if (!isFormReadonly) return formFieldValues;
    return _.reduce(
        formFieldValues,
        (fields: any, field: any, key) => ({
            ...fields,
            [key]: {
                ...field,
                // sys_readonly: true,
                // readonly: true
            }
        }),
        {}
    );
};

const transformSections = (sections: any) => {
    return sections.map((section: any, index: any) => ({
        ...section,
        id: index,
        caption: (section.caption || section.captionDisplay || '')
            .toLowerCase()
            .replace(' ', '_')
            .replace(/[^0-9a-z_]/gi, ''),
        label: section.captionDisplay,
        expanded: true
    }));
};

const createTransform = (getValueOrDefault: any) => (
    data: any,
    state: any,
    properties: any,
    declarativeUIActions = {}
) => {
    const { isFormReadonly } = state;
    const { table } = properties;
    const recordValues = getValueOrDefault(RECORD_VALUES_KEY, [])(data);
    const fieldElements = getValueOrDefault(FIELD_ELEMENTS_KEY, [])(
        data
    ).filter((el: any) => _.get(el, 'dictionary.canRead') !== false);
    const sections = transformSections(
        getValueOrDefault(SECTION_LAYOUT, [])(data)
    );

    console.log("dataProvider", {sections});

    const formFieldValues = transformFormFieldValues(
        table,
        recordValues,
        fieldElements,
        isFormReadonly,
        declarativeUIActions
    );

    return {
        recordValues,
        fieldElements,
        sections,
        formFieldValues
    };
};

export const createSimpleFormLayoutDataSource = (queryPrefix = '') => {
    const baseKey = `${queryPrefix}${LAYOUT_QUERY_KEY}.${FORM_LAYOUT_QUERY_KEY}`;
    const getValueOrDefault = getValue(baseKey);
    const transform = createTransform(getValueOrDefault);

    return createDataProviderDataSource({
        query: QUERY_FRAGMENT,
        variables: ['table', 'view'],
        transform,
        props: {
            table: { default: '' },
            view: { default: '' }
        },
        selectableProps: {
            recordValues: {},
            fieldElements: {},
            sections: {},
            formFieldValues: {}
        }
    });
};
