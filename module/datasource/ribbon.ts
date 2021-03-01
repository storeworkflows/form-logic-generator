import {getValue, createDataProviderDataSource} from "../utils";

import {CONTEXTUAL_LINK_NAMES} from "./header";

export const RIBBON_QUERY_KEY = 'AppRibbonConfig_Query';
export const RIBBON_CONFIG_KEY = 'ribbonConfig';
export const QUERY_FRAGMENT = `
${RIBBON_QUERY_KEY} {
	${RIBBON_CONFIG_KEY}:getRibbonConfig(sourceTable: $table, workspaceConfigId: $workspaceConfigId) {
      _results {
          table {
            value
            displayValue
          }
          name {
            value
            displayValue
          }
          attrs {
            variables {
              variableName
              variableValue
            }
          }
          component {
            value
            displayValue
          }
          tag {
            value
            displayValue
          }
          width {
            value
            displayValue
          }
          order {
            value
            displayValue
          }
        }
	}
}
`;

const createTransform = (getValueOrDefault: any) => (data: any, state: any, properties: any) => {
    const { sysId: orgSysId } = properties;
    const { trueTable } = state.record;
    const ribbonWidgets = getValueOrDefault('_results', [])(data);
    const hasRibbonWidgets = orgSysId !== '-1' && ribbonWidgets.length > 0;
    const encodedQuery = encodeURIComponent(`table=${trueTable}^ORDERBYorder`);
    const configurationItem = {
        order: CONTEXTUAL_LINK_NAMES.ribbon.order,
        label: CONTEXTUAL_LINK_NAMES.ribbon.name,
        url: encodeURIComponent(
            `sys_aw_ribbon_setting_list.do?sysparm_query=${encodedQuery}`
        )
    };
    return {
        widgets: ribbonWidgets,
        isVisible: hasRibbonWidgets,
        configurationItem,
        hasRibbonWidgets
    };
};

export const createRibbonDataSource = (queryPrefix = '') => {
    const baseKey = `${queryPrefix}${RIBBON_QUERY_KEY}.${RIBBON_CONFIG_KEY}`;
    const getValueOrDefault = getValue(baseKey);
    const transform = createTransform(getValueOrDefault);
    return createDataProviderDataSource({
        query: QUERY_FRAGMENT,
        variables: ['table', 'workspaceConfigId'],
        templateVariables: [],
        transform,
        props: {
            table: { default: '' }
        },
        selectableProps: {
            widgets: {
                default: []
            },
            isVisible: {
                default: false
            },
            hasRibbonWidgets: {},
            configurationItem: {}
        }
    });
};
