import axios from 'axios';

import { ThunkAction } from 'redux-thunk';

import PRESS_ACTIONS from 'src/components/About/Press/actionTypeKeys';
import * as ActionTypes from 'src/components/About/Press/actionTypes';
import { AcclaimItemShape } from 'src/components/About/Press/types';

import { GlobalStateShape } from 'src/types';

const fetchAcclaimsRequest = (): ActionTypes.FetchAcclaimsRequest => ({
    type: PRESS_ACTIONS.FETCH_ACCLAIMS_REQUEST,
});

const fetchAcclaimsError = (): ActionTypes.FetchAcclaimsError => ({
    type: PRESS_ACTIONS.FETCH_ACCLAIMS_ERROR,
});

const shouldFetchAcclaims = (state: GlobalStateShape) => {
    const acclaimsReducer = state.pressAcclaimsList;
    return (acclaimsReducer.items.length === 0 && !acclaimsReducer.isFetching);
};

const fetchAcclaimsSuccess = (items: AcclaimItemShape[]): ActionTypes.FetchAcclaimsSuccess => ({
    type: PRESS_ACTIONS.FETCH_ACCLAIMS_SUCCESS,
    items,
});

const fetchAcclaims = (): ThunkAction<void, GlobalStateShape, void, ActionTypes.ActionTypes> => async (dispatch) => {
    try {
        dispatch(fetchAcclaimsRequest());
        const response = await axios.get('/api/acclaims');
        dispatch(fetchAcclaimsSuccess(response.data));
    } catch (err) {
        console.log('fetch acclaims error', err);
        dispatch(fetchAcclaimsError());
    }
};

export const createFetchAcclaimsAction = (): ThunkAction<void, GlobalStateShape, void, ActionTypes.ActionTypes> => (dispatch, getState) => {
    if (shouldFetchAcclaims(getState())) {
        dispatch(fetchAcclaims());
    }
};
