import { OrderedSet } from 'immutable';

export interface ShopItem {
    readonly caption: string;
    readonly created: number;
    readonly description: string;
    readonly productId: string;
    readonly skuId: string;
    readonly image: string;
    readonly name: string;
    readonly updated: number;
    readonly price: number;
}

export interface ShoppingCart {
    items: OrderedSet<string>;
}

export interface ShopStateShape {
    isFetching: boolean;
    fetchSuccess: boolean;
    cartIsInit: boolean;
    isSubmitting: boolean;
    submitSuccess: boolean;
    items: ShopItem[];
    cart: ShoppingCart;
}
