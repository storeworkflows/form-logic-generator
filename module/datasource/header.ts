import _ from "lodash";
// @ts-ignore
import { t } from "@servicenow/library-translate";
import {getValue, createDataProviderDataSource} from "../utils";


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


export const ITEM_TYPES = {
    SIMPLE: "simple",
    REFERENCE: "reference",
    HIGHLIGHTED: "highlighted"
};

const HEADER_CONFIG_KEY = "headerConfig";
const HEADER_ITEMS = "headerItems";
const HEADER_SYS_ID = "headerSysId";
const HEADER_PRIMARY_ITEM = "primaryItem";
const HEADER_SECONDARY_ITEMS = "secondaryItems";
const HEADER_HIGHLIGHTED_VALUE_STYLE = "highlightedValueStyle";
const HEADER_REFERENCE_ITEM = "referenceItem";
const HEADER_RECORD_DISPLAY_VALUE = "recordDisplayValue";
const HEADER_TABLE_DISPLAY_VALUE = "tableDisplayValue";
const HEADER_SUBHEADING_ITEM = "subheadingItem";
const HEADER_IMAGE_ITEM = "headerImageItem";
const HEADER_HIDE_TAGS_ITEM = "hideTags";
const QUERY_FRAGMENT = `
${HEADER_CONFIG_KEY}:GlideHeaderQuery_Query {
	${HEADER_ITEMS}(table: $table, sysId: $sysId, workspaceConfigId: $workspaceConfigId) {
		${HEADER_SYS_ID}
		${HEADER_RECORD_DISPLAY_VALUE}
		${HEADER_TABLE_DISPLAY_VALUE}
		${HEADER_HIDE_TAGS_ITEM}
		${HEADER_PRIMARY_ITEM} {
			fieldName
			fieldLabel
			displayValue
		}
		${HEADER_SUBHEADING_ITEM} {
			fieldName
			fieldLabel
			displayValue
		}
		${HEADER_IMAGE_ITEM} {
			fieldName
			fieldLabel
			headerImage
		}
		${HEADER_SECONDARY_ITEMS} {
			fieldName
			fieldLabel
			displayValue
			${HEADER_HIGHLIGHTED_VALUE_STYLE} {
				field
				value
				status
				showIcon
			}
			${HEADER_REFERENCE_ITEM} {
				table
				sysId
			}
		}
	}
}
`;

const transformHighlightedItem = (item: any) => {
    const { highlightedValueStyle, type } = item;
    if (!highlightedValueStyle || type) return item;
    const { status, value: displayValue, showIcon } = highlightedValueStyle;
    return {
        ..._.omit(item, "highlightedValueStyle"),
        status,
        displayValue,
        showIcon,
        type: ITEM_TYPES.HIGHLIGHTED
    };
};

const transformReferenceItem = (item: any) => {
    const { referenceItem, type } = item;
    if (!referenceItem || type) return item;
    const { table, sysId } = referenceItem;
    return {
        ..._.omit(item, "referenceItem"),
        table,
        sysId,
        type: ITEM_TYPES.REFERENCE
    };
};

const transformSimpleItem = (item: any) => {
    if (item.type) return item;
    return {
        ...item,
        type: ITEM_TYPES.SIMPLE
    };
};

const transformSecondaryItems = (secondaryItems: any[]) =>
    secondaryItems.map(item =>
        transformSimpleItem(transformReferenceItem(transformHighlightedItem(item)))
    );

const createTransform = (getValueOrDefault: any) => (data: any, state: any, properties: any) => {
    const { sysId } = properties;
    const headerSysId = getValueOrDefault(HEADER_SYS_ID, "")(data);
    const tableDisplayValue = getValueOrDefault(HEADER_TABLE_DISPLAY_VALUE, "")(
        data
    );
    const recordDisplayValue = getValueOrDefault(HEADER_RECORD_DISPLAY_VALUE, "")(
        data
    );
    const primaryItem = getValueOrDefault(HEADER_PRIMARY_ITEM)(data);
    const primaryValue =
        sysId === "-1"
            ? t("Create New {0}", tableDisplayValue)
            : _.get(primaryItem, "displayValue", recordDisplayValue);
    const secondaryItems = transformSecondaryItems(
        getValueOrDefault(HEADER_SECONDARY_ITEMS, [])(data)
    );
    const configurationItem = {
        order: CONTEXTUAL_LINK_NAMES.header.order,
        label: CONTEXTUAL_LINK_NAMES.header.name,
        url: encodeURIComponent(`sys_aw_form_header.do?sys_id=${headerSysId}`)
    };
    const hideTagsValue = getValueOrDefault(HEADER_HIDE_TAGS_ITEM)(data);
    const subHeadingValue = getValueOrDefault(HEADER_SUBHEADING_ITEM)(data);
    const headerImageItem = getValueOrDefault(HEADER_IMAGE_ITEM)(data);

    return {
        recordDisplayValue,
        primaryItem,
        primaryValue,
        secondaryItems,
        tableDisplayValue,
        configurationItem,
        hideTagsValue,
        headerImageItem,
        subHeadingValue
    };
};

export const createHeaderDataSource = (queryPrefix = "") => {
    const baseKey = `${queryPrefix}${HEADER_CONFIG_KEY}.${HEADER_ITEMS}`;
    const getValueOrDefault = getValue(baseKey);
    const transform = createTransform(getValueOrDefault);
    return createDataProviderDataSource({
        query: QUERY_FRAGMENT,
        variables: ["table", "sysId", "workspaceConfigId"],
        transform,
        props: {
            table: { default: "" },
            sysId: { default: "" },
            workspaceConfigId: { default: "" }
        },
        selectableProps: {
            primaryValue: {
                default: ""
            },
            secondaryItems: {
                default: []
            },
            tableDisplayValue: { default: "" },
            recordDisplayValue: { default: "" },
            configurationItem: {}
        }
    });
};
