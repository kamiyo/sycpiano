import PHOTO_ACTIONS from 'src/components/Media/Photos/actionTypeKeys';

export interface FetchPhotosRequest {
    type: PHOTO_ACTIONS.FETCH_PHOTOS_REQUEST;
}

export interface FetchPhotosSuccess {
    type: PHOTO_ACTIONS.FETCH_PHOTOS_SUCCESS;
    items: string[];
}

export interface FetchPhotosError {
    type: PHOTO_ACTIONS.FETCH_PHOTOS_ERROR;
}

export interface OtherAction {
    type: PHOTO_ACTIONS.OTHER_ACTION;
}

type PhotoActions = FetchPhotosRequest | FetchPhotosSuccess | FetchPhotosError |
                    OtherAction;

export default PhotoActions;
