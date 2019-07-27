import axios from 'axios';
import { ThunkAction } from 'redux-thunk';
import { ReactStripeElements } from 'react-stripe-elements';
import { GlobalStateShape } from 'src/types';
import { StoreItem } from './types';

import STORE_ACTIONS from 'src/components/SycStore/actionTypeKeys';
import * as ActionTypes from 'src/components/SycStore/actionTypes';

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
