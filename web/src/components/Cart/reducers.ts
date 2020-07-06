import CART_ACTIONS from 'src/components/Cart/actionTypeKeys';
import * as ActionTypes from 'src/components/Cart/actionTypes';
import { CartStateShape } from 'src/components/Cart/types';

export const cartReducer = (state: CartStateShape = {
    items: [],
    isInit: false,
}, action: ActionTypes.Types) => {
    switch (action.type) {
        case CART_ACTIONS.INIT_SUCCESS:
            return {
                ...state,
                cartIsInit: true,
                cart: {
                    items: action.items,
                },
            };
        case CART_ACTIONS.INIT_ERROR:
            return {
                ...state,
                cartIsInit: false,
            };
        case CART_ACTIONS.ADD_TO_CART: {
            const retArray = state.items.splice(0);
            retArray.push(action.skuId)
            return {
                ...state,
                cart: {
                    items: retArray,
                },
                errorMessage: '',
            };
        }
        case CART_ACTIONS.REMOVE_FROM_CART: {
            const retArray = state.items.splice(0);
            retArray.splice(retArray.findIndex((v: string) => v === action.skuId), 1);
            console.log(retArray);
            return {
                ...state,
                cart: {
                    items: retArray,
                },
                errorMessage: '',
            };
        }
        case CART_ACTIONS.CHECKOUT_REQUEST: {
            return {
                ...state,
                isCheckingOut: true,
                checkOutErrorMessage: '',
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
        default:
            return state;
    }
};