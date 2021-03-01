import {getValue, createDataProviderDataSource} from "../utils";

const notificationProcessor = (table: any, sysId: any) => (notifications: any) => {
    const extras = {
        ...(table ? { table } : {}),
        ...(sysId ? { sysId } : {})
    };

    if (!notifications) return [];

    return notifications.reduce((messages: any, n: any) => {
        if (n.text) {
            messages.push({
                type: n.type || 'info',
                message: n.text,
                ...extras
            });
        }
        return messages;
    }, []);
};

const SESSION_MESSAGE_QUERY_KEY = 'GlideDomain_Query';
const SESSION_MESSAGE_CONFIG_KEY = 'session';
const SESSION_MESSAGE_NOTIFICATIONS_KEY = 'notifications';
const QUERY_FRAGMENT = `
${SESSION_MESSAGE_QUERY_KEY} {
	${SESSION_MESSAGE_CONFIG_KEY} {
		notifications{
			type
			text
			notificationType
			notificationAttributes {
				attributeName
				attributeValue
			}
			childNotifications {
				type
				text
				notificationType
			}
		}
	}
}
`;

const transformMessages = (notifications: any, table: any, sysId: any) => {
    const process = notificationProcessor(table, sysId);
    return process(notifications);
};

const createTransform = (getValueOrDefault: any) => (data: any, state: any, properties: any) => {
    const { table, sysId } = properties;
    const messages = transformMessages(
        getValueOrDefault(SESSION_MESSAGE_NOTIFICATIONS_KEY, [])(data),
        table,
        sysId
    );
    return {
        messages
    };
};

export const createSessionMessageDataSource = (queryPrefix = '') => {
    const baseKey = `${queryPrefix}${SESSION_MESSAGE_QUERY_KEY}.${SESSION_MESSAGE_CONFIG_KEY}`;
    const getValueOrDefault = getValue(baseKey);
    const transform = createTransform(getValueOrDefault);

    return createDataProviderDataSource({
        query: QUERY_FRAGMENT,
        variables: [],
        transform,
        selectableProps: {
            messages: {
                default: []
            }
        }
    });
};
