import STORE_ACTIONS from 'src/components/Shop/actionTypeKeys';
import { Sku } from './types';

export interface FetchItemsRequest {
    readonly type: typeof STORE_ACTIONS.FETCH_ITEMS_REQUEST;
}

export interface FetchItemsSuccess {
    readonly type: typeof STORE_ACTIONS.FETCH_ITEMS_SUCCESS;
    readonly items: Sku[];
}

export interface FetchItemsError {
    readonly type: typeof STORE_ACTIONS.FETCH_ITEMS_ERROR;
}

export type FetchItemsActions = FetchItemsRequest | FetchItemsSuccess | FetchItemsError;

export type Types = FetchItemsActions