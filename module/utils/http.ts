// @ts-ignore
import { snHttpFactory } from 'sn-http-request';

export const http = snHttpFactory({
// @ts-ignore
	xsrfToken: window.g_ck,
	batching: false
});

export function sendRequestFactory() {
	return function sendRequest(url: string, method: string, options: any) {
		const {
			headers = {
				'X-WantSessionNotificationMessages': true
			},
			params = {},
			body = {},
			broadcastResourcesChanged = () => {},
			...moreOptions
		} = options;

		return new Promise((resolve, reject) => {
			http.request(url, method, {
				headers,
				params,
				...moreOptions,
				data: body
			})
				.then((response: any) => {
					Promise.resolve(resolve(response)).then(
						broadcastResourcesChanged(response)
					);
				})
				.catch((httpResponse: any) => {
					const response = httpResponse.response;
					Promise.resolve(reject(response)).then(
						broadcastResourcesChanged(response)
					);
				});
		});
	};
}

/**
 * Encodes the provided parameter object key/values
 * @param {Object} parameters
 * @returns {String} param=value&param2=value2...
 */
export function encodeURIParameters(obj: any) {
	let parts = Object.keys(obj).reduce(function(a, k) {
		a.push(k + '=' + encodeURIComponent(obj[k]));
		return a;
	}, []);
	return parts.join('&');
}
