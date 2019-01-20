import * as express from 'express';
import * as Stripe from 'stripe';

import { StoreItem } from 'types';
import { stripeClient } from '../stripe';

const storeRouter = express.Router();

function convertSkuToStoreItem(sku: Stripe.skus.ISku): StoreItem {
    const product = sku.product as Stripe.products.IProduct;
    const { caption, created, description, images, name, updated } = product;
    return {
        caption,
        created,
        description,
        images,
        name,
        updated,
        productId: product.id,
        skuId: sku.id,
    };
}

storeRouter.get('/items', async (_, res) => {
    const skus = await stripeClient.fetchSkus();
    const storeItems = skus.map(convertSkuToStoreItem);
    res.json(storeItems);
});

export default storeRouter;
