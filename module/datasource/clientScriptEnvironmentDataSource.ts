import {getValue, createDataProviderDataSource} from "../utils";

import _ from "lodash";
import uiPolicyParser from '../utils/uiPolicyParser';
import {
    CATALOG_SCRIPTS_FRAGMENT,
    CATALOG_POLICIES_FRAGMENT,
    SC_SCRIPTS_QUERY_KEY,
    SC_POLICIES_QUERY_KEY
} from '../constants/FormTemplate';
export const SCRIPTING_QUERY_KEY = 'GlideClientScriptingEnvironment_Query';
export const GLOBALS_QUERY_KEY = 'ClientScriptingEnvironment_Globals';
export const UI_POLICIES_QUERY_KEY = 'ClientScriptingEnvironment_Policies';
export const CLIENT_SCRIPTS_QUERY_KEY = 'ClientScriptingEnvironment_Scripts';

export const QUERY_FRAGMENT = `
GlideClientScriptingEnvironment_Query {
	ClientScriptingEnvironment_Globals(table: $table, sysId: $sysId, query: $query) {
		g_scratchpad
		g_language
		g_date_time_format
		g_decimal_separator
		g_user_grouping
		g_text_direction
		g_is_accessible
	}
	ClientScriptingEnvironment_Scripts(table: $table, view: $view, sysId: $sysId, query: $query) {
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
	ClientScriptingEnvironment_Policies(table: $table, view: $view, sysId: $sysId, query: $query) {
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
	},
	${CATALOG_SCRIPTS_FRAGMENT},
	${CATALOG_POLICIES_FRAGMENT}
}
`;

const transformMessages = (messages: any = []) =>
    messages.reduce(
        (loadedMessages: any, message: any) =>
            message.name
                ? {
                    ...loadedMessages,
                    [message.name]: message.value
                }
                : loadedMessages,
        {}
    );

const createTransform = (getValueOrDefault: any) => (data: any) => {
    const globals = getValueOrDefault(GLOBALS_QUERY_KEY, {})(data);
    const uiPolicies = uiPolicyParser.parseGraphQLResponse(
        getValueOrDefault(UI_POLICIES_QUERY_KEY, [])(data)
    );
    const { messages: clientScriptMessages, ...clientScripts } =
    getValueOrDefault(CLIENT_SCRIPTS_QUERY_KEY, {})(data) || {};
    const { messages: catalogClientScriptMessages, ...catalogClientScripts } =
    getValueOrDefault(SC_SCRIPTS_QUERY_KEY, {})(data) || {};
    const catalogUiPolicies = uiPolicyParser.parseGraphQLResponse(
        getValueOrDefault(SC_POLICIES_QUERY_KEY, {})(data)
    );
    const messages = transformMessages([
        ...(clientScriptMessages || []),
        ...(catalogClientScriptMessages || [])
    ]);
    const finalClientScripts = _.mergeWith(
        clientScripts,
        catalogClientScripts,
        (objValue, srcValue) => {
            if (_.isArray(objValue)) return objValue.concat(srcValue);
        }
    );
    const finalUiPolicies = uiPolicies.concat(catalogUiPolicies || []);

    return {
        globals,
        uiPolicies: finalUiPolicies,
        clientScripts: finalClientScripts,
        messages
    };
};

export const createClientScriptEnvironmentDataSource = (queryPrefix = '') => {
    const baseKey = `${queryPrefix}${SCRIPTING_QUERY_KEY}`;
    const getValueOrDefault = getValue(baseKey);
    const transform = createTransform(getValueOrDefault);

    return createDataProviderDataSource({
        query: QUERY_FRAGMENT,
        variables: ['table', 'sysId', 'query'],
        transform,
        props: {
            table: { default: '' },
            sysId: { default: '' },
            query: { default: '' }
        },
        selectableProps: {
            globals: {
                default: {}
            },
            uiPolicies: {
                default: {}
            },
            clientScripts: {
                default: {}
            },
            messages: {
                default: {}
            }
        }
    });
};
