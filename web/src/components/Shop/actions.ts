/* global Stripe */
import axios, { AxiosError } from 'axios';
import { ThunkAction } from 'redux-thunk';
import { GlobalStateShape } from 'src/types';
import { Sku } from './types';

import STORE_ACTIONS from 'src/components/Shop/actionTypeKeys';
import * as ActionTypes from 'src/components/Shop/actionTypes';
import { storageAvailable } from './localStorage';

const LOCAL_STORAGE_KEY = 'seanchenpiano_cart';

const stripe = Stripe('pk_test_Fvm56dnar5NlFcwQVEhUvrem');

const shouldFetchItems = (state: GlobalStateShape) =>
    !state.shop.isFetching && !state.shop.fetchSuccess;

type ShopThunkAction = ThunkAction<Promise<void>, GlobalStateShape, void, ActionTypes.Types>;

const fetchItemsAsync: ShopThunkAction = async (dispatch) => {
    try {
        dispatch({ type: STORE_ACTIONS.FETCH_ITEMS_REQUEST });
        const { data: items }: { data: Sku[] } = await axios.get('/api/shop/items');
        dispatch({
            type: STORE_ACTIONS.FETCH_ITEMS_SUCCESS,
            items,
        });
    } catch (err) {
        console.log('fetch products error', err);
        dispatch({ type: STORE_ACTIONS.FETCH_ITEMS_ERROR });
    }
};

export const fetchItemsAction = (): ShopThunkAction => (
    async (dispatch, getState) => {
        if (shouldFetchItems(getState())) {
            await dispatch(fetchItemsAsync);
        }
    }
);

const addItemToCart = (skuId: string): ActionTypes.AddToCart => ({
    type: STORE_ACTIONS.ADD_TO_CART,
    skuId,
});

export const addToCartAction = (skuId: string): ThunkAction<void, GlobalStateShape, void, ActionTypes.UpdateCartActions> => (
    (dispatch) => dispatch(addItemToCart(skuId))
);

const removeItemFromCart = (skuId: string): ActionTypes.RemoveFromCart => ({
    type: STORE_ACTIONS.REMOVE_FROM_CART,
    skuId,
});

export const removeFromCartAction = (skuId: string): ThunkAction<void, GlobalStateShape, void, ActionTypes.UpdateCartActions> =>
    (dispatch) => dispatch(removeItemFromCart(skuId));


const initCartSuccess = (items: string[]): ActionTypes.InitCartSuccess => ({
    type: STORE_ACTIONS.INIT_CART_SUCCESS,
    items,
});

const shouldInitCart = (state: GlobalStateShape) => {
    return !state.shop.cartIsInit;
};

export const initCartAction = (): ThunkAction<void, GlobalStateShape, void, ActionTypes.InitCartActions> =>
    (dispatch, getState) => {
        if (shouldInitCart(getState())) {
            if (storageAvailable()) {
                const cart = JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
                dispatch(initCartSuccess(cart));
            } else {
                dispatch(initCartSuccess([]));
            }
        }
    };

export const syncLocalStorage = (): ThunkAction<void, GlobalStateShape, void, null> =>
    (_, getState) => {
        if (storageAvailable()) {
            window.localStorage.setItem(
                LOCAL_STORAGE_KEY,
                JSON.stringify(getState().shop.cart.items)
            );
        }
    };

const shouldCheckout = (state: GlobalStateShape) =>
    !state.shop.isCheckingOut;

export const checkoutAction = (email: string): ThunkAction<void, GlobalStateShape, void, ActionTypes.CheckCustomerActions> =>
    async (dispatch, getState) => {
        if (shouldCheckout) {
            try {
                dispatch({
                    type: STORE_ACTIONS.CHECKOUT_REQUEST,
                });
                const response = await axios.post<{ sessionId: string }>('/api/shop/checkout', {
                    email,
                    skus: getState().shop.cart.items,
                });
                const { error } = await stripe.redirectToCheckout({
                    sessionId: response.data.sessionId
                });
                if (error) {
                    dispatch({
                        type: STORE_ACTIONS.CHECKOUT_ERROR,
                        errorMessage: 'Stripe redirect failed. Did your internet connection reset?'
                    });
                }
            } catch (e) {
                const axiosError = e as AxiosError<{ skus: string[] }>;
                if (axiosError.response && axiosError.response.status === 422) {
                    const prevPurchasedString = axiosError.response.data.skus.map((sku) =>
                        `* ${getState().shop.items.find(v => v.id === sku).caption}`
                    ).join('\n');
                    dispatch({
                        type: STORE_ACTIONS.CHECKOUT_ERROR,
                        errorMessage: `These items have been previously purchased:\n${prevPurchasedString}.`,
                    });
                } else {
                    console.log("Checkout Error.", e);
                }
            }
        }

    };
