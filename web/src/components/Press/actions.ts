import axios from 'axios';

import { ThunkAction } from 'redux-thunk';

import PRESS_ACTIONS from 'src/components/Press/actionTypeKeys';
import * as ActionTypes from 'src/components/Press/actionTypes';
import { AcclaimItemShape } from 'src/components/Press/types';

import { GlobalStateShape } from 'src/types';

const fetchAcclaimsRequest = (): ActionTypes.FetchAcclaimsRequest => ({
    type: PRESS_ACTIONS.FETCH_ACCLAIMS_REQUEST,
});

const fetchAcclaimsError = (): ActionTypes.FetchAcclaimsError => ({
    type: PRESS_ACTIONS.FETCH_ACCLAIMS_ERROR,
});

const shouldFetchAcclaims = (state: GlobalStateShape) => {
    const acclaimsReducer = state.press_acclaimsList;
    return (acclaimsReducer.items.length === 0 && !acclaimsReducer.isFetching);
};

const fetchAcclaimsSuccess = (items: AcclaimItemShape[]): ActionTypes.FetchAcclaimsSuccess => ({
    type: PRESS_ACTIONS.FETCH_ACCLAIMS_SUCCESS,
    items,
});

const fetchAcclaims = (): ThunkAction<void, GlobalStateShape, void> => async (dispatch) => {
    try {
        dispatch(fetchAcclaimsRequest());
        const response = await axios.get('/api/acclaims');
        dispatch(fetchAcclaimsSuccess(response.data));
    } catch (err) {
        console.log('fetch acclaims error', err);
        dispatch(fetchAcclaimsError());
    }
};

export const createFetchAcclaimsAction = (): ThunkAction<void, GlobalStateShape, void> => (dispatch, getState) => {
    if (shouldFetchAcclaims(getState())) {
        dispatch(fetchAcclaims());
    }
};
