import CART_ACTIONS from 'src/components/Cart/actionTypeKeys';
import { ReferenceObject } from 'popper.js'
import { CheckoutErrorObject } from 'src/components/Cart/types';


export interface InitCartError {
    readonly type: typeof CART_ACTIONS.INIT_ERROR;
}

export interface InitCartSuccess {
    readonly type: typeof CART_ACTIONS.INIT_SUCCESS;
    readonly items: string[];
    readonly email: string;
}

export interface AddToCart {
    readonly type: typeof CART_ACTIONS.ADD_TO_CART;
    readonly skuId: string;
}

export interface RemoveFromCart {
    readonly type: typeof CART_ACTIONS.REMOVE_FROM_CART;
    readonly skuId: string;
}

export interface ClearCart {
    readonly type: typeof CART_ACTIONS.CLEAR_CART;
}

export interface CheckoutRequest {
    readonly type: typeof CART_ACTIONS.CHECKOUT_REQUEST;
}

export interface CheckoutSuccess {
    readonly type: typeof CART_ACTIONS.CHECKOUT_SUCCESS;
}

export interface CheckoutError {
    readonly type: typeof CART_ACTIONS.CHECKOUT_ERROR;
    readonly error: CheckoutErrorObject;
}

export interface ToggleCartList {
    readonly type: typeof CART_ACTIONS.TOGGLE_CARTLIST;
    readonly visible?: boolean;
}

export interface PopperSetRef {
    readonly type: typeof CART_ACTIONS.POPPER_SETREF;
    readonly el: ReferenceObject;
}

export interface PopperSetPop {
    readonly type: typeof CART_ACTIONS.POPPER_SETPOP;
    readonly el: HTMLDivElement;
}

export interface PopperSetArrow {
    readonly type: typeof CART_ACTIONS.POPPER_SETARROW;
    readonly el: HTMLDivElement;
}

export type UpdateCartActions = AddToCart | RemoveFromCart | ClearCart;
export type InitCartActions = InitCartError | InitCartSuccess;
export type CheckCustomerActions = CheckoutRequest | CheckoutSuccess | CheckoutError;
export type PopperActions = PopperSetRef | PopperSetPop | PopperSetArrow;

export type Types = InitCartActions | UpdateCartActions | CheckCustomerActions | ToggleCartList | PopperActions;