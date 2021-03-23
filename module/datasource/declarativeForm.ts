import {getValue, createDataProviderDataSource} from "../utils";

import _ from "lodash";

// @ts-ignore
import { t } from "@servicenow/library-translate";
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


export const DECLARATIVE_ACTIONS_QUERY_KEY = "GlideDeclarativeActions_Query";
export const DECLARATIVE_ACTIONS_FORM_QUERY_KEY =
    "GlideDeclarativeActions_formQuery";
export const FORM_DECLARATIVE_ACTIONS_KEY = "formDeclarativeActions";
export const FORM_ACTIONS_KEY = "formActions";
export const QUERY_FRAGMENT = `
${DECLARATIVE_ACTIONS_QUERY_KEY} {
	${DECLARATIVE_ACTIONS_FORM_QUERY_KEY} {
		${FORM_DECLARATIVE_ACTIONS_KEY} (table: $table, view: $view, sysId: $sysId, query: $query, source: "form", workspaceConfigId: $workspaceConfigId) {
			${FORM_ACTIONS_KEY} {
				position
                actions {
                    name
                    icon
                    label
                    tooltip
                    actionComponent
                    actionAttributes
                    order
					assignmentId
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


const DA_FORM_MODEL_SYSID = "360935e9534723003eddddeeff7b127d";

const FORM_ACTION_POSITION = {
    sideBar: "contexual_sidebar",
    relatedItem: "related_item"
};

const formActionsForPosition = (formActions: any, position: any) => {
    return !formActions
        ? []
        : (formActions.find((formAction: any) => formAction.position === position) || {})
        .actions || [];
};

const createTransform = (getValueOrDefault: any) => (data: any, state: any, properties: any) => {
    const wsConfigSysId = _.get(state, "behaviors.wsConfigSysId", "");
    const { workspaceConfigId = wsConfigSysId } = properties;
    const { table } = state.properties;
    const { trueTable = table, view } = state.record || state.properties;
    const { sideBar, relatedItem } = FORM_ACTION_POSITION;
    console.log(data, state, properties);
    const formActions = getValueOrDefault(FORM_ACTIONS_KEY, [])(data);
    const relatedItems = formActionsForPosition(formActions, relatedItem).map(
        (action: any) => ({ ...action, name: action.name || action.actionComponent })
    );
    const sidebarActions = formActionsForPosition(formActions, sideBar).map(
        (action: any) => ({ ...action, name: action.name || action.actionComponent })
    );

    const configUrl = `sys_declarative_action_assignment_list.do%3Fsysparm_query%3Dtable%3D${trueTable}%5EORtable%3Dglobal
							%5Eview.name%3D${view}%5EORview.nameISEMPTY
							%5Eworkspace%3D${workspaceConfigId}%5EORworkspaceISEMPTY
							%26sysparm_view%3Dform_action%26sysparm_fixed_query%3Dmodel%3D${DA_FORM_MODEL_SYSID}%5Eform_position%3D`;

    const configurationItems = [
        {
            order: CONTEXTUAL_LINK_NAMES.contextualSidePanel.order,
            label: CONTEXTUAL_LINK_NAMES.contextualSidePanel.name,
            url: `${configUrl}${FORM_ACTION_POSITION.sideBar}`
        },
        {
            order: CONTEXTUAL_LINK_NAMES.relatedItems.order,
            label: CONTEXTUAL_LINK_NAMES.relatedItems.name,
            url: `${configUrl}${FORM_ACTION_POSITION.relatedItem}`
        }
    ];

    return {
        relatedItems,
        sidebarActions,
        configurationItems
    };
};

export const createDeclarativeFormActionDataSource = (queryPrefix = "") => {
    const baseKey = `${queryPrefix}${DECLARATIVE_ACTIONS_QUERY_KEY}.${DECLARATIVE_ACTIONS_FORM_QUERY_KEY}.${FORM_DECLARATIVE_ACTIONS_KEY}`;
    const getValueOrDefault = getValue(baseKey);
    const transform = createTransform(getValueOrDefault);

    return createDataProviderDataSource({
        query: QUERY_FRAGMENT,
        variables: ["table", "view", "sysId", "query", "workspaceConfigId"],
        transform,
        props: {
            table: { default: "" },
            view: { default: "" },
            sysId: { default: "" },
            query: { default: "" },
            workspaceConfigId: { default: "" }
        },
        selectableProps: {
            relatedItems: {
                default: []
            },
            sidebarActions: {
                default: []
            },
            configurationItems: {}
        }
    });
};
