export const ADD_MEDIA = 'ADD_MEDIA';
export const REMOVE_MEDIA = 'REMOVE_MEDIA';

export default function media(state = {}, action) {
	switch (action.type) {
		case ADD_MEDIA: {
			let newState = {
				...state,
				...action.payload
			};

			if (typeof action.parent !== 'undefined') {
				newState = {
					...newState,
					[action.parent]: {
						...newState[action.parent],
						children: [
							...newState[action.parent].children,
							...Object.keys(action.payload).map(Number)
						]
					}
				}
			}

			return newState
		}
		case REMOVE_MEDIA: {
			delete state[action.payload];
			return {
				...state,
				[action.parent]: {
					...state[action.parent],
					children: state[action.parent].children.filter(childId => childId !== action.payload)
				}
			}
		}

		default:
			return state;
	}
}