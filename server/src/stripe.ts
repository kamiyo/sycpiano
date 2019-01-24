import * as dotenv from 'dotenv';
import * as Stripe from 'stripe';

dotenv.config();

class StripeClient {
    private static stripe: Stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    async fetchSkus(): Promise<Stripe.skus.ISku[]> {
        return new Promise((resolve, reject) => StripeClient.stripe.skus.list(
            { expand: ['data.product'] },
            (err, skus) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(skus.data);
                }
            },
        ));
    }

    async createOrder(skuIds: string[]): Promise<Stripe.orders.IOrder> {
        return new Promise((resolve, reject) => StripeClient.stripe.orders.create(
            {
                currency: 'USD',
                items: skuIds.map((skuId) => ({ parent: skuId })),
            },
            {},
            (err, order) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(order);
                }
            },
        ));
    }
}

export const stripeClient = new StripeClient();
