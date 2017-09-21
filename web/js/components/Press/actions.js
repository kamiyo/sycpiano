import axios from 'axios';

export const PRESS_ACTIONS = {
    FETCH_ACCLAIMS_REQUEST: 'PRESS--FETCH_ACCLAIMS_REQUEST',
    FETCH_ACCLAIMS_SUCCESS: 'PRESS--FETCH_ACCLAIMS_SUCCESS'
};

const fetchAcclaimsRequest = () => ({
    type: PRESS_ACTIONS.FETCH_ACCLAIMS_REQUEST
});

const shouldFetchAcclaims = (state) => {
    const acclaimsReducer = state.press_acclaimsList;
    return (acclaimsReducer.items.length === 0 && !acclaimsReducer.isFetching);
}

const fetchAcclaimsSuccess = (items) => ({
    type: PRESS_ACTIONS.FETCH_ACCLAIMS_SUCCESS,
    items: items
});

const fetchAcclaims = () => (dispatch) => {
    dispatch(fetchAcclaimsRequest());
    return axios.get('/api/acclaims').then(response => (
        dispatch(fetchAcclaimsSuccess(response.data))
    ));
}

export const createFetchAcclaimsAction = () => (dispatch, getState) => {
    if (shouldFetchAcclaims(getState())) {
        return dispatch(fetchAcclaims());
    } else {
        return Promise.resolve();
    }
}