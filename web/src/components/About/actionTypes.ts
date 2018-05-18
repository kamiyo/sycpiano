import ABOUT_ACTIONS from 'src/components/About/actionTypeKeys';
import { Blurb } from 'src/components/About/types';

export interface FetchBioRequest {
    readonly type: typeof ABOUT_ACTIONS.FETCH_BIO_REQUEST;
}

export interface FetchBioError {
    readonly type: typeof ABOUT_ACTIONS.FETCH_BIO_ERROR;
}

export interface FetchBioSuccess {
    readonly type: typeof ABOUT_ACTIONS.FETCH_BIO_SUCCESS;
    readonly bio: Blurb[];
}

type ActionTypes = FetchBioError | FetchBioRequest | FetchBioSuccess;

export default ActionTypes;
