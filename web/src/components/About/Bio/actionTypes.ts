import BIO_ACTIONS from 'src/components/About/Bio/actionTypeKeys';
import { Blurb } from 'src/components/About/Bio/types';

export interface FetchBioRequest {
    readonly type: typeof BIO_ACTIONS.FETCH_BIO_REQUEST;
}

export interface FetchBioError {
    readonly type: typeof BIO_ACTIONS.FETCH_BIO_ERROR;
}

export interface FetchBioSuccess {
    readonly type: typeof BIO_ACTIONS.FETCH_BIO_SUCCESS;
    readonly bio: Blurb[];
}

export type ActionTypes = FetchBioError | FetchBioRequest | FetchBioSuccess;
