/*
 * This is the global redux store.
 *
 * It takes reducers from different pages, combines them into a single reducer,
 * and creates a combined store.
 *
 * We make sure to namespace the states by their corresponding reducers.
 */

import { applyMiddleware, combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import thunk from 'redux-thunk';

import { NavBarReducer } from 'src/components/App/NavBar/reducers';

import { AsyncStore, GlobalStateShape, Reducers } from 'src/types';

const createReducer = (reducers?: Reducers) => {
    return combineReducers<GlobalStateShape>({
        navbar: NavBarReducer,
        ...reducers,
    });
};

export default (() => {
    const store: AsyncStore = createStore(
        createReducer(),
        composeWithDevTools(
            applyMiddleware(thunk),
        ),
    );
    store.async = {};
    return store;
})();

export const registerReducer = (store: AsyncStore, reducers: Reducers) => {
    store.async = { ...store.async, ...reducers };
    store.replaceReducer(createReducer(store.async));
};
