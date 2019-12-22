
import * as express from 'express';
import * as Stripe from 'stripe';

import { ShopItem } from 'types';
import { stripeClient } from '../stripe';

const shopRouter = express.Router();

const convertSkuToShopItem = (sku: Stripe.skus.ISku): ShopItem => {
    const product = sku.product as Stripe.products.IProduct;
    const { caption, created, description, images, name, updated, metadata } = product;
    return {
        caption,
        created,
        description,
        image: images[0],
        name,
        updated,
        id: sku.id,
        price: sku.price,
        format: metadata.format,
        pages: parseInt(metadata.pages),
    };
};

shopRouter.get('/items', async (_, res) => {
    const skus = await stripeClient.fetchSkus();
    const storeItems = skus.map(convertSkuToShopItem);
    res.json(storeItems);
});

shopRouter.post('/checkout', async (req, res) => {
    const {
        email,
        skus,
    }: {
        email: string;
        skus: string[];
    } = req.body;

    try {
        const customer = await stripeClient.getOrCreateCustomer(email);
        const lineItems: Stripe.checkouts.sessions.ICheckoutLineItems[] = (await stripeClient.fetchSkus(skus)).map((sku) => {
            const product = sku.product as Stripe.products.IProduct;
            return {
                amount: sku.price,
                currency: 'USD',
                name: product.name,
                quantity: 1,
                description: product.description,
                images: product.images,
            };
        });
        const sessionId = await stripeClient.createCheckoutSession(
            lineItems,
            customer.id,
        );
        res.json({
            sessionId
        });
    } catch (e) {
        console.error("Checkout error", e);
    }
});

export default shopRouter;
