import {normalize} from 'normalizr';
import {ADD_MEDIA, REMOVE_MEDIA, ADD_CHILDREN, REMOVE_CHILDREN} from '../reducers/media';

export function getFolderTree() {
	return (dispatch, getState, {api, schema}) =>
		dispatch(api.get(`/media/images/tree`))
			.then(response => {
				const data = normalize(response.media, schema.mediaList);
				console.log(data);
				dispatch({
					type: ADD_MEDIA,
					payload: data.entities.media
				});
				return response
			});

}

export function addDirectory(data) {
	return dispatch => dispatch(api.post(`/media/directory`, data))
}

export function uploadFiles({files, parent}) {
	return (dispatch, getState, {api, schema}) =>
		dispatch(api.upload(`/media/images`, {
			parent
		}, files))
			.then(response => {
				const data = normalize(response, schema.medias);
				console.log(data);
				dispatch({
					type: ADD_MEDIA,
					parent,
					payload: data.entities.media
				});
			})
}

export function deleteFile({id, parent_id}) {
	return (dispatch, getState, {api, schema}) =>
		dispatch(api.remove(`/media/images/${id}`))
			.then(() => {
				dispatch({
					type: REMOVE_MEDIA,
					parent: parent_id,
					payload: id
				});
			})
}