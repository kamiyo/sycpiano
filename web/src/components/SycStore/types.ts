export interface StoreItem {
    readonly caption: string;
    readonly created: number;
    readonly description: string;
    readonly productId: string;
    readonly images: string[];
    readonly name: string;
    readonly updated: number;
    // Usually, a product will potentially have multiple SKUs,
    // but in our case, each item in the store will only have one SKU
    // with infinite stock, since they're just PDFs.
    readonly skuId: string;
}

export interface StoreCart {
    items: string[];
    itemSet: Set<string>;
}

export interface SycStoreStateShape {
    isFetching: boolean;
    fetchSuccess: boolean;
    items: StoreItem[];
    cart: StoreCart;
}
