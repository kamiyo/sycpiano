import axios from 'axios';
import { ThunkAction } from 'redux-thunk';

import PHOTO_ACTIONS from 'src/components/Media/Photos/actionTypeKeys';
import * as PhotoActions from 'src/components/Media/Photos/actionTypes';
import { PhotoItem, PhotoListReducerShape } from 'src/components/Media/Photos/types';
import { GlobalStateShape } from 'src/types';

const fetchPhotosSuccess = (items: PhotoItem[]): PhotoActions.FetchPhotosSuccess => ({
    type: PHOTO_ACTIONS.FETCH_PHOTOS_SUCCESS,
    items,
});

const fetchPhotosError = (): PhotoActions.FetchPhotosError => ({
    type: PHOTO_ACTIONS.FETCH_PHOTOS_ERROR,
});

const fetchPhotosRequest = (): PhotoActions.FetchPhotosRequest => ({
    type: PHOTO_ACTIONS.FETCH_PHOTOS_REQUEST,
});

const shouldFetchPhotos = (state: PhotoListReducerShape) => {
    if (state.isFetching || state.items.length) {
        return false;
    }
    return true;
};

export const selectPhoto = (item: PhotoItem): PhotoActions.SelectPhoto => ({
    type: PHOTO_ACTIONS.SELECT_PHOTO,
    item,
});

export const createFetchPhotosAction = (): ThunkAction<Promise<void>, GlobalStateShape, void, PhotoActions.default> =>
    async (dispatch, getState) => {
        if (shouldFetchPhotos(getState().photo_list)) {
            try {
                dispatch(fetchPhotosRequest());
                const response = await axios.get('/api/photos');
                dispatch(fetchPhotosSuccess(response.data));
                dispatch(selectPhoto(response.data[0]));
            } catch (e) {
                console.log('fetch photos error: ', e);
                dispatch(fetchPhotosError());
            }
        } else {
            dispatch(selectPhoto(getState().photo_list.items[0]));
        }
    };
