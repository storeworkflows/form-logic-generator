import {encodeURIParameters} from "./utils/http";
import _ from "lodash";

type sendRequest = (url: string, method: string, options: any) => Promise<any>;

function GlideRequest(sendRequest: sendRequest) {
    function applyOptions(method: string, url: string, options: any) {
        let fetchOptions = {
            ...options,
            method: method,
            url: url
        };
        let {data, dataType} = fetchOptions;

        switch (method) {
            case 'get':
                if (data) {
                    // @note: quick and dirty param concat
                    const params = encodeURIParameters(data);
                    if (url.indexOf('?') !== -1)
                        fetchOptions.url = url + '&' + params;
                    else fetchOptions.url = url + '?' + params;
                }
                break;
            default:
                if (dataType === 'xml')
                    fetchOptions.body = encodeURIParameters(data);
                else fetchOptions.body = data;
                break;
        }

        switch (dataType) {
            default:
            case 'json':
                fetchOptions.headers = {
                    Accept: 'application/json, text/javascript',
                    'Content-Type': 'application/json',
                    // @ts-ignore
                    'X-UserToken': window.g_ck
                };
                break;
            case 'xml':
                fetchOptions.headers = {
                    Accept: 'application/xml, text/xml',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    // @ts-ignore
                    'X-UserToken': window.g_ck
                };
                break;
        }
        return fetchOptions;
    }

    function requestFactory(method: string, url: string, options: any) {
        if (!url) {
            throw 'Must specify a URL';
        }
        const fetchOptions = applyOptions(method, url, options);
        return sendRequest(fetchOptions.url, method, fetchOptions);
    }

    function getAngularURL(path: string, parameters: any) {
        return (
            '/angular.do?sysparm_type=' +
            path +
            '&' +
            (parameters ? encodeURIParameters(parameters) : '')
        );
    }

    function get(url: string, options: any) {
        return requestFactory(url, 'get', options)
    }

    function post(url: string, options: any) {
        if (!url) {
            throw 'Must specify a URL';
        }
        const fetchOptions = applyOptions('post', url, options);
        return sendRequest(fetchOptions.url, 'post', fetchOptions).then(
            (response: any) => {
                /* for glideAjax */
                let type = fetchOptions.dataType;
                response.type = type;
                response.responseText = response.data;
                response.responseXML =
                    type === 'xml'
                        ? _.get(response, 'request.responseXML', null)
                        : null;
                return response;
            },
            (response: any) => {
                return response;
            }
        );
    }

    function put(url: string, options: any) {
        return requestFactory(url, "put", options);
    }

    function patch(url: string, options: any) {
        return requestFactory(url, "patch", options);
    }

    return {
        getAngularURL: getAngularURL,
        get: get,
        post: post,
        put: put,
        patch: patch
    }
}

export default GlideRequest