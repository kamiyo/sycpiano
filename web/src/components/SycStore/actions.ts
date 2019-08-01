import axios from 'axios';
import { ThunkAction } from 'redux-thunk';
import { ReactStripeElements } from 'react-stripe-elements';
import { GlobalStateShape } from 'src/types';
import { StoreItem, Order } from './types';

import STORE_ACTIONS from 'src/components/SycStore/actionTypeKeys';
import * as ActionTypes from 'src/components/SycStore/actionTypes';
import { storageAvailable } from 'src/components/SycStore/localStorage';

const shouldFetchItems = (state: GlobalStateShape) =>
    !state.sycStore.isFetching && !state.sycStore.fetchSuccess;

type SycStoreThunkAction = ThunkAction<Promise<void>, GlobalStateShape, void, ActionTypes.Types>;

const fetchItemsAsync: SycStoreThunkAction = async (dispatch) => {
    try {
        dispatch({ type: STORE_ACTIONS.FETCH_ITEMS_REQUEST });
        const { data: items }: { data: StoreItem[] } = await axios.get('/api/store/items');
        dispatch({
            type: STORE_ACTIONS.FETCH_ITEMS_SUCCESS,
            items,
        });
    } catch (err) {
        console.log('fetch products error', err);
        dispatch({ type: STORE_ACTIONS.FETCH_ITEMS_ERROR });
    }
};

export const fetchItemsAction = (): SycStoreThunkAction => (
    async (dispatch, getState) => {
        if (shouldFetchItems(getState())) {
            await dispatch(fetchItemsAsync);
        }
    }
);

const addToCart = (skuId: string): ActionTypes.AddToCart => ({
    type: STORE_ACTIONS.ADD_TO_CART,
    skuId,
});

export const addToCartAction = (skuId: string): ThunkAction<void, GlobalStateShape, void, ActionTypes.Types> => (
    (dispatch) => dispatch(addToCart(skuId))
);

const removeFromCart = (skuId: string): ActionTypes.RemoveFromCart => ({
    type: STORE_ACTIONS.REMOVE_FROM_CART,
    skuId,
});

const shouldSubmitCheckout = (state: GlobalStateShape) =>
    !state.sycStore.isSubmitting && !state.sycStore.submitSuccess;

export const removeFromCartAction = (skuId: string): ThunkAction<void, GlobalStateShape, void, ActionTypes.Types> =>
    (dispatch) => dispatch(removeFromCart(skuId));

const postToCheckoutAPI = async (
    skuIds: string[],
    tokenPromise: Promise<ReactStripeElements.PatchedTokenResponse>,
): Promise<boolean> => {
    const { token } = await tokenPromise;
    const { data: { success } }: { data: { success: boolean } } = await axios.post(
        'api/store/checkout',
        { skuIds, tokenId: token.id },
    );
    return success;
};

<<<<<<< HEAD
const fetchItems = (): ThunkAction<Promise<void>, GlobalStateShape, void, ActionTypes.FetchItemsActions> => (
    async (dispatch) => {
        try {
            dispatch(fetchItemsRequest());
            const { data: items }: { data: StoreItem[] } = await axios.get('api/storeItems');
            dispatch(fetchItemsSuccess(items));
        } catch (err) {
            console.log('fetch products error', err);
            dispatch(fetchItemsError());
=======
const getCheckoutSubmitAsync = (
    skuIds: string[],
    tokenPromise: Promise<ReactStripeElements.PatchedTokenResponse>,
): SycStoreThunkAction => async (dispatch) => {
    try {
        dispatch({ type: STORE_ACTIONS.CHECKOUT_SUBMIT });
        const success = await postToCheckoutAPI(skuIds, tokenPromise);
        if (success) {
            dispatch({ type: STORE_ACTIONS.CHECKOUT_SUCCESS });
        } else {
            dispatch({ type: STORE_ACTIONS.CHECKOUT_FAILURE });
>>>>>>> origin/add_store_checkout
        }
    } catch (err) {
        console.log('checkout error', err);
        dispatch({ type: STORE_ACTIONS.CHECKOUT_FAILURE });
    }
};

<<<<<<< HEAD
export const fetchItemsAction = (): ThunkAction<Promise<void>, GlobalStateShape, void, ActionTypes.FetchItemsActions> => (
=======
export const checkoutSubmitAction = (
    skuIds: string[],
    tokenPromise: Promise<ReactStripeElements.PatchedTokenResponse>,
): SycStoreThunkAction =>
>>>>>>> origin/add_store_checkout
    async (dispatch, getState) => {
        if (shouldSubmitCheckout(getState())) {
            await dispatch(getCheckoutSubmitAsync(skuIds, tokenPromise));
        }
<<<<<<< HEAD
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

// const addItemToCart = (sku: string): CartThunkAction<void> => (
//     (dispatch) => {
//         dispatch(fetchCartRequest());
//         const { data: order }: { data: Order } = await axios.get(url);
//     }
// )

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
=======
    };
>>>>>>> origin/add_store_checkout
