
import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as Stripe from 'stripe';

import { ShopItem } from 'types';
import { stripeClient } from '../stripe';
import { mailPDFs } from '../mailer';

const shopRouter = express.Router();

// add webhook first because it needs raw body
shopRouter.post('/webhook', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];

    let event;
    console.log(req.body, sig);

    try {
        event = stripeClient.constructEvent(req.body, sig);
    } catch (e) {
        console.error(e);
        return res.status(400).send(`Webhook Error: ${e.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.checkouts.sessions.ICheckoutSession;
        try {
            console.log(session);
            const skus = await stripeClient.getSkusFromPaymentIntent(session.payment_intent as string);
            const email = await stripeClient.getEmailFromCustomer(session.customer as string);
            await mailPDFs(skus, email, session.client_reference_id);
        } catch (e) {
            console.error('Failed to send email: ', e);
        }
    }

    res.json({ received: true });
})

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

shopRouter.use(bodyParser.json());

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

        const previouslyPurchased = await stripeClient.getAllSkusPurchasedByCustomer(email);

        const duplicates = skus.reduce((acc, sku) => {
            if (previouslyPurchased.includes(sku)) {
                return [sku, ...acc];
            } else {
                return acc;
            }
        }, []);

        if (duplicates.length !== 0) {
            res.status(422).json({
                skus: duplicates,
            });
            return;
        }

        const sessionId = await stripeClient.createCheckoutSession(
            skus,
            customer.id,
        );
        res.json({
            sessionId
        });
    } catch (e) {
        console.error('Checkout error', e);
    }
});

shopRouter.post('/getPurchased', async (req, res) => {
    const {
        email
    } = req.body;

    try {
        const skus = await stripeClient.getAllSkusPurchasedByCustomer(email);
        res.json({
            skus,
        });
    } catch (e) {
        console.error(`Failed to get skus of customer with email: ${email}`, e);
    }

});

export default shopRouter;
