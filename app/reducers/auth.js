import jwtDecode from 'jwt-decode';

export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILURE = "LOGIN_FAILURE";
export const INVALID_TOKEN = 'INVALID_TOKEN';

export default function auth(state = {
    userData: localStorage.getItem('id_token') ? jwtDecode(localStorage.getItem('id_token')) : {},
    token: localStorage.getItem('id_token'),
    isFetching: false,
    isAuthenticated: !!localStorage.getItem('id_token')
}, action) {
    switch (action.type) {
        case LOGIN_SUCCESS: {
            return {
                ...state,
                token: action.token,
                isAuthenticated: true,
                err: null
            };
        }
        case LOGIN_FAILURE: {
            return {
                ...state,
                token: null,
                isAuthenticated: false,
                err: action.err
            }
        }
	    case INVALID_TOKEN: {
		    return {
			    ...state,
			    token: null,
			    isAuthenticated: false,
			    err: action.err
		    }
	    }
        default:
            return state;
    }
}
