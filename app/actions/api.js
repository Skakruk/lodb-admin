import {INVALID_TOKEN} from '../reducers/auth';
import {push} from 'react-router-redux';

function request(url, options = {}, dispatch, getState) {
	let hasCanceled_ = false;
	let token = getState().auth.token;
	// let apiURL = getState().connectionSettings.apiUrl;
	let apiURL = 'http://api.lodb.dev:3001';
	let tokenHeader = token ? {
			"Authorization": `Bearer ${token}`
		} : {};

	options = {
		...options,
		headers: {
			"Accept": "application/json;charset=UTF-8",
			...options.headers,
			...tokenHeader
		}
	};


	return new Promise((resolve, reject) =>
		fetch(apiURL + url, options)
			.then(response => ({response, data: response.json()}))
			.then(({response, data}) => {
				if (response && response.status >= 200 && response.status < 300) {
					return data.then(d => resolve(d));
				} else if (response.status === 401) {
					// session expired
					dispatch({
						type: INVALID_TOKEN,
						err: "Unauthorized"
					});
					dispatch(push("/login"));
					data.then(d => reject(d));
				} else {
					data.then(d => reject(d));
				}
			}));
}

function get(url, options) {
	return (dispatch, getState) => {
		return request(url, options, dispatch, getState)
	}
}

function post(url, data, options) {
	return (dispatch, getState) => {
		return request(url, {
			...options,
			method: "POST",
			body: JSON.stringify(data),
			headers: {
				"Content-Type": "application/json;charset=UTF-8",
			}
		}, dispatch, getState)
	}
}

function upload(url, data, fileList, options) {
	var formData = new FormData();

	if (fileList.length > 0) {
		Array.from(fileList).forEach(file => {
			formData.append('files[]', file);
		});
	}

	for (let field of Object.keys(data)) {
		formData.append(field, data[field]);
	}

	return (dispatch, getState) => request(url, {
		...options,
		method: "POST",
		body: formData
	}, dispatch, getState)
}

function put(url, data, options) {
	return (dispatch, getState) => request(url, {
		...options,
		method: "PUT",
		body: JSON.stringify(data),
		headers: {
			"Content-Type": "application/json;charset=UTF-8",
		}
	}, dispatch, getState)
}

function remove(url, options) {
	return (dispatch, getState) => request(url, {
		...options,
		method: "DELETE"
	}, dispatch, getState)
}

export {request, get, post, put, upload, remove}