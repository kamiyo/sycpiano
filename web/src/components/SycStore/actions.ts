import axios from 'axios';
import { ThunkAction } from 'redux-thunk';
import { GlobalStateShape } from 'src/types';
import { StoreItem } from './types';

import STORE_ACTIONS from 'src/components/SycStore/actionTypeKeys';
import * as ActionTypes from 'src/components/SycStore/actionTypes';
import { storageAvailable } from 'src/components/SycStore/localStorage';

const fetchItemsRequest = (): ActionTypes.FetchItemsRequest => ({
    type: STORE_ACTIONS.FETCH_ITEMS_REQUEST,
});

const fetchItemsSuccess = (items: StoreItem[]): ActionTypes.FetchItemsSuccess => ({
    type: STORE_ACTIONS.FETCH_ITEMS_SUCCESS,
    items,
});

const fetchItemsError = (): ActionTypes.FetchItemsError => ({
    type: STORE_ACTIONS.FETCH_ITEMS_ERROR,
});

const shouldFetchItems = (state: GlobalStateShape) => {
    return !state.sycStore.isFetching && !state.sycStore.fetchSuccess;
};

const fetchItems = (): ThunkAction<Promise<void>, GlobalStateShape, void, ActionTypes.FetchItemsActions> => (
    async (dispatch) => {
        try {
            dispatch(fetchItemsRequest());
            const { data: items }: { data: StoreItem[] } = await axios.get('api/storeItems');
            dispatch(fetchItemsSuccess(items));
        } catch (err) {
            console.log('fetch products error', err);
            dispatch(fetchItemsError());
        }
    }
);

export const fetchItemsAction = (): ThunkAction<Promise<void>, GlobalStateShape, void, ActionTypes.FetchItemsActions> => (
    async (dispatch, getState) => {
        if (shouldFetchItems(getState())) {
            await dispatch(fetchItems());
        }
    }
);

const fetchCartError = (): ActionTypes.FetchCartError => ({
    type: STORE_ACTIONS.FETCH_CART_ERROR,
});

const fetchCartSuccess = (cart: string[]): ActionTypes.FetchCartSuccess => ({
    type: STORE_ACTIONS.FETCH_CART_SUCCESS,
    cart,
});

export const initCartAction = (): ThunkAction<void, GlobalStateShape, void, ActionTypes.FetchCartActions> => (
    (dispatch) => {
        if (storageAvailable()) {
            const cart: string[] = JSON.parse(window.localStorage.getItem('seanchenpiano_cart') || '[]');
            dispatch(fetchCartSuccess(cart));
        } else {
            dispatch(fetchCartError());
        }
    }
);

type CartThunkAction<T> = ThunkAction<T, GlobalStateShape, void, ActionTypes.UpdateCartOptions>;

const addItemToCart = (sku: string): ActionTypes.AddItemToCart => ({
    type: STORE_ACTIONS.ADD_ITEM_TO_CART,
    sku,
});

export const addItemToCartAction = (sku: string): CartThunkAction<void> => (
    (dispatch) => {
        dispatch(addItemToCart(sku));
    }
);

const removeItemFromCart = (sku: string): ActionTypes.RemoveItemFromCart => ({
    type: STORE_ACTIONS.REMOVE_ITEM_FROM_CART,
    sku,
});

export const removeItemFromCartAction = (sku: string): CartThunkAction<void> => (
    (dispatch) => {
        dispatch(removeItemFromCart(sku));
    }
);

export const syncLocalStorage = (): ThunkAction<void, GlobalStateShape, void, any> => (
    (_, getState) => {
        if (storageAvailable()) {
            const cart = getState().cart.items;
            window.localStorage.setItem('seanchenpiano_cart', JSON.stringify(cart));
        }
    }
);
