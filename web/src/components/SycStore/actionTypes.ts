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

export interface AddToCart {
    readonly type: typeof STORE_ACTIONS.ADD_TO_CART;
    readonly skuId: string;
}

export interface RemoveFromCart {
    readonly type: typeof STORE_ACTIONS.REMOVE_FROM_CART;
    readonly skuId: string;
}

export interface CheckoutSubmit {
    readonly type: typeof STORE_ACTIONS.CHECKOUT_SUBMIT;
}

export interface CheckoutSuccess {
    readonly type: typeof STORE_ACTIONS.CHECKOUT_SUCCESS;
}

export interface CheckoutFailure {
    readonly type: typeof STORE_ACTIONS.CHECKOUT_FAILURE;
}

export type Types = (
    FetchItemsRequest | FetchItemsSuccess | FetchItemsError |
    AddToCart | RemoveFromCart |
    CheckoutSubmit | CheckoutSuccess | CheckoutFailure
);
