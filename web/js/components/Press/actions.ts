import axios from 'axios';

import { Dispatch } from 'redux';

import PRESS_ACTIONS from 'js/components/Press/actionTypeKeys';
import * as ActionTypes from 'js/components/Press/actionTypes';
import { AcclaimItemShape } from 'js/components/Press/types';

import { GlobalStateShape } from 'js/types';

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

const fetchAcclaims = () => async (dispatch: Dispatch<GlobalStateShape>) => {
    try {
        dispatch(fetchAcclaimsRequest());
        const response = await axios.get('/api/acclaims');
        dispatch(fetchAcclaimsSuccess(response.data));
    } catch (err) {
        console.log('fetch acclaims error', err);
        dispatch(fetchAcclaimsError());
    }
};

export const createFetchAcclaimsAction = () => (dispatch: Dispatch<GlobalStateShape>, getState: () => GlobalStateShape) => {
    if (shouldFetchAcclaims(getState())) {
        dispatch(fetchAcclaims());
    }
};
