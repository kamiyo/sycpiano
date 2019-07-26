import axios from 'axios';
import { ThunkAction } from 'redux-thunk';
import { GlobalStateShape } from 'src/types';
import { StoreItem, Order } from './types';

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

const fetchCartRequest = (): ActionTypes.FetchCartRequest => ({
    type: STORE_ACTIONS.FETCH_CART_REQUEST,
});

const fetchCartError = (): ActionTypes.FetchCartError => ({
    type: STORE_ACTIONS.FETCH_CART_ERROR,
});

const fetchCartSuccess = (order: Order): ActionTypes.FetchCartSuccess => ({
    type: STORE_ACTIONS.FETCH_CART_SUCCESS,
    order,
});

const shouldFetchOrder = (state: GlobalStateShape) => {
    return !state.cart.isFetching;
};

const fetchOrder = (orderId: string): ThunkAction<Promise<void>, GlobalStateShape, void, ActionTypes.FetchCartActions> => (
    async (dispatch) => {
        try {
            if (orderId) {
                dispatch(fetchCartRequest());
                const url = 'api/order/' + orderId;
                const { data: order }: { data: Order } = await axios.get(url);
                dispatch(fetchCartSuccess(order));
            } else {
                console.log('no order to fetch');
                dispatch(fetchCartSuccess(null));
            }
        } catch (e) {
            console.log('fetch order error', e);
            dispatch(fetchCartError());
        }
    }
)

export const initCartAction = (): ThunkAction<Promise<void>, GlobalStateShape, void, ActionTypes.FetchCartActions> => (
    async (dispatch, getState) => {
        if (shouldFetchOrder(getState())) {
            let orderId: string = null;
            if (storageAvailable()) {
                orderId = JSON.parse(window.localStorage.getItem('seanchenpiano_orderId') || '""');
            }
            await dispatch(fetchOrder(orderId));
        }
    }
);

type CartThunkAction<T> = ThunkAction<T, GlobalStateShape, void, ActionTypes.UpdateCartOptions>;

const addItemToCart = (sku: string): ActionTypes.AddItemToCart => ({
    type: STORE_ACTIONS.ADD_ITEM_TO_CART,
    sku,
});

const addItemToCart = (sku: string): CartThunkAction<void> => (
    (dispatch) => {
        dispatch(fetchCartRequest());
        const { data: order }: { data: Order } = await axios.get(url);
    }
)

export const addItemToCartAction = (sku: string): CartThunkAction<void> => (
    async (dispatch, getState) => {
        if (shouldFetchOrder(getState())) {

            dispatch(addItemToCart(sku));
        }
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
            const orderId = getState().cart.order.id;
            window.localStorage.setItem('seanchenpiano_orderId', JSON.stringify(orderId));
        }
    }
);
