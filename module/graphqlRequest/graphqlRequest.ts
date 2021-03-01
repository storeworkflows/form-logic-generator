import fetch from "cross-fetch";

const DEFAULT_GQL_ENDPOINT = '/api/now/graphql';

export default function graphqlRequest({operationName = '', query = {}, variables = {}, params = {}}) {
    const options: any = {
        method: 'POST',
        ...params,
        credentials: 'same-origin',
        headers: {
            'content-type': "application/json",
            // @ts-ignore
            'X-Transaction-Source': window.transaction_source,
            'X-UserToken': "d15ef583dbd660103d9aca32399619b50309720d3377c41e9c8a03ec0b50a52dcaec2dab" //window.g_ck
        },
        body: JSON.stringify([{
            operationName,
            query,
            variables
        }])
    }
    return fetch(DEFAULT_GQL_ENDPOINT, options)
}