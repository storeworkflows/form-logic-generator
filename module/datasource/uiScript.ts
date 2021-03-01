import {getValue, createDataProviderDataSource} from "../utils";

export const UI_SCRIPT_QUERY_KEY = 'GlideUIScript_Query';
export const UI_SCRIPT_KEY = 'uiScripts';
export const SCRIPTS_KEY = 'scripts';
export const QUERY_FRAGMENT = `
${UI_SCRIPT_QUERY_KEY} {
	${UI_SCRIPT_KEY} {
		scripts {
			name
			description
			script
			sysId
		}
	}
}
`;

const createTransform = (getValueOrDefault: any) => (data: any) => {
    const scripts = getValueOrDefault(SCRIPTS_KEY, [])(data);
    return {
        scripts
    };
};

export const createUIScriptDataSource = (queryPrefix = '') => {
    const baseKey = `${queryPrefix}${UI_SCRIPT_QUERY_KEY}.${UI_SCRIPT_KEY}`;
    const getValueOrDefault = getValue(baseKey);
    const transform = createTransform(getValueOrDefault);
    return createDataProviderDataSource({
        query: QUERY_FRAGMENT,
        variables: [],
        transform,
        selectableProps: {
            [UI_SCRIPT_KEY]: {
                default: {}
            }
        }
    });
};
