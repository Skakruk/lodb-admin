import {createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import {browserHistory} from 'react-router';
import {routerMiddleware, push} from 'react-router-redux';
import * as schema from '../schemas';
import rootReducer from '../reducers';
import * as api from "../actions/api";

const actionCreators = {
	push,
};

const logger = createLogger({
	level: 'info',
	collapsed: true,
});

const router = routerMiddleware(browserHistory);

const enhancer = compose(
	applyMiddleware(thunk.withExtraArgument({api, schema}), router, logger),
	window.devToolsExtension ?
		window.devToolsExtension({actionCreators}) :
		noop => noop
);

export default function configureStore(initialState) {
	const store = createStore(rootReducer, initialState, enhancer);

	if (window.devToolsExtension) {
		window.devToolsExtension.updateStore(store);
	}

	return store;
}
