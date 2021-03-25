import {getValue, createDataProviderDataSource} from "../utils";

// @ts-ignore
import { t } from "@servicenow/library-translate";

export const UI_ACTION_TYPES = {
    BUTTON: "Button",
    MENU: "Menu",
    SPLIT_BUTTON: "Split Button"
};

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


export const UI_ACTION_QUERY_KEY = "GlideUIAction_Query";
export const UI_ACTIONS_KEY = "uiActions";
export const UI_ACTION_FORM_ACTIONS = "formActions";
export const UI_ACTION_MESSAGES = "messages";
export const UI_ACTION_NODES = "actionNodes";
export const QUERY_FRAGMENT = `
${UI_ACTION_QUERY_KEY} {
    ${UI_ACTIONS_KEY}(table:$table, sysId:$sysId, query: $query, view: $view, workspaceConfigId: $workspaceConfigId) {
    	${UI_ACTION_MESSAGES} {
			name
			value
		}
		${UI_ACTION_NODES} {
			... on GlideUIAction_UIAction {
				label
				name
				sysId
				order
				hasClientScript
				clientScript
				type
				style
				hint
			}
			... on GlideUIAction_UIActionGroupLayout {
				label
				overflow
				type
				style
				order
				groupActions {
					label
					name
					sysId
					order
					hasClientScript
					clientScript
					type
					style
					hint
				}
			}
		}
    }
}`;

const transformMessages = (messages: any[] = []) =>
    messages.reduce(
        (loadedMessages, message) =>
            message.name
                ? {
                    ...loadedMessages,
                    [message.name]: message.value
                }
                : loadedMessages,
        {}
    );

const transformAction = (action: any) => ({
    sysId: action.sysId,
    id: action.sysId,
    label: action.label || action.title,
    hint: action.hint
});

const transformActions = (actions: any[]) => {
    return actions.map(action => transformAction(action));
};

const getActionsFromNodes = (nodes: any[]) => {
    const existingKeys: any[] = [];
    return nodes.reduce((arr, node) => {
        if (!node.groupActions) {
            if (!(node.sysId in existingKeys)) {
                existingKeys[node.sysId] = null;
                arr.push(node);
            }
        } else {
            for (const action of node.groupActions) {
                if (!(action.sysId in existingKeys)) {
                    existingKeys[action.sysId] = null;
                    arr.push(action);
                }
            }
        }
        return arr;
    }, []);
};

const transformActionNodes = (nodes: any[]) => {
    let nodeId = 1;
    return nodes.map((node: any) => {
        const hasChildren = node.groupActions;
        const hasMultipleChildren = hasChildren && node.groupActions.length > 1;
        return {
            id: nodeId++,
            label: node.type === UI_ACTION_TYPES.MENU ? node.label : "",
            overflow: "overflow" in node ? node.overflow : node.type === "menuItem",
            color: node.style,
            type: hasMultipleChildren ? node.type : "Button",
            children: hasChildren
                ? transformActions(node.groupActions)
                : [transformAction(node)]
        };
    });
};

const createTransform = (getValueOrDefault: any) => (data: any, state: any, properties: any) => {
    const {
        isFormReadonly,
        properties: { table }
    } = state;
    const { record: { trueTable = table } = {} } = state;

    const actionNodeData = getValueOrDefault(UI_ACTION_NODES, [])(data);
    const uiActionNodes = transformActionNodes(actionNodeData);

    const formActions =
        !uiActionNodes ? [] : getActionsFromNodes(actionNodeData);

    const encodedQuery = encodeURIComponent(
        `table=${trueTable}^ORtable=global^form_button_v2=true^ORform_menu_button_v2=true^active=true`
    );
    const configurationItem = {
        order: CONTEXTUAL_LINK_NAMES.uiActions.order,
        label: CONTEXTUAL_LINK_NAMES.uiActions.name,
        url: encodeURIComponent(
            `sys_ui_action_list.do?sysparm_query=${encodedQuery}`
        )
    };

    const messages = transformMessages(
        getValueOrDefault(UI_ACTION_MESSAGES, [])(data)
    );

    return {
        formActions,
        uiActionNodes,
        configurationItem,
        messages
    };
};

export const createUIActionDataSource = (queryPrefix = "") => {
    const baseKey = `${queryPrefix}${UI_ACTION_QUERY_KEY}.${UI_ACTIONS_KEY}`;
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
            formActions: {
                default: []
            },
            configurationItem: {},
            messages: {
                default: []
            },
            uiActionNodes: {
                default: []
            }
        }
    });
};

export default createUIActionDataSource();
