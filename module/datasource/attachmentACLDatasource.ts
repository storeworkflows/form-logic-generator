import {getValue, createDataProviderDataSource} from "../utils";

const ATTACHMENT_ACL_QUERY_KEY = 'GlideAttachmentQuery_Query';
const ATTACHMENT_ACL_ATTACHMENTS_KEY = 'attachments';
const QUERY_FRAGMENT = `
	${ATTACHMENT_ACL_QUERY_KEY} {
		${ATTACHMENT_ACL_ATTACHMENTS_KEY} (table: $table, sysId: $sysId) {
			canCreate
		}
	}
`;

const createTransform = (getValueOrDefault: any) => (data: any) => {
    const canCreate = getValueOrDefault('canCreate', false)(data);
    return {
        canCreate
    };
};

export const createAttachmentAclDataSource = (queryPrefix = '') => {
    const baseKey = `${queryPrefix}${ATTACHMENT_ACL_QUERY_KEY}.${ATTACHMENT_ACL_ATTACHMENTS_KEY}`;
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
            canCreate: {
                default: {}
            }
        }
    });
};
