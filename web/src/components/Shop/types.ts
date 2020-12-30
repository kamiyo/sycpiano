export interface Product {
    readonly id: string;
    readonly name: string;
    readonly description: string;
    readonly images: string[];
    readonly price: number;
    readonly sample: string;
    readonly format: string;
    readonly pages: number;
    readonly permalink: string;
}

export interface ShopStateShape {
    isFetching: boolean;
    fetchSuccess: boolean;
    items: Product[];
}
