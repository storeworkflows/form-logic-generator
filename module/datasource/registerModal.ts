import {getValue, createDataProviderDataSource} from "../utils";

import _ from "lodash";

export const REGISTERED_MODAL_QUERY_KEY = 'GlideRegisteredModalQuery_Query';
export const REGISTERED_MODAL_KEY = 'registeredModals';
export const MODALS_KEY = 'modals';
export const QUERY_FRAGMENT = `
${REGISTERED_MODAL_QUERY_KEY} {
	${REGISTERED_MODAL_KEY} {
		${MODALS_KEY} {
			component
			namespace
			api
		}
	}
}
`;

const registerGlideModal = (modals: any[] = [], snFormModal: any) => {
    _.forEach(modals, modal => {
        snFormModal.registerGlideModal(
            modal.component,
            modal.namespace,
            modal.api
        );
    });
};

const createTransform = (getValueOrDefault: any) => (data: any) => {
    const modals = getValueOrDefault(MODALS_KEY, [])(data);

    return {
        modals
    };
};

export const createRegisteredModalDataSource = (queryPrefix = '') => {
    const baseKey = `${queryPrefix}${REGISTERED_MODAL_QUERY_KEY}.${REGISTERED_MODAL_KEY}`;
    const getValueOrDefault = getValue(baseKey);
    const transform = createTransform(getValueOrDefault);

    return createDataProviderDataSource({
        query: QUERY_FRAGMENT,
        variables: [],
        transform,
        selectableProps: {
            modals: {
                default: []
            }
        }
    });
};
