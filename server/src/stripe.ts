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

    async createCheckoutSession(lineItems: Stripe.checkouts.sessions.ICheckoutLineItems[], customerId: string) {
        try {
            const session = await StripeClient.stripe.checkout.sessions.create(
                {
                    /* eslint-disable @typescript-eslint/camelcase */
                    success_url: 'https://www.seanchenpiano.com/shop/checkout/success?session_id={CHECKOUT_SESSION_ID}',
                    cancel_url: 'https://www.seanchenpiano.com/shop',
                    payment_method_types: ['card'],
                    line_items: lineItems,
                    customer: customerId,
                    /* eslint-enable @typescript-eslint/camelcase */
                }
            );
            return session.id;
        } catch (e) {
            console.error('Checkout session creation failed.', e);
        }
    }
}

export const stripeClient = new StripeClient();
