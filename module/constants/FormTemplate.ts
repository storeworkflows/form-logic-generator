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


export const LAYOUT_QUERY_KEY = 'GlideLayout_Query';
export const FORM_LAYOUT_QUERY_KEY = 'formLayout';
export const RECORD_VALUES_KEY = 'recordValues';
export const FIELD_ELEMENTS_KEY = 'elementsData';
export const FORMATTER_QUERY_KEY = 'formatters';
export const ANNOTATIONS_QUERY_KEY = 'annotations';
export const RELATED_LISTS_QUERY_KEY = 'relatedLists';
export const FIELD_VARIABLES_KEY = 'variables';

export const LayoutQueryFragment = `
GlideLayout_Query {
	formLayout(table: $table, view: "$$parent.viewName$$", sysId: $sysId, query: $query) {
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
			
			... on GlideLayout_TableNameElementType {
				displayValue
			}

			... on GlideLayout_FileAttachmentElementType {
				value
				displayValue
				state
				contentType
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

export const SCRIPTING_QUERY_KEY = 'GlideClientScriptingEnvironment_Query';
export const GLOBALS_QUERY_KEY = 'ClientScriptingEnvironment_Globals';
export const UI_POLICIES_QUERY_KEY = 'ClientScriptingEnvironment_Policies';
export const CLIENT_SCRIPTS_QUERY_KEY = 'ClientScriptingEnvironment_Scripts';
export const GlideClientScriptingEnvironmentQueryFragment = `
GlideClientScriptingEnvironment_Query {
	${GLOBALS_QUERY_KEY}(table: $table, sysId: $sysId, query: $query) {
		g_scratchpad
		g_language
		g_date_time_format
		g_decimal_separator
		g_user_grouping
		g_text_direction
		g_is_accessible
	}
	${CLIENT_SCRIPTS_QUERY_KEY}(table: $table, view: "$$parent.viewName$$", sysId: $sysId, query: $query) {
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
	${UI_POLICIES_QUERY_KEY}(table: $table, view: "$$parent.viewName$$", sysId: $sysId, query: $query) {
		shortDescription
		sysId
		reverse
		onLoad
		isRunScripts
		preEvaluated
		preEvaluatedResult
		scriptTrue {
			name
			script
		}
		scriptFalse {
			name
			script
		}
		actions {
			visible
			name
			disabled
			mandatory
			cleared: clearValue
			relatedList
		}
		conditions {
			type
			term
			field: fieldName
			fieldLabel
			columnType
			value
			oper: operator
			operatorLabel
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
	${CATALOG_SCRIPTS_FRAGMENT}
	${CATALOG_POLICIES_FRAGMENT}

}
`;

export const UI_ACTION_QUERY_KEY = 'GlideUIAction_Query';
export const UI_ACTIONS_KEY = 'uiActions';
export const UI_ACTION_FORM_ACTIONS = 'formActions';
export const UI_ACTION_NODES = 'uiActionNodes';
export const UIActionQueryFragment = `
${UI_ACTION_QUERY_KEY} {
    ${UI_ACTIONS_KEY}(table:$table, sysId:$sysId, query: $query, view:"$$parent.viewName$$") {
    	${UI_ACTION_FORM_ACTIONS} {
        	label
        	name
        	sysId
        	order
			style
			type
			clientScript
			hasClientScript
			hint
			}
			messages {
					name
					value
			}
			
	}
}
`;

export const USER_QUERY_KEY = 'GlideDomain_Query';
export const USER_QUERY_USER_KEY = 'user';
export const UserQueryFragment = `
${USER_QUERY_KEY} {
	user {
		roles
		allRoles
		groups
		groupList {
			groupId
			name
		}
		sys_id
		userName
		firstName
		lastName
		title
		avatar
		departmentId
		email
	}
}
`;

export const DATALOOKUP_QUERY_KEY = 'GlideDataLookupQuery_Query';
export const DATALOOKUP_CONFIG_KEY = 'dataLookup';
export const DATALOOKUP_FIELDS_KEY = 'fields';
export const DataLookupFragment = `
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

export const SESSION_MESSAGE_QUERY_KEY = 'GlideDomain_Query';
export const SESSION_MESSAGE_CONFIG_KEY = 'session';
export const SESSION_MESSAGE_NOTIFICATIONS_KEY = 'notifications';
export const SessionMessageFragment = `
${SESSION_MESSAGE_QUERY_KEY} {
	${SESSION_MESSAGE_CONFIG_KEY} {
		notifications{
			type
			text
			notificationType
			notificationAttributes {
				attributeName
				attributeValue
			}
			childNotifications {
				type
				text
				notificationType
			}
		}
	}
}
`;

export const ATTACHMENT_ACL_QUERY_KEY = 'GlideAttachmentQuery_Query';
export const ATTACHMENT_ACL_ATTACHMENTS_KEY = 'attachments';
export const AttachmentAclQueryFragment = `
	${ATTACHMENT_ACL_QUERY_KEY} {
		${ATTACHMENT_ACL_ATTACHMENTS_KEY} (table: $table, sysId: $sysId) {
			canCreate
		}
	}
`;

export const QUERY_PREFIX =
    'GlideViewQuery_Query.uiView.glideLayoutItem._query.';
