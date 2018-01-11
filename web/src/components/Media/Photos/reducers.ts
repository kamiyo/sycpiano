import PHOTO_ACTIONS from 'src/components/Media/Photos/actionTypeKeys';
import PhotoActions from 'src/components/Media/Photos/actionTypes';
import { PhotoListReducerShape, PhotoViewerReducerShape } from 'src/components/Media/Photos/types';

export const photoListReducer = (state: PhotoListReducerShape = {
    items: [],
    isFetching: false,
}, action: PhotoActions) => {
    switch (action.type) {
        case PHOTO_ACTIONS.FETCH_PHOTOS_REQUEST:
            return {
                ...state,
                isFetching: true,
            };
        case PHOTO_ACTIONS.FETCH_PHOTOS_ERROR:
            return {
                ...state,
                isFetching: false,
            };
        case PHOTO_ACTIONS.FETCH_PHOTOS_SUCCESS:
            return {
                ...state,
                items: action.items,
            };
        default:
            return state;
    }
};

export const photoViewerReducer = (state: PhotoViewerReducerShape = {
    currentItem: null,
}, action: PhotoActions) => {
    switch (action.type) {
        case PHOTO_ACTIONS.SELECT_PHOTO:
            return {
                currentItem: action.item,
            };
        default:
            return state;
    }
};
