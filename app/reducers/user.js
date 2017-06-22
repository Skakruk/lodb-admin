import {FETCH_USER} from '../actions/users';

export default  function user(state = {}, action) {
    switch (action.type) {
        case FETCH_USER: {
            return {
                ...state,
                ...action.user
            };
        }
        default:
            return state;
    }
}