export interface StoreItem {
    readonly caption: string;
    readonly created: number;
    readonly description: string;
    readonly id: string;
    readonly image: string;
    readonly name: string;
    readonly updated: number;
    readonly price: number;
}

export interface OrderItem {
    readonly amount: number;
    readonly quantity?: number;
    readonly type: 'sku' | 'tax' | 'shipping' | 'discount';
    readonly parent?: string;
}

export interface Order {
    readonly id: string;
    readonly amount: number;
    readonly items: OrderItem[];
}

export interface SycStoreStateShape {
    isFetching: boolean;
    fetchSuccess: boolean;
    items: StoreItem[];
}

export interface CartStateShape {
    cartError: boolean;
    items: string[];
}
