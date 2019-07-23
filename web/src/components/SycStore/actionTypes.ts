import STORE_ACTIONS from 'src/components/SycStore/actionTypeKeys';
import { StoreItem } from './types';

export interface FetchItemsRequest {
    readonly type: typeof STORE_ACTIONS.FETCH_ITEMS_REQUEST;
}

export interface FetchItemsSuccess {
    readonly type: typeof STORE_ACTIONS.FETCH_ITEMS_SUCCESS;
    readonly items: StoreItem[];
}

export interface FetchItemsError {
    readonly type: typeof STORE_ACTIONS.FETCH_ITEMS_ERROR;
}

export interface FetchCartError {
    readonly type: typeof STORE_ACTIONS.FETCH_CART_ERROR;
}

export interface FetchCartSuccess {
    readonly type: typeof STORE_ACTIONS.FETCH_CART_SUCCESS;
    readonly cart: string[];
}

export interface AddItemToCart {
    readonly type: typeof STORE_ACTIONS.ADD_ITEM_TO_CART;
    readonly sku: string;
}

export interface RemoveItemFromCart {
    readonly type: typeof STORE_ACTIONS.REMOVE_ITEM_FROM_CART;
    readonly sku: string;
}

export type UpdateCartOptions = AddItemToCart | RemoveItemFromCart;
export type FetchCartActions = FetchCartError | FetchCartSuccess;
export type FetchItemsActions = FetchItemsRequest | FetchItemsSuccess | FetchItemsError;

type ActionTypes = FetchCartActions | FetchItemsActions | UpdateCartOptions;

export default ActionTypes;
