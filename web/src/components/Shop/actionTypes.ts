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

export interface InitCartError {
    readonly type: typeof STORE_ACTIONS.INIT_CART_ERROR;
}

export interface InitCartSuccess {
    readonly type: typeof STORE_ACTIONS.INIT_CART_SUCCESS;
    readonly items: string[];
}

export interface AddToCart {
    readonly type: typeof STORE_ACTIONS.ADD_TO_CART;
    readonly skuId: string;
}

export interface RemoveFromCart {
    readonly type: typeof STORE_ACTIONS.REMOVE_FROM_CART;
    readonly skuId: string;
}

export interface CheckoutRequest {
    readonly type: typeof STORE_ACTIONS.CHECKOUT_REQUEST;
}

export interface CheckoutSuccess {
    readonly type: typeof STORE_ACTIONS.CHECKOUT_SUCCESS;
}

export interface CheckoutError {
    readonly type: typeof STORE_ACTIONS.CHECKOUT_ERROR;
    readonly errorMessage: string;
}

export type UpdateCartActions = AddToCart | RemoveFromCart;
export type InitCartActions = InitCartError | InitCartSuccess;
export type FetchItemsActions = FetchItemsRequest | FetchItemsSuccess | FetchItemsError;
export type CheckCustomerActions = CheckoutRequest | CheckoutSuccess | CheckoutError;

export type Types = InitCartActions | FetchItemsActions | UpdateCartActions | CheckCustomerActions;