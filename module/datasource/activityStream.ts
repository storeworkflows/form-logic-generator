import {getValue, createDataProviderDataSource} from "../utils";
import _ from 'lodash';

const ACTIVITY_STREAM_INNER_SCHEMA = `
sysTimestamp
isDelta
entries {
	type
	sysCreatedOnAdjusted
	sysCreatedBy
	userImage
	initials
	fieldColor
	sysId: uid
	entryItem {
		... on GlideActivity_AuditType {
			auditValues {
				fieldLabel
				newValue
				oldValue
				htmlNewValue
				htmlOldValue
				type
			}
			__typename
		}
		... on GlideActivity_JournalType {
			fieldLabel
			fieldName
			sanitizeHtmlValue
			__typename
		}
		... on GlideActivity_AttachmentType {
			sysId
			fileName
			state
			downloadPath
			imagePath
			sizeBytes
			contentType
			extension
			__typename
		}
		... on GlideActivity_EmailType {
			fields {
				subject
				user
				recipients
				copied
				type
			}
			displayPath
			__typename
		}
	}
}
`;
const ACTIVITY_STREAM_FILTER_INNER_SCHEMA = `
fields {
	isSelected:active
	label
	name
}
`;

function getQueryFragments() {
    return `
	${ACTIVITY_STREAM_INNER_SCHEMA}
	${ACTIVITY_STREAM_FILTER_INNER_SCHEMA}
	`;
}

export const ACTIVITY_QUERY_KEY = 'GlideActivity_Query';
export const ENTRIES_KEY = 'entries';
export const FIELDS_KEY = 'fields';
export const TIMESTAMP_KEY = 'sysTimestamp';
export const GET_STREAM = 'getStream';
export const QUERY_FRAGMENT = `
${ACTIVITY_QUERY_KEY} {
	${GET_STREAM}(table: $table, sysId: $sysId, view: $view) {
		${getQueryFragments()}
	}
}
`;

const createTransform = (getValueOrDefault: any) => (data: any) => {
    const stream = getValueOrDefault(GET_STREAM, null)(data);
    const entries = getValueOrDefault(`${GET_STREAM}.${ENTRIES_KEY}`, [])(data);
    const visible = !_.isNull(stream);
    const filterOptions = getValueOrDefault(`${GET_STREAM}.${FIELDS_KEY}`, [])(
        data
    );
    const timestamp = getValueOrDefault(`${GET_STREAM}.${TIMESTAMP_KEY}`, '')(
        data
    );

    return {
        entries,
        visible,
        filterOptions,
        timestamp
    };
};

export const createActivityStreamDataSource = (queryPrefix = '') => {
    const baseKey = `${queryPrefix}${ACTIVITY_QUERY_KEY}`;
    const getValueOrDefault = getValue(baseKey);
    const transform = createTransform(getValueOrDefault);

    return createDataProviderDataSource({
        query: QUERY_FRAGMENT,
        variables: ['table', 'sysId', 'view'],
        transform,
        props: {
            table: { default: '' },
            sysId: { default: '' },
            view: { default: '' }
        },
        selectableProps: {
            entries: {
                default: []
            },
            filterOptions: {
                default: []
            },
            visible: {
                default: false
            },
            timestamp: {}
        }
    });
};
