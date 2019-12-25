import * as Promise from 'bluebird';
import * as dotenv from 'dotenv';
import * as Stripe from 'stripe';

dotenv.config();

class StripeClient {
    private static stripe: Stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    private static currency = 'USD';

    async fetchSkus(skuIds?: string[]) {
        try {
            const options = skuIds ? { ids: skuIds, expand: ['data.product'] } : { expand: ['data.product'] };
            const result = await StripeClient.stripe.skus.list(
                options
            );
            return result.data;
        } catch (e) {
            console.error(e);
        }
    }

    async getOrCreateCustomer(email: string) {
        try {
            const customers = await StripeClient.stripe.customers.list(
                { email }
            );
            if (customers.data.length === 0) {
                const customer = await StripeClient.stripe.customers.create(
                    { email }
                );
                return customer;
            } else {
                return customers.data[0];
            }
        } catch (e) {
            console.error("Stripe create/get customer failed.", e)
        }
    }

    async createCheckoutSession(skus: string[], customerId: string) {
        try {
            const lineItems: Stripe.checkouts.sessions.ICheckoutLineItems[] = (await this.fetchSkus(skus)).map((sku) => {
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
            const session = await StripeClient.stripe.checkout.sessions.create(
                {
                    /* eslint-disable @typescript-eslint/camelcase */
                    success_url: 'https://www.seanchenpiano.com/shop/checkout/success?session_id={CHECKOUT_SESSION_ID}',
                    cancel_url: 'https://www.seanchenpiano.com/shop',
                    payment_method_types: ['card'],
                    line_items: lineItems,
                    customer: customerId,
                    payment_intent_data: {
                        metadata: skus.reduce((acc, sku, idx) => ({
                            ...acc,
                            [idx]: sku,
                        }), {}),
                    }
                    /* eslint-enable @typescript-eslint/camelcase */
                }
            );
            return session.id;
        } catch (e) {
            console.error('Checkout session creation failed.', e);
        }
    }

    async getAllSkusPurchasedByCustomer(email: string) {
        try {
            const { data: customers }: { data: Stripe.customers.ICustomer[] } = await StripeClient.stripe.customers.list(
                {
                    email,
                    expand: ['data.sources'],
                },
            );

            const skus: string[] = await Promise.reduce(customers, async (acc, cust) => {
                const payments = await StripeClient.stripe.paymentIntents.list({
                    customer: cust.id,
                });
                const succeededPayments = payments.data.filter(pi => pi.status === 'succeeded');
                const metametadata = succeededPayments.reduce((accc: string[], pi: Stripe.paymentIntents.IPaymentIntent) => {
                    const metadata = Object.keys(pi.metadata).map(k => pi.metadata[k]);
                    return [...metadata, ...accc];
                }, []);
                return [...metametadata, ...acc];
            }, []);

            // const skus: string[] = customers.reduce((acc, cust) => {
            //     const metadata = cust.sources.data.reduce((aacc, source) => {
            //         const metadatum = Object.keys(source.metadata).map((k) => source.metadata[k]);
            //         return metadatum.concat(aacc);
            //     }, []);
            //     return metadata.concat(acc);
            // }, []);
            console.log(skus);
            return skus;
        } catch (e) {
            console.error(`Couldn't get customers from email.`, e)
        }
    }
}

export const stripeClient = new StripeClient();
