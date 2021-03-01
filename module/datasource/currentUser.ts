import {getValue, createDataProviderDataSource} from "../utils";

import _ from "lodash"

function getProperty(propertyName: string, defaultValue: string|number) {
    return _.get(window, `ux_globals.sysprops[${propertyName}]`, defaultValue)
};

export const USER_QUERY_KEY = 'GlideDomain_Query';
export const USER_QUERY_USER_KEY = 'user';
export const QUERY_FRAGMENT = `
${USER_QUERY_KEY} {
	user {
		preferences(name: ["workspace.layout.type.{{table}}", "workspace.layout.form_ratio.{{table}}", "workspace.layout.sidebar_ratio.{{table}}"]) {
			name
			value
		}
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

const LAYOUT_CONFIG_KEY = {
    type: 'type',
    formRatio: 'form_ratio',
    sidebarRatio: 'sidebar_ratio'
};

const FORM_LAYOUT_SYS_PROP = 'sn_workspace_form.default_form_layout';

const layoutConfigName = (key: string, table: string) => `workspace.layout.${key}.${table}`;

const DEFAULT_FORM_LAYOUT_RATIOS = {
    SIDEBAR_RATIO: 27,
    FORM_RATIO: 63
};

const DEFAULT_FORM_LAYOUT_TYPE = 1;

const getDefaultFormLayoutType = () => {
    return getProperty(FORM_LAYOUT_SYS_PROP, DEFAULT_FORM_LAYOUT_TYPE);
};

const getFormLayoutType = (preference: any) => {
    if (
        !preference ||
        preference.value === undefined ||
        preference.value === null ||
        preference.value === ''
    )
        return getDefaultFormLayoutType();
    return parseInt(preference.value);
};

const getFormLayoutConfig = (preferences:any[] = [], properties: any) => {
    const { table } = properties;
    return preferences.reduce(
        (layoutConfig, preference) => {
            switch (preference.name) {
                case layoutConfigName(LAYOUT_CONFIG_KEY.type, table):
                    return {
                        ...layoutConfig,
                        formLayoutType: getFormLayoutType(preference)
                    };
                case layoutConfigName(LAYOUT_CONFIG_KEY.formRatio, table):
                    return {
                        ...layoutConfig,
                        formSizeRatio:
                            preference.value ||
                            DEFAULT_FORM_LAYOUT_RATIOS.FORM_RATIO
                    };
                case layoutConfigName(LAYOUT_CONFIG_KEY.sidebarRatio, table):
                    return {
                        ...layoutConfig,
                        sideBarSizeRatio:
                            preference.value ||
                            DEFAULT_FORM_LAYOUT_RATIOS.SIDEBAR_RATIO
                    };
            }
        },
        {
            formLayoutType: getDefaultFormLayoutType(),
            formSizeRatio: DEFAULT_FORM_LAYOUT_RATIOS.FORM_RATIO,
            sideBarSizeRatio: DEFAULT_FORM_LAYOUT_RATIOS.SIDEBAR_RATIO
        }
    );
};

const createTransform = (getValueOrDefault: any) => (data: any, state: any, properties: any) => {
    const user = getValueOrDefault(USER_QUERY_USER_KEY, [])(data);
    const formLayoutConfig = getFormLayoutConfig(user.preferences, properties);
    return {
        user,
        formLayoutConfig
    };
};

export const createCurrentUserDataSource = (queryPrefix = '') => {
    const baseKey = `${queryPrefix}${USER_QUERY_KEY}`;
    const getValueOrDefault = getValue(baseKey);
    const transform = createTransform(getValueOrDefault);

    return createDataProviderDataSource({
        query: QUERY_FRAGMENT,
        variables: [],
        templateVariables: ['table'],
        transform,
        selectableProps: {
            user: {
                default: {}
            }
        }
    });
};
