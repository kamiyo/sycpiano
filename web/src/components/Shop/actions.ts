import axios from 'axios';
import { ThunkAction } from 'redux-thunk';
import { ReactStripeElements } from 'react-stripe-elements';
import { GlobalStateShape } from 'src/types';
import { ShopItem } from './types';

import STORE_ACTIONS from 'src/components/Shop/actionTypeKeys';
import * as ActionTypes from 'src/components/Shop/actionTypes';
import { storageAvailable } from './localStorage';

const LOCAL_STORAGE_KEY = 'seanchenpiano_cart';

const shouldFetchItems = (state: GlobalStateShape) =>
    !state.shop.isFetching && !state.shop.fetchSuccess;

type SycStoreThunkAction = ThunkAction<Promise<void>, GlobalStateShape, void, ActionTypes.Types>;

const fetchItemsAsync: SycStoreThunkAction = async (dispatch) => {
    try {
        dispatch({ type: STORE_ACTIONS.FETCH_ITEMS_REQUEST });
        const { data: items }: { data: ShopItem[] } = await axios.get('/api/store/items');
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

const addItemToCart = (skuId: string): ActionTypes.AddItemToCart => ({
    type: STORE_ACTIONS.ADD_ITEM_TO_CART,
    skuId,
});

export const addItemToCartAction = (skuId: string): ThunkAction<void, GlobalStateShape, void, ActionTypes.UpdateCartActions> => (
    (dispatch) => dispatch(addItemToCart(skuId))
);

const removeItemFromCart = (skuId: string): ActionTypes.RemoveItemFromCart => ({
    type: STORE_ACTIONS.REMOVE_ITEM_FROM_CART,
    skuId,
});

export const removeItemFromCartAction = (skuId: string): ThunkAction<void, GlobalStateShape, void, ActionTypes.UpdateCartActions> =>
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
                const cart = JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_KEY) || '""');
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
                JSON.stringify(getState().shop.cart.items.toJSON())
            );
        }
    };

const shouldSubmitCheckout = (state: GlobalStateShape) =>
    !state.shop.isSubmitting && !state.shop.submitSuccess;

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
        }
    } catch (err) {
        console.log('checkout error', err);
        dispatch({ type: STORE_ACTIONS.CHECKOUT_FAILURE });
    }
};

export const checkoutSubmitAction = (
    skuIds: string[],
    tokenPromise: Promise<ReactStripeElements.PatchedTokenResponse>,
): SycStoreThunkAction =>
    async (dispatch, getState) => {
        if (shouldSubmitCheckout(getState())) {
            await dispatch(getCheckoutSubmitAsync(skuIds, tokenPromise));
        }
    };
