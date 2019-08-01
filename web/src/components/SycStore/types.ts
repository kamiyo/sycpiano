export interface StoreItem {
    readonly caption: string;
    readonly created: number;
    readonly description: string;
<<<<<<< HEAD
    readonly id: string;
    readonly image: string;
    readonly name: string;
    readonly updated: number;
    readonly price: number;
}

export interface OrderItem {
    readonly amount: number;
    readonly quantity?: number;
    readonly description: string;
    readonly type: 'sku' | 'tax' | 'shipping' | 'discount';
    readonly parent?: string;
}

export interface Order {
    readonly id: string;
    readonly amount: number;
    readonly items: OrderItem[];
=======
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
>>>>>>> origin/add_store_checkout
}

export interface SycStoreStateShape {
    isFetching: boolean;
    fetchSuccess: boolean;
    isSubmitting: boolean;
    submitSuccess: boolean;
    items: StoreItem[];
    cart: StoreCart;
}

export interface CartStateShape {
    cartError: boolean;
    isFetching: boolean;
    order: Order;
}
