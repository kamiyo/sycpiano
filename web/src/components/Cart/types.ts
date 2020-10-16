import { ReferenceObject } from 'popper.js'

export interface CheckoutErrorObject {
    message: string;
    data?: string[];
}

export interface CartStateShape {
    isInit: boolean;
    items: string[];
    visible: boolean;
    checkoutError: CheckoutErrorObject;
    isCheckingOut: boolean;
    referenceElement: ReferenceObject;
    popperElement: HTMLDivElement;
    arrowElement: HTMLDivElement;
}
