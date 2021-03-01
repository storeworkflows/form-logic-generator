import _ from "lodash";

export function getValue(baseKey: string) {
    const getSubKey = function getSubKey(key: string) {
        return `${baseKey}.${key}`;
    };
    return function (key: string, defaultValue: any) {
        return function (data: any) {
            return _.get(data, getSubKey(key), defaultValue);
        };
    };
};

export function createDataProviderDataSource({
                                                 query,
                                                 variables,
                                                 getParams,
                                                 transform,
                                                 props,
                                                 selectableProps,
                                                 templateVariables
                                             }: any) {

    return {
        query: query,
        variables: variables,
        getParams: getParams,
        transform: transform,
        props: props,
        selectableProps: selectableProps,
        templateVariables: templateVariables
    };
};