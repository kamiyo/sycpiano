import axios from 'axios';
import { ThunkAction } from 'redux-thunk';

import BIO_ACTIONS from 'src/components/About/Bio/actionTypeKeys';
import * as ActionTypes from 'src/components/About/Bio/actionTypes';
import { Blurb } from 'src/components/About/Bio/types';
import { GlobalStateShape } from 'src/types';

const fetchBioRequest = (): ActionTypes.FetchBioRequest => ({
    type: BIO_ACTIONS.FETCH_BIO_REQUEST,
});

const fetchBioSuccess = (bio: Blurb[]): ActionTypes.FetchBioSuccess => ({
    type: BIO_ACTIONS.FETCH_BIO_SUCCESS,
    bio,
});

const fetchBioError = (): ActionTypes.FetchBioError => ({
    type: BIO_ACTIONS.FETCH_BIO_ERROR,
});

const shouldFetchBio = (state: GlobalStateShape) => {
    return !state.bio.isFetching && state.bio.bio.length === 0;
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
