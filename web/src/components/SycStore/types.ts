export interface StoreItem {
    readonly caption: string;
    readonly created: number;
    readonly description: string;
    readonly id: string;
    readonly images: string[];
    readonly name: string;
    readonly updated: number;
}

export interface SycStoreStateShape {
    isFetching: boolean;
    fetchSuccess: boolean;
    items: StoreItem[];
}
