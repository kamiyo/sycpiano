export const ProductTypes = ['arrangement', 'cadenza', 'original'] as const;

export interface Product {
    readonly id: string;
    readonly name: string;
    readonly description: string;
    readonly images: string[];
    readonly price: number;
    readonly sample: string;
    readonly format: string;
    readonly type: typeof ProductTypes[number];
    readonly pages: number;
    readonly permalink: string;
}

export type ProductMap = Partial<Record<typeof ProductTypes[number], Product[]>>

export interface ShopStateShape {
    isFetching: boolean;
    fetchSuccess: boolean;
    items: ProductMap;
}