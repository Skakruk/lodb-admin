import * as api from "./api";
import {push} from 'react-router-redux';
import jwtDecode from 'jwt-decode';
import {LOGIN_FAILURE, LOGIN_SUCCESS} from '../reducers/auth';

export function login(data, redirect = "/") {
	return (dispatch, getState) => dispatch(api.post(`/auth/token`, data))
		.then(response => {

			localStorage.setItem("id_token", response.token);

			dispatch({
				type: LOGIN_SUCCESS,
				token: response.token,
				userData: jwtDecode(response.token)
			});

			dispatch(push(redirect));
		}, err => {
			dispatch({
				type: LOGIN_FAILURE,
				err
			});
		})
}

export function requireAuth(nextState, replace) {
	if (!localStorage.getItem('id_token')) {
		replace({
			pathname: '/login',
			state: {nextPathname: nextState.location.pathname}
		})
	}
}