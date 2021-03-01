import {getValue, createDataProviderDataSource} from "../utils";

export const VIEWABLE_TAG_QUERY_KEY = "GlideViewableTagQuery_Query";
export const VIEWABLE_RECORD_TAGS = "viewableRecordTags";
export const QUERY_FRAGMENT = `
        ${VIEWABLE_TAG_QUERY_KEY} {
            ${VIEWABLE_RECORD_TAGS} (table: $table, sysId: $sysId) {
                canCreateGlobalTags
                enabled
                records {
                    name
                    canEdit
                    sysId
                    viewableBy
                    labelEntry
                }
            }
        }`;

const createTransform = (getValueOrDefault: any) => (data: any) => {
    const recordTags = getValueOrDefault(VIEWABLE_RECORD_TAGS, {})(data);
    return {
        recordTags
    };
};

export const createViewableRecordTagDataSource = (queryPrefix = "") => {
    const baseKey = `${queryPrefix}${VIEWABLE_TAG_QUERY_KEY}`;
    const getValueOrDefault = getValue(baseKey);
    const transform = createTransform(getValueOrDefault);

    return createDataProviderDataSource({
        query: QUERY_FRAGMENT,
        variables: ["table", "sysId"],
        transform,
        props: {
            table: { default: "" },
            sysId: { default: "" }
        },
        selectableProps: {
            recordTags: {
                default: {}
            }
        }
    });
};
