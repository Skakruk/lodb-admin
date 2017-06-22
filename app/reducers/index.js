import {combineReducers} from 'redux';
import {routerReducer as routing} from 'react-router-redux';
import {articles, articlesList, articleContent} from './articles';
import user from './user';
import auth from './auth';
import media from './media';

const rootReducer = combineReducers({
    routing,
    articles,
	articlesList,
	articleContent,
    user,
    auth,
    media
});

export default rootReducer;