import axios from 'axios';

export const PRESS_ACTIONS = {
    FETCH_ACCLAIMS_REQUEST: 'PRESS--FETCH_ACCLAIMS_REQUEST',
    FETCH_ACCLAIMS_SUCCESS: 'PRESS--FETCH_ACCLAIMS_SUCCESS',
    FETCH_ACCLAIMS_ERROR: 'PRESS--FETCH_ACCLAIMS_ERROR',
};

const fetchAcclaimsRequest = () => ({
    type: PRESS_ACTIONS.FETCH_ACCLAIMS_REQUEST
});

const fetchAcclaimsRequest = () => ({
    type: PRESS_ACTIONS.FETCH_ACCLAIMS_ERROR
});

const shouldFetchAcclaims = (state) => {
    const acclaimsReducer = state.press_acclaimsList;
    return (acclaimsReducer.items.length === 0 && !acclaimsReducer.isFetching);
}

const fetchAcclaimsSuccess = (items) => ({
    type: PRESS_ACTIONS.FETCH_ACCLAIMS_SUCCESS,
    items: items
});

const fetchAcclaims = () => async (dispatch) => {
    try {
        dispatch(fetchAcclaimsRequest());
        const response = await axios.get('/api/acclaims');
        dispatch(fetchAcclaimsSuccess(response.data))
    } catch (err) {
        console.log('fetch acclaims error', err);
        dispatch(fetchAcclaimsError());
    }
}

export const createFetchAcclaimsAction = () => (dispatch, getState) => {
    if (shouldFetchAcclaims(getState())) {
        dispatch(fetchAcclaims());
    }
}