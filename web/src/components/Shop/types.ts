export interface Sku {
    readonly caption: string;
    readonly created: number;
    readonly description: string;
    readonly id: string;
    readonly image: string;
    readonly name: string;
    readonly updated: number;
    readonly price: number;
    readonly format: string;
    readonly pages: number;
}

export interface ShoppingCart {
    items: string[];
}

export interface ShopStateShape {
    isFetching: boolean;
    fetchSuccess: boolean;
    items: Sku[];
}
