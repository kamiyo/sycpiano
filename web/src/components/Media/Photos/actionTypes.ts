import PHOTO_ACTIONS from 'src/components/Media/Photos/actionTypeKeys';
import { PhotoItem } from 'src/components/Media/Photos/types';

export interface FetchPhotosRequest {
    type: PHOTO_ACTIONS.FETCH_PHOTOS_REQUEST;
}

export interface FetchPhotosSuccess {
    type: PHOTO_ACTIONS.FETCH_PHOTOS_SUCCESS;
    items: PhotoItem[];
}

export interface FetchPhotosError {
    type: PHOTO_ACTIONS.FETCH_PHOTOS_ERROR;
}

export interface SelectPhoto {
    type: PHOTO_ACTIONS.SELECT_PHOTO;
    item: PhotoItem;
}

export interface OtherAction {
    type: PHOTO_ACTIONS.OTHER_ACTION;
}

export type ActionTypes = FetchPhotosRequest | FetchPhotosSuccess | FetchPhotosError |
    SelectPhoto | OtherAction;
