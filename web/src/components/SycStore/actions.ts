import axios from 'axios';
import { ThunkAction } from 'redux-thunk';
import { GlobalStateShape } from 'src/types';
import { StoreCart, StoreItem } from './types';

import STORE_ACTIONS from 'src/components/SycStore/actionTypeKeys';
import * as ActionTypes from 'src/components/SycStore/actionTypes';

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

type SycStoreThunkAction = ThunkAction<Promise<void>, GlobalStateShape, void, ActionTypes.Types>;

const fetchItems = (): SycStoreThunkAction => (
    async (dispatch) => {
        try {
            dispatch(fetchItemsRequest());
            const { data: items }: { data: StoreItem[] } = await axios.get('api/store/items');
            dispatch(fetchItemsSuccess(items));
        } catch (err) {
            console.log('fetch products error', err);
            dispatch(fetchItemsError());
        }
    }
);

export const fetchItemsAction = (): SycStoreThunkAction => (
    async (dispatch, getState) => {
        if (shouldFetchItems(getState())) {
            await dispatch(fetchItems());
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

export const removeFromCartAction = (skuId: string): ThunkAction<void, GlobalStateShape, void, ActionTypes.Types> => (
    (dispatch) => dispatch(removeFromCart(skuId))
);
