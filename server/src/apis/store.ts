import * as express from 'express';
import * as Stripe from 'stripe';

import { ShopItem } from 'types';
import { stripeClient } from '../stripe';

const storeRouter = express.Router();

const convertSkuToStoreItem = (sku: Stripe.skus.ISku): ShopItem => {
    const product = sku.product as Stripe.products.IProduct;
    const { caption, created, description, images, name, updated } = product;
    return {
        caption,
        created,
        description,
        image: images[0],
        name,
        updated,
        productId: product.id,
        skuId: sku.id,
        price: sku.price,
    };
};

storeRouter.get('/items', async (_, res) => {
    const skus = await stripeClient.fetchSkus();
    const storeItems = skus.map(convertSkuToStoreItem);
    res.json(storeItems);
});

storeRouter.post('/checkout', async (req, res) => {
    const { skuIds, tokenId, email } = req.body;
    const skus = await stripeClient.fetchSkus(skuIds);

    let order = await stripeClient.createOrder(skus.map((sku) => sku.id));
    order = await stripeClient.payOrder(order.id, tokenId, email);
    res.json({  })
});

export default storeRouter;
