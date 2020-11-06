import axios from 'axios';
import { ThunkAction } from 'redux-thunk';
import { GlobalStateShape } from 'src/types';
import { Product } from './types';

import STORE_ACTIONS from 'src/components/Shop/actionTypeKeys';
import * as ActionTypes from 'src/components/Shop/actionTypes';

const shouldFetchItems = (state: GlobalStateShape) =>
    !state.shop.isFetching && !state.shop.fetchSuccess;

type ShopThunkAction = ThunkAction<Promise<void>, GlobalStateShape, void, ActionTypes.Types>;

const fetchItemsAsync: ShopThunkAction = async (dispatch) => {
    try {
        dispatch({ type: STORE_ACTIONS.FETCH_ITEMS_REQUEST });
        const { data: items }: { data: Product[] } = await axios.get('/api/shop/items');
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
        } else {
            return Promise.resolve();
        }
    }
);
