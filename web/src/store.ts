/*
 * This is the global async redux store.
 *
 * Everytime registerReducer is called, it will replace the global store with
 * a new one that includes the reducer from the new async component.
 *
 * We make sure to namespace the states by their corresponding reducers.
 */

import { applyMiddleware, combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import thunk from 'redux-thunk';

import { navBarReducer } from 'src/components/App/NavBar/reducers';
import { cartReducer } from 'src/components/Cart/reducers';
import { shopReducer } from 'src/components/Shop/reducers';

import { AsyncStore, GlobalStateShape, Reducers } from 'src/types';

const createReducer = (reducers?: Reducers) => {
    return combineReducers<GlobalStateShape>({
        navbar: navBarReducer,
        cart: cartReducer,
        shop: shopReducer,
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

export const registerReducer = (store: AsyncStore, reducers: Reducers): void => {
    store.async = { ...store.async, ...reducers };
    store.replaceReducer(createReducer(store.async));
};
