import DISCS_ACTIONS from 'src/components/About/Discs/actionTypeKeys';
import { Disc } from 'src/components/About/Discs/types';

export interface FetchDiscsRequest {
    readonly type: typeof DISCS_ACTIONS.FETCH_DISCS_REQUEST;
}

export interface FetchDiscsError {
    readonly type: typeof DISCS_ACTIONS.FETCH_DISCS_ERROR;
}

export interface FetchDiscsSuccess {
    readonly type: typeof DISCS_ACTIONS.FETCH_DISCS_SUCCESS;
    readonly discs: Disc[];
}

export type ActionTypes = FetchDiscsError | FetchDiscsRequest | FetchDiscsSuccess;
