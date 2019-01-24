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
    console.log('BEFORE REQUEST TO STRIPE');
    const skus = await stripeClient.fetchSkus();
    console.log('AFTER REQUEST TO STRIPE');
    const storeItems = skus.map(convertSkuToStoreItem);
    res.json(storeItems);
});

export default storeRouter;
