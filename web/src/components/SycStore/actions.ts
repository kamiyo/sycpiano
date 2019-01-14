import axios from 'axios';
import { ThunkAction } from 'redux-thunk';
import { GlobalStateShape } from 'src/types';
import { StoreItem } from './types';

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

type FetchItemsActions = ActionTypes.FetchItemsRequest | ActionTypes.FetchItemsSuccess | ActionTypes.FetchItemsError;

const fetchItems = (): ThunkAction<Promise<void>, GlobalStateShape, void, FetchItemsActions> => (
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

export const fetchItemsAction = (): ThunkAction<Promise<void>, GlobalStateShape, void, FetchItemsActions> => (
    async (dispatch, getState) => {
        if (shouldFetchItems(getState())) {
            await dispatch(fetchItems());
        }
    }
);
