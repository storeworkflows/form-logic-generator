import {getValue, createDataProviderDataSource} from "../utils";

export const SHN_QUERY_KEY = 'GlideSHN_Query';
export const SHN_ENABLE_KEY = 'isSHNEnabled';
export const SHN_TOTAL_MSGS_KEY = 'totalMsg';

export const QUERY_FRAGMENT = `
${SHN_QUERY_KEY}(table: $table, sys_id: $sysId) {
	${SHN_ENABLE_KEY},
	${SHN_TOTAL_MSGS_KEY}
}
`;

const createTransform = (getValueOrDefault: any) => (data: any) => {
    const shnEnabled = getValueOrDefault('isSHNEnabled', false)(data);
    const totalMsg = getValueOrDefault(SHN_TOTAL_MSGS_KEY, 0)(data);
    const enabled = shnEnabled && totalMsg > 0;

    return {
        enabled
    };
};

export const createSpecialHandlingNoteDataSource = (queryPrefix = '') => {
    const baseKey = `${queryPrefix}${SHN_QUERY_KEY}`;
    const getValueOrDefault = getValue(baseKey);
    const transform = createTransform(getValueOrDefault);

    return createDataProviderDataSource({
        query: QUERY_FRAGMENT,
        variables: ['table', 'sysId'],
        transform,
        props: {
            table: { default: '' },
            sysId: { default: '' }
        },
        selectableProps: {
            shnEnabled: {
                default: false
            }
        }
    });
};
