import {getValue, createDataProviderDataSource} from "../utils";

export const DECLARATIVE_ACTIONS_QUERY_KEY = 'GlideDeclarativeActions_Query';
export const DECLARATIVE_ACTIONS_FIELD_QUERY_KEY =
    'GlideDeclarativeActions_fieldQuery';
export const FIELD_DECLARATIVE_ACTIONS_KEY = 'fieldDeclarativeActions';
export const FIELD_ACTIONS_KEY = 'fieldActions';
export const QUERY_FRAGMENT = `
${DECLARATIVE_ACTIONS_QUERY_KEY} {
	${DECLARATIVE_ACTIONS_FIELD_QUERY_KEY} {
		${FIELD_DECLARATIVE_ACTIONS_KEY} (table: $table, view: $view, sysId: $sysId, query: $query, source: "field", workspaceConfigId: $workspaceConfigId) {
			${FIELD_ACTIONS_KEY} {
				field
				actions  {
					name
					icon
					label
					dependency
					requiresValue
					order
					conditions
					actionType
            		actionComponent
            		actionDispatch
            		actionPayload
					actionAttributes
					groupBy
					group
					assignmentId
					confirmationRequired
					confirmationMessage
					tooltip
					modelConditions {
						field
						operator
						value
						newQuery
						or
					}
					payloadMap {
						name
						value
					}
				}
			}
		}
	}
}`;

const createTransform = (getValueOrDefault: any) => (data: any) => {
    const items = getValueOrDefault(FIELD_ACTIONS_KEY, [])(data);
    const declarativeFieldActions = items
        ? items.reduce(
            (mapper: any, { field, actions }: any) => ({
                ...mapper,
                [field]: actions
            }),
            {}
        )
        : [];
    return {
        declarativeFieldActions
    };
};

export const createDeclarativeFieldActionDataSource = (queryPrefix = '') => {
    const baseKey = `${queryPrefix}${DECLARATIVE_ACTIONS_QUERY_KEY}.${DECLARATIVE_ACTIONS_FIELD_QUERY_KEY}.${FIELD_DECLARATIVE_ACTIONS_KEY}`;
    const getValueOrDefault = getValue(baseKey);
    const transform = createTransform(getValueOrDefault);
    return createDataProviderDataSource({
        query: QUERY_FRAGMENT,
        variables: ['table', 'view', 'sysId', 'query', 'workspaceConfigId'],
        transform,
        props: {
            table: { default: '' },
            sysId: { default: '' },
            view: { default: '' },
            query: { default: '' },
            workspaceConfigId: { default: '' }
        },
        selectableProps: {
            declarativeFieldActions: {
                default: {}
            }
        }
    });
};
