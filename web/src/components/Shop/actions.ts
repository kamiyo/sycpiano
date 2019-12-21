/* global Stripe */
import axios from 'axios';
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
        console.log('here')
        if (shouldCheckout) {
            try {
                console.log('inside');
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
                    console.log(error.message);
                    dispatch({
                        type: STORE_ACTIONS.CHECKOUT_ERROR,
                    });
                }
            } catch (e) {
                console.log("Checkout Error.", e);
            }
        }

    }

// const shouldSubmitCheckout = (state: GlobalStateShape) =>
//     !state.shop.isSubmitting && !state.shop.submitSuccess;

// const postToCheckoutAPI = async (
//     skuIds: string[],
//     tokenPromise: Promise<ReactStripeElements.PatchedTokenResponse>,
// ): Promise<boolean> => {
//     const { token } = await tokenPromise;
//     const { data: { success } }: { data: { success: boolean } } = await axios.post(
//         'api/store/checkout',
//         { skuIds, tokenId: token.id },
//     );
//     return success;
// };

// const getCheckoutSubmitAsync = (
//     skuIds: string[],
//     tokenPromise: Promise<ReactStripeElements.PatchedTokenResponse>,
// ): SycStoreThunkAction => async (dispatch) => {
//     try {
//         dispatch({ type: STORE_ACTIONS.CHECKOUT_SUBMIT });
//         const success = await postToCheckoutAPI(skuIds, tokenPromise);
//         if (success) {
//             dispatch({ type: STORE_ACTIONS.CHECKOUT_SUCCESS });
//         } else {
//             dispatch({ type: STORE_ACTIONS.CHECKOUT_FAILURE });
//         }
//     } catch (err) {
//         console.log('checkout error', err);
//         dispatch({ type: STORE_ACTIONS.CHECKOUT_FAILURE });
//     }
// };

// export const checkoutSubmitAction = (
//     skuIds: string[],
//     tokenPromise: Promise<ReactStripeElements.PatchedTokenResponse>,
// ): SycStoreThunkAction =>
//     async (dispatch, getState) => {
//         if (shouldSubmitCheckout(getState())) {
//             await dispatch(getCheckoutSubmitAsync(skuIds, tokenPromise));
//         }
//     };