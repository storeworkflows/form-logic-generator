import {getValue, createDataProviderDataSource} from "../utils";

import * as glideFormDataParser from '../utils/glideFormParser';
import _ from 'lodash';
//@ts-ignore
import { t } from "@servicenow/library-translate";

export const SC_SCRIPTS_QUERY_KEY = 'CatalogClientScriptingEnvironment_Scripts';
export const SC_POLICIES_QUERY_KEY =
    'CatalogClientScriptingEnvironment_Policies';
export const VARIABLE_LAYOUT_QUERY_FRAGMENT = `
variablesLayout {
	name
	type
	parent
 	... on GlideLayout_ContainerVariableFieldLayoutType {
		caption
		captionDisplay
		layout
		columns {
			fields {
				name
				type
			}
		}
	}
}
`;

export const CATALOG_SCRIPTS_FRAGMENT = `
${SC_SCRIPTS_QUERY_KEY} (table: $table, sysId: $sysId, query: $query){
		onLoad {
			name
			sysId
			script
			type
			fieldName
			tableName
		}
		onChange {
			name
			sysId
			script
			type
			fieldName
			tableName
		}
		onSubmit {
			name
			sysId
			script
			type
			fieldName
			tableName
		}
		messages {
			name
			value
		}
	}

`;

export const CATALOG_POLICIES_FRAGMENT = `
${SC_POLICIES_QUERY_KEY} (table: $table, sysId: $sysId, query: $query){
		shortDescription
		sysId
		scriptTrue {
			name
			script
		}
		scriptFalse {
			name
			script
		}
		reverse
		onLoad
		isRunScripts
		preEvaluated
		preEvaluatedResult
		actions {
			visible
			name
			disabled
			mandatory
			cleared: clearValue
			relatedList
		}
		conditions {
			term
			field: fieldName
			fieldLabel
			type
			columnType
			value
			oper: operator
			operatorLabel
			catalogVariable
			catalogOperator
			catalogVariableType
			catalogVariableTable
			or: isOrQuery
			newquery: isNewQuery
			preEvaluatedTerm
			preEvaluatedTermResult
			referenceFields {
				table
				fieldName
				fieldLabel
				internalType
				referenceTable
			}
		}

	}
`;
export const GlideElementVariables_ELEMENTS_QUERY_FRAGMENT = `
_elements {
    ... on GlideLayout_MultiRowVariableSetType {
      type
      name
      variableName
      label
      containerType
      canRead
      canWrite
      canCreate
      id
      maxRows
      fields {
        name
        id
        label
        type
      }
      rowData {
        row {
          id
          name
          value
          displayValue
        }
      }
    }
    ... on GlideLayout_SingleRowVariableSetType {
      type
      id
      name
      label
      containerType
      canRead
      canWrite
      canCreate
      variableName
    }
    ... on GlideLayout_ChoiceQuestionElementType {
      type
      id
      name
      variableName
      label
      order
      catalogItem
      variableSet
      mandatory
      canRead
      canWrite
      canCreate
      variableAttributes
      defaultValue
      lookupTable
      lookupValue
      lookupLabel
      includeNone
      lookupUnique
      choiceTable
      choiceField
      choiceDirection
      choices {
        displayValue: label
        value
      }
      dependentField
      referringTable
      referringRecordId
    }
    ... on GlideLayout_ReferenceQuestionElementType {
      type
      id
      name
      variableName
      label
      order
      catalogItem
      variableSet
      mandatory
      canRead
      canWrite
      canCreate
      reference
      referenceQual
      listTable
      useReferenceQualifier
      variableAttributes
      defaultValue
      referringTable
      referringRecordId
    }
    ... on GlideLayout_ContainerQuestionElementType {
      type
      id
      name
      variableName
      label
      order
      catalogItem
      variableSet
      displayTitle
      layout
      containerType
      canRead
      canWrite
      canCreate
      mandatory
    }
    ... on GlideLayout_StandardQuestionElementType {
      type
      id
      name
      variableName
      label
      order
      catalogItem
      variableSet
      mandatory
      canRead
      canWrite
      canCreate
      variableAttributes
      defaultValue
      exampleText
      useConfirmation
      regExp
      canDecrypt
    }
    ... on GlideLayout_AttachmentQuestionElementType {
      type
      id
      name
      variableName
      label
      order
      catalogItem
      variableSet
      mandatory
      canRead
      canWrite
      canCreate
      variableAttributes
      defaultValue
      contentType
    }
  }
`;
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


export const CONTEXTUAL_LINK_NAMES = {
    header: {
        name: t("Form Header"),
        order: 1
    },
    uiActions: {
        name: t("UI Actions"),
        order: 2
    },
    ribbon: {
        name: t("Ribbon"),
        order: 3
    },
    formLayout: {
        name: t("Form Layout"),
        order: 4
    },
    relatedItems: {
        name: t("Related Items"),
        order: 5
    },
    relatedLists: {
        name: t("Related Lists"),
        order: 6
    },
    contextualSidePanel: {
        name: t("Contextual Side Panel"),
        order: 7
    }
};

const LAYOUT_QUERY_KEY = 'GlideLayout_Query';
const FORM_LAYOUT_QUERY_KEY = 'formLayout';
const RECORD_VALUES_KEY = 'recordValues';
const FIELD_ELEMENTS_KEY = 'elementsData';
const FORMATTER_QUERY_KEY = 'formatters';
const RELATED_LISTS_QUERY_KEY = 'relatedLists';
const SECTION_LAYOUT = 'sectionLayout';
const FIELD_STATES_QUERY_KEY = 'fieldStates';
const ENCODED_RECORD_KEY = 'encodedRecord';
const IS_VALID_RECORD = 'isValidRecord';
const CAN_READ_RECORD = 'canReadRecord';
const SYS_ID_KEY = 'sysId';
const BASE_TABLE = 'baseTable';
const TABLE = 'table';
const IS_SCRIPTABLE_TABLE = 'isScriptableTable';
const LAST_ERROR_MESSAGE = 'lastErrorMessage';
const FIELD_VARIABLES_KEY = 'variables';
const VARIABLES_LAYOUT = 'variablesLayout';
const FORM_SETTINGS_KEY = 'formSettings';
const FORM_TABS_KEY = 'formTabs';
const ANNOTATIONS_QUERY_KEY = 'annotations';
const DOMAIN_SEPARATION = 'domainSeparation';

const QUERY_FRAGMENT = `
GlideLayout_Query {
	formLayout(table: $table, view: $view, sysId: $sysId, query: $query) {
		baseTable
		table
		isValidRecord
		canReadRecord
		isScriptableTable
		lastErrorMessage
		domainSeparation {
			canExpandScope
			determiningFieldName
			domainId
		}
		sectionLayout {
			sysId
			caption
			captionDisplay
			rows {
				fields
			}
		}
		formSettings {
			isDetailsHidden
			isSectionMenuHidden
			isSectionCollapseDisabled
			defaultSection {
				sysId
				caption
				captionDisplay
			}
		}
		formTabs {
			isDefaultTabOrder
			defaultTabFocus
			tabsOrder {
			  label
			  value
			}
		}
		encodedRecord
		sysId
		recordValues {
			name
			value
			displayValue
			valuesList {
				value
				displayValue
			}
		}
		fieldStates {
			name
			hidden
			mandatory
			readonly
		},
		relatedLists {
			sourceTable
			targetTable
			count
			filter
			displayLabel
			label
			value
			relatedField
		}
		formatters {
			name
			sys_id
		}
		annotations {
			sysId
			text
			annotationType
			typeDisplayValue
			isPlainText
		}
		${VARIABLE_LAYOUT_QUERY_FRAGMENT}
		elementsData {
			name:elementName
			dictionary:dictionaryData {
				type:dictionaryType
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

			... on GlideLayout_FileAttachmentElementType {
				value
				displayValue
				state
				contentType
			}

			... on GlideLayout_TableNameElementType {
				displayValue
			}

			... on GlideLayout_CurrencyElementType {
				value
				code
				defaultCurrency
				currencyCodes {
					code
					symbol
				}
			}
			... on GlideLayout_PhoneNumberElementType {
				value
				country
				countryCodes {
				  code
				  name
				}
			}

			... on GlideLayout_GlideListElementType {
				reference
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

			... on GlideLayout_VariablesElementType {
			    ${FIELD_VARIABLES_KEY} : ${GlideElementVariables_ELEMENTS_QUERY_FRAGMENT}
			}

			... on GlideLayout_ValueElementType {
				maxLength
				defaultRows
			}

			... on GlideLayout_GlideVarElementType {
				modelTable
				glidevars: _elements {
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

					... on GlideLayout_CurrencyElementType {
						value
						code
						defaultCurrency
						currencyCodes {
							code
							symbol
						}
					}
					... on GlideLayout_PhoneNumberElementType {
						value
						country
						countryCodes {
						code
						name
						}
					}
					... on GlideLayout_GlideListElementType {
						reference
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
				}
			}
		}
	}
}
`;

// workspace enabled variable editors
const SERVICE_CATALOG_VEDITOR = 'com_glideapp_servicecatalog_veditor';
const SERVICE_CATALOG_QUESTION_EDITOR =
    'com_glideapp_questionset_default_question_editor';
const FORMATTER_SUFFIX = '.xml';
const isValidFormatter = (formatters: any = {}, formatterName: any) =>
    _.isObject(formatters[formatterName]) ||
    _.isObject(formatters[formatterName + FORMATTER_SUFFIX]);
const transformFormatter = (formatters: any) =>
    formatters.reduce(
        (formattersByName: any, formatter: any) => ({
            ...formattersByName,
            [formatter.name]: formatter
        }),
        {}
    );
const transformRelatedLists = (relatedLists: any = []) =>
    relatedLists
        .filter((relatedList: any) => relatedList.displayLabel !== '')
        .map((relatedList: any) => ({
            table: relatedList.targetTable,
            parentTable: relatedList.sourceTable,
            displayName: relatedList.displayLabel || relatedList.label,
            label: relatedList.label,
            value: relatedList.value,
            count: relatedList.count,
            filter: relatedList.filter,
            field: relatedList.relatedField,
            related_field: relatedList.relatedField,
            visible: true
        }));

const transformFormFieldValues = (
    table: any,
    sysId: any,
    recordValues: any,
    fieldElements: any,
    fieldStates: any,
    isFormReadonly: any,
    declarativeUIActions: any,
    variablesLayout: any,
    annotations: any
) => {
    const formFieldValues: any = _.reduce(
        glideFormDataParser.parseFieldGraphQLResponse(
            table,
            sysId,
            recordValues,
            fieldElements,
            fieldStates,
            annotations
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
    if (formFieldValues['variables']) {
        formFieldValues['variables'].variablesLayout = variablesLayout;
        let catalogVariablesList = _.filter(
            formFieldValues,
            field => !!field['_cat_variable']
        );
    }
    if (!isFormReadonly) return formFieldValues;
    return _.reduce(
        formFieldValues,
        (fields, field: any, key) => ({
            ...fields,
            [key]: {
                ...field,
                sys_readonly: true,
                readonly: true
            }
        }),
        {}
    );
};

const transformFormFields = (formFieldValues: any) =>
    _.map(formFieldValues, value => value);

const transformGlideVars = (elements: any, recordValues: any) => {
    let glidevarSection: any = {};
    let elementsData: any = [];
    elements
        .filter((element: any) => element.dictionary.type === 'glide_var')
        .forEach((element: any) => {
            const {
                name,
                dictionary: { name: caption, label: captionDisplay },
                modelTable,
                glidevars
            } = element;
            if (!glidevars) return;

            let fields: any = [];
            glidevars.forEach((variable: any) => {
                const fieldName = `${name}.${modelTable}.${variable.name}`;
                elementsData.push({
                    ...variable,
                    name: fieldName
                });
                fields.push(fieldName);
            });

            const section = { caption, captionDisplay, fields };
            glidevarSection[caption] = section;
        });
    return { glidevarSection, elementsData };
};

const transformSections = (
    sections: any,
    formSettings: any,
    showVariableEditor: any,
    glidevarSection: any
) => {
    const defaultSection = _.get(formSettings, 'defaultSection.sysId', NaN);

    const allSections = sections.reduce((acc: any, section: any) => {
        //if (!section.rows || !section.rows.length) section.rows = [];
        const newRows = section.rows.reduce((accuRows: any, cols: any) => {
            const newCols = cols.reduce((accCols: any, col: any) => {
                const newFields = col.fields.reduce((accFields: any, field: any) => {
                    if (!glidevarSection[field]) return [...accFields, field];

                    return [...accFields, ...glidevarSection[field].fields];
                }, []);
                return !newFields.length
                    ? accCols
                    : [...accCols, { fields: newFields }];
            }, []);
            return !newCols.length ? accuRows : [...accuRows, newCols];
        }, []);

        return [...acc, { ...section, rows: newRows }];
    }, []);

    const sectionsWithVariableEditor = showVariableEditor
        ? _.concat(allSections, { captionDisplay: 'Variables' })
        : allSections;

    return sectionsWithVariableEditor.map((section: any, index: any) => ({
        ...section,
        id: index,
        //this is to align with glideFormFaction
        caption: (section.caption || section.captionDisplay || '')
            .toLowerCase()
            .replace(' ', '_')
            .replace(/[^0-9a-z_]/gi, ''),
        label: section.captionDisplay,
        defaultSection: defaultSection === section.sysId,
        expanded: true
    }));
};

const trasnformAnnotation = (annotations: any) =>
    _.reduce(
        annotations,
        (annotationsById, annotation) => ({
            ...annotationsById,
            [annotation.sysId]: {
                ...annotation,
                type: 'annotation',
                name: 'annotation.' + annotation.sysId
            }
        }),
        {}
    );

const createTransform = (getValueOrDefault: any) => (
    data: any,
    state: any,
    properties: any,
    declarativeUIActions = {}
) => {
    const {
        isFormReadonly,
        record: { view }
    } = state;
    const { table, sysId: orgSysId } = properties;
    const isValidRecord = getValueOrDefault(IS_VALID_RECORD, false)(data);
    const isNewRecord = orgSysId == '-1';
    const canReadRecord = getValueOrDefault(CAN_READ_RECORD, false)(data);
    const isTemplateComponentEnabled = getValueOrDefault(ENCODED_RECORD_KEY)(
        data
    );
    const newSysId = getValueOrDefault(SYS_ID_KEY)(data);
    const encodedRecord = getValueOrDefault(ENCODED_RECORD_KEY)(data);
    const recordValues = getValueOrDefault(RECORD_VALUES_KEY, false)(data);
    const formTabs = getValueOrDefault(FORM_TABS_KEY)(data);
    const formSettings = getValueOrDefault(FORM_SETTINGS_KEY)(data);
    const orgFieldElements = getValueOrDefault(FIELD_ELEMENTS_KEY, [])(
        data
    ).filter((el: any) => _.get(el, 'dictionary.canRead') !== false);
    const baseTable = getValueOrDefault(BASE_TABLE)(data);
    const isScriptableTable = getValueOrDefault(IS_SCRIPTABLE_TABLE, false)(
        data
    );
    const lastErrorMessage = getValueOrDefault(LAST_ERROR_MESSAGE)(data);
    const domainSeparation = getValueOrDefault(DOMAIN_SEPARATION)(data);
    const formatters = transformFormatter(
        getValueOrDefault(FORMATTER_QUERY_KEY, [])(data)
    );
    const showVariableEditor =
        isValidFormatter(formatters, SERVICE_CATALOG_VEDITOR) ||
        isValidFormatter(formatters, SERVICE_CATALOG_QUESTION_EDITOR);

    const {
        glidevarSection,
        elementsData: glidevarElements
    } = transformGlideVars(orgFieldElements, recordValues);
    const fieldElements = [...orgFieldElements, ...glidevarElements];
    const sections = transformSections(
        getValueOrDefault(SECTION_LAYOUT, [])(data),
        formSettings,
        showVariableEditor,
        glidevarSection
    );
    const relatedLists = isNewRecord
        ? []
        : transformRelatedLists(
            getValueOrDefault(RELATED_LISTS_QUERY_KEY, [])(data)
        );
    const fieldStates = getValueOrDefault(FIELD_STATES_QUERY_KEY, [])(
        data
    ).reduce(
        (fieldStates: any, state: any) => ({ ...fieldStates, [state.name]: state }),
        {}
    );

    const sectionSysId = _.get(sections, '[0].sysId') || '';
    const configurationItems = [
        {
            order: CONTEXTUAL_LINK_NAMES.relatedLists.order,
            label: CONTEXTUAL_LINK_NAMES.relatedLists.name,
            url: encodeURIComponent(
                `slushbucket.do?sysparm_referring_url=${table}.do&sysparm_view=${view}&sysparm_list=${table}&sysparm_form=related_list`
            )
        },
        {
            order: CONTEXTUAL_LINK_NAMES.formLayout.order,
            label: CONTEXTUAL_LINK_NAMES.formLayout.name,
            url: encodeURIComponent(
                `slushbucket.do?sysparm_referring_url=${table}.do&sysparm_view=${view}&sysparm_list=${sectionSysId}&sysparm_form=section`
            )
        }
    ];

    const variablesLayout = getValueOrDefault(VARIABLES_LAYOUT)(data);
    const annotations = trasnformAnnotation(
        getValueOrDefault(ANNOTATIONS_QUERY_KEY, [])(data)
    );

    const formFieldValues = transformFormFieldValues(
        table,
        newSysId,
        recordValues,
        fieldElements,
        fieldStates,
        isFormReadonly,
        declarativeUIActions,
        variablesLayout,
        annotations
    );
    const formFields = transformFormFields(formFieldValues);

    return {
        isValidRecord,
        isNewRecord,
        canReadRecord,
        isTemplateComponentEnabled,
        sysId: newSysId,
        encodedRecord,
        recordValues,
        fieldElements,
        baseTable,
        table,
        isScriptableTable,
        lastErrorMessage,
        domainSeparation,
        formatters,
        showVariableEditor,
        sections,
        relatedLists,
        fieldStates,
        formFieldValues,
        formFields,
        formTabs,
        formSettings,
        configurationItems
    };
};

export const createFormLayoutDataSource = (queryPrefix = '') => {
    const baseKey = `${queryPrefix}${LAYOUT_QUERY_KEY}.${FORM_LAYOUT_QUERY_KEY}`;
    const getValueOrDefault = getValue(baseKey);
    const transform = createTransform(getValueOrDefault);

    return createDataProviderDataSource({
        query: QUERY_FRAGMENT,
        variables: ['table', 'sysId', 'query', 'view'],
        transform,
        props: {
            table: { default: '' },
            sysId: { default: '' },
            query: { default: '' },
            view: { default: '' }
        },
        selectableProps: {
            isValidRecord: {},
            isNewRecord: {},
            canReadRecord: {},
            isTemplateComponentEnabled: {},
            sysId: {},
            recordValues: {},
            fieldElements: {},
            baseTable: {},
            table: {},
            isScriptableTable: {},
            lastErrorMessage: {},
            domainSeparation: {},
            formatters: {},
            showVariableEditor: {},
            sections: {},
            relatedLists: {},
            fieldStates: {},
            formFieldValues: {},
            formFields: {},
            formSettings: {},
            formTabs: {},
            configurationItems: {}
        }
    });
};
