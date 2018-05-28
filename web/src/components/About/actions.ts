import axios from 'axios';
import { ThunkAction } from 'redux-thunk';

import ABOUT_ACTIONS from 'src/components/About/actionTypeKeys';
import * as ActionTypes from 'src/components/About/actionTypes';
import { Blurb } from 'src/components/About/types';
import { GlobalStateShape } from 'src/types';

const fetchBioRequest = (): ActionTypes.FetchBioRequest => ({
    type: ABOUT_ACTIONS.FETCH_BIO_REQUEST,
});

const fetchBioSuccess = (bio: Blurb[]): ActionTypes.FetchBioSuccess => ({
    type: ABOUT_ACTIONS.FETCH_BIO_SUCCESS,
    bio,
});

const fetchBioError = (): ActionTypes.FetchBioError => ({
    type: ABOUT_ACTIONS.FETCH_BIO_ERROR,
});

const shouldFetchBio = (state: GlobalStateShape) => {
    return !state.about.isFetching && state.about.bio.length === 0;
};

type FetchBioActions = ActionTypes.FetchBioError | ActionTypes.FetchBioRequest | ActionTypes.FetchBioSuccess;

const fetchBio = (): ThunkAction<Promise<void>, GlobalStateShape, void, FetchBioActions> =>
    async (dispatch) => {
        try {
            dispatch(fetchBioRequest());
            const { data: bio }: { data: Blurb[] } = await axios.get('/api/bio');
            dispatch(fetchBioSuccess(bio));
        } catch (err) {
            console.log('fetch bio error', err);
            dispatch(fetchBioError());
        }
    };

export const fetchBioAction = (): ThunkAction<Promise<void>, GlobalStateShape, void, FetchBioActions> =>
    async (dispatch, getState) => {
        if (shouldFetchBio(getState())) {
            await dispatch(fetchBio());
        }
    };
