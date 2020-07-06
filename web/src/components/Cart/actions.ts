/* global Stripe */
import axios, { AxiosError } from 'axios';
import { ThunkAction } from 'redux-thunk';
import { GlobalStateShape } from 'src/types';
import { Sku } from 'src/components/Shop/types';

import CART_ACTIONS from 'src/components/Cart/actionTypeKeys';
import * as ActionTypes from 'src/components/Cart/actionTypes';
import { storageAvailable } from 'src/localStorage';

const LOCAL_STORAGE_KEY = 'seanchenpiano_cart';

const stripe = Stripe(STRIPE_PUBLIC);

const addItemToCart = (skuId: string): ActionTypes.AddToCart => ({
    type: CART_ACTIONS.ADD_TO_CART,
    skuId,
});

export const addToCartAction = (skuId: string): ThunkAction<void, GlobalStateShape, void, ActionTypes.UpdateCartActions> => (
    (dispatch) => dispatch(addItemToCart(skuId))
);

const removeItemFromCart = (skuId: string): ActionTypes.RemoveFromCart => ({
    type: CART_ACTIONS.REMOVE_FROM_CART,
    skuId,
});

export const removeFromCartAction = (skuId: string): ThunkAction<void, GlobalStateShape, void, ActionTypes.UpdateCartActions> =>
    (dispatch) => dispatch(removeItemFromCart(skuId));


const initCartSuccess = (items: string[]): ActionTypes.InitCartSuccess => ({
    type: CART_ACTIONS.INIT_SUCCESS,
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
                    type: CART_ACTIONS.CHECKOUT_REQUEST,
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
                        type: CART_ACTIONS.CHECKOUT_ERROR,
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
                        type: CART_ACTIONS.CHECKOUT_ERROR,
                        errorMessage: `These items have been previously purchased:\n${prevPurchasedString}.`,
                    });
                } else {
                    console.log("Checkout Error.", e);
                }
            }
        }

    };
