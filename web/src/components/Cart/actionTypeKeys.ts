enum CART_ACTIONS {
    ADD_TO_CART = 'CART--ADD_TO_CART',
    REMOVE_FROM_CART = 'CART--REMOVE_FROM_CART',
    CLEAR_CART = 'CART--CLEAR_CART',
    INIT_SUCCESS = 'CART--INIT_CART_SUCCESS',
    INIT_ERROR = 'CART--INIT_CART_ERROR',
    CHECKOUT_REQUEST = 'CART--CHECKOUT_REQUEST',
    CHECKOUT_ERROR = 'CART--CHECKOUT_ERROR',
    CHECKOUT_SUCCESS = 'CART--CHECKOUT_SUCCESS',
    TOGGLE_CARTLIST = 'CART--TOGGLE_CARTLIST',
    POPPER_SETREF = 'CART--POPPER_SETREF',
    POPPER_SETPOP = 'CART--POPPER_SETPOP',
    POPPER_SETARROW = 'CART--POPPER_SETARROW',
}

export default CART_ACTIONS;