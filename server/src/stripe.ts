import * as dotenv from 'dotenv';
import Stripe from 'stripe';
import * as uniqid from 'uniqid';
import { ProductAttributes } from 'models/product';

dotenv.config();

type CustomerReturn = Stripe.Customer | Stripe.DeletedCustomer;

const CURRENCY = 'USD';

const stripe: Stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2020-08-27' });

const stripeCustomerActive = (cr: CustomerReturn): cr is Stripe.Customer => {
    return cr.deleted !== true;
};

export const getCustomer = async (email: string) => {
    try {
        return (await stripe.customers.list({ email })).data[0];
    } catch (e) {
        console.error(e);
    }
};

export const getOrCreateCustomer = async (email: string) => {
    try {
        const customers = await stripe.customers.list(
            { email }
        );
        if (customers.data.length === 0) {
            const customer = await stripe.customers.create(
                { email }
            );
            return customer;
        } else {
            return customers.data[0];
        }
    } catch (e) {
        console.error("Stripe create/get customer failed.", e);
    }
};

export const createCheckoutSession = async (productIDs: string[], priceIDs: string[], customerId: string) => {
    try {
        const session = await stripe.checkout.sessions.create(
            {
                /* eslint-disable @typescript-eslint/camelcase */
                success_url: 'https://www.seanchenpiano.com/shop/checkout/success?session_id={CHECKOUT_SESSION_ID}',
                cancel_url: 'https://www.seanchenpiano.com/shop',
                payment_method_types: ['card'],
                line_items: priceIDs.map((id) => ({ price: id, quantity: 1 })),
                customer: customerId,
                payment_intent_data: {
                    metadata: productIDs.reduce((acc, pID, idx) => ({
                        ...acc,
                        [idx]: pID,
                    }), {}),
                },
                client_reference_id: uniqid.time(),
                /* eslint-enable @typescript-eslint/camelcase */
            }
        );
        return session.id;
    } catch (e) {
        console.error('Checkout session creation failed.', e);
    }
}

export const getProductIDsFromPaymentIntent = async (paymentIntent: string) => {
    try {
        const intent = await stripe.paymentIntents.retrieve(paymentIntent);
        const metadata = Object.values(intent.metadata);
        return metadata;
    } catch (e) {
        console.error(`Couldn't get skus from paymentIntent.`, e);
    }
};

export const getEmailFromCustomer = async (cid: string) => {
    try {
        const customer = await stripe.customers.retrieve(cid);
        if (stripeCustomerActive(customer)) {
            return customer.email;
        }
    } catch (e) {
        console.error(`Couldn't get email from customer.`, e);
    }
};

export const constructEvent = (body: any, sig: string | string[]) => {
    const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_KEY);
    return event;
};

export const createProduct = async (attributes: Omit<ProductAttributes, 'createdAt' | 'updatedAt' | 'id'>) => {
    try {
        const product = await stripe.products.create({
            name: attributes.name,
            description: attributes.description,
            metadata: {
                format: 'pdf',
                pages: attributes.pages,
                sample: attributes.sample,
            },
            images: attributes.images,
        });
        const price = await stripe.prices.create({
            currency: CURRENCY,
            unit_amount: attributes.price, /* eslint-disable-line @typescript-eslint/camelcase */
            product: product.id,
        });
        return [product.id, price.id];
    } catch (e) {
        console.error(`Couldn't create product.`, e);
    }
};

export const updateProduct = async (attributes: Omit<ProductAttributes, 'createdAt' | 'updatedAt'>) => {
    try {
        const product = await stripe.products.update(
            attributes.id,
            {
                name: attributes.name,
                description: attributes.description,
                metadata: {
                    format: 'pdf',
                    pages: attributes.pages,
                    sample: attributes.sample,
                },
                images: attributes.images,
            }
        );
        const oldPrice = await stripe.prices.retrieve(attributes.priceID);
        if (attributes.price !== oldPrice.unit_amount) {
            await stripe.prices.update(attributes.priceID, { active: false });
            const newPrice = await stripe.prices.create({
                currency: CURRENCY,
                unit_amount: attributes.price, /* eslint-disable-line @typescript-eslint/camelcase */
                product: product.id,
            });
            return [product.id, newPrice.id];
        }
        return [product.id, attributes.priceID];
    } catch (e) {
        console.error(`Couldn't update product.`, e);
    }
};
