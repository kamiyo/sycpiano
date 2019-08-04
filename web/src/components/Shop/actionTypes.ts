import STORE_ACTIONS from 'src/components/Shop/actionTypeKeys';
import { ShopItem } from './types';

export interface FetchItemsRequest {
    readonly type: typeof STORE_ACTIONS.FETCH_ITEMS_REQUEST;
}

export interface FetchItemsSuccess {
    readonly type: typeof STORE_ACTIONS.FETCH_ITEMS_SUCCESS;
    readonly items: ShopItem[];
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

export interface AddItemToCart {
    readonly type: typeof STORE_ACTIONS.ADD_ITEM_TO_CART;
    readonly skuId: string;
}

export interface RemoveItemFromCart {
    readonly type: typeof STORE_ACTIONS.REMOVE_ITEM_FROM_CART;
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

export type UpdateCartActions = AddItemToCart | RemoveItemFromCart;
export type InitCartActions = InitCartError | InitCartSuccess;
export type FetchItemsActions = FetchItemsRequest | FetchItemsSuccess | FetchItemsError;
export type CheckoutActions = CheckoutSubmit | CheckoutSuccess | CheckoutFailure;

export type Types = InitCartActions | FetchItemsActions | UpdateCartActions | CheckoutActions;