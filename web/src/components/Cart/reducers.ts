import CART_ACTIONS from 'src/components/Cart/actionTypeKeys';
import * as ActionTypes from 'src/components/Cart/actionTypes';
import { CartStateShape } from 'src/components/Cart/types';

export const cartReducer = (state: CartStateShape = {
    items: [],
    isInit: false,
    visible: false,
    isCheckingOut: false,
    checkoutErrorMessage: '',
}, action: ActionTypes.Types) => {
    switch (action.type) {
        case CART_ACTIONS.INIT_SUCCESS:
            return {
                ...state,
                isInit: true,
                items: action.items,
            };
        case CART_ACTIONS.INIT_ERROR:
            return {
                ...state,
                isInit: false,
            };
        case CART_ACTIONS.ADD_TO_CART: {
            return {
                ...state,
                items: [action.skuId, ...state.items],
            };
        }
        case CART_ACTIONS.REMOVE_FROM_CART: {
            const retArray = state.items.splice(0);
            retArray.splice(retArray.findIndex((v: string) => v === action.skuId), 1);
            return {
                ...state,
                items: retArray,
            };
        }
        case CART_ACTIONS.CHECKOUT_REQUEST: {
            return {
                ...state,
                isCheckingOut: true,
            };
        }
        case CART_ACTIONS.CHECKOUT_ERROR: {
            return {
                ...state,
                isCheckingOut: false,
                checkOutErrorMessage: action.errorMessage,
            };
        }
        case CART_ACTIONS.CHECKOUT_SUCCESS: {
            return {
                ...state,
                isCheckingOut: false,
                checkOutErrorMessage: '',
            };
        }
        case CART_ACTIONS.TOGGLE_CARTLIST: {
            return {
                ...state,
                visible: (action.visible === undefined) ? !state.visible : action.visible,
            };
        }
        default:
            return state;
    }
};