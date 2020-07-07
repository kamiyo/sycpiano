import CART_ACTIONS from 'src/components/Cart/actionTypeKeys';

export interface InitCartError {
    readonly type: typeof CART_ACTIONS.INIT_ERROR;
}

export interface InitCartSuccess {
    readonly type: typeof CART_ACTIONS.INIT_SUCCESS;
    readonly items: string[];
}

export interface AddToCart {
    readonly type: typeof CART_ACTIONS.ADD_TO_CART;
    readonly skuId: string;
}

export interface RemoveFromCart {
    readonly type: typeof CART_ACTIONS.REMOVE_FROM_CART;
    readonly skuId: string;
}

export interface CheckoutRequest {
    readonly type: typeof CART_ACTIONS.CHECKOUT_REQUEST;
}

export interface CheckoutSuccess {
    readonly type: typeof CART_ACTIONS.CHECKOUT_SUCCESS;
}

export interface CheckoutError {
    readonly type: typeof CART_ACTIONS.CHECKOUT_ERROR;
    readonly errorMessage: string;
}

export interface ToggleCartList {
    readonly type: typeof CART_ACTIONS.TOGGLE_CARTLIST;
    readonly visible?: boolean;
}

export type UpdateCartActions = AddToCart | RemoveFromCart;
export type InitCartActions = InitCartError | InitCartSuccess;
export type CheckCustomerActions = CheckoutRequest | CheckoutSuccess | CheckoutError;

export type Types = InitCartActions | UpdateCartActions | CheckCustomerActions | ToggleCartList;