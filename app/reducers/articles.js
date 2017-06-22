export const ADD_ARTICLES = 'ADD_ARTICLES';
export const ADD_ARTICLE = 'ADD_ARTICLE';
export const UPDATE_ARTICLE = 'UPDATE_ARTICLE';

export const articles = function (state = {}, action) {
	switch (action.type) {

		case ADD_ARTICLE: {
			return {
				...state,
				...action.payload
			}
		}
		case UPDATE_ARTICLE: {
			return {
				...state,
				[action.id]: {
					...state[action.id],
					...action.payload
				}
			}
		}
		default:
			return state;
	}
};

export const ADD_ARTICLE_CONTENT = 'ADD_ARTICLE_CONTENT';
export const UPDATE_ARTICLE_CONTENT = 'UPDATE_ARTICLE_CONTENT';
export const CREATE_ARTICLE_CONTENT = 'CREATE_ARTICLE_CONTENT';
export const REMOVE_ARTICLE_CONTENT = 'REMOVE_ARTICLE_CONTENT';

export const articleContent = function (state = {}, action) {
	switch (action.type) {
		case ADD_ARTICLE_CONTENT: {
			return {
				...state,
				...action.payload
			};
		}

		case UPDATE_ARTICLE_CONTENT: {
			return {
				...state,
				[action.id]: {
					...state[action.id],
					...action.payload
				}
			}
		}

		case REMOVE_ARTICLE_CONTENT: {
			let newState = {
				...state
			};

			delete newState[action.id];

			Object.keys(newState).forEach(key => {
				newState[key].children = newState[key].children.filter(cid => cid !== action.id);
			});

			return newState;
		}

		default:
			return state;
	}
};
export const articlesList = function (state = {}, action) {
	switch (action.type) {
		case ADD_ARTICLES: {
			return {
				...state,
				...action.payload
			}
		}

		default:
			return state;
	}
};

