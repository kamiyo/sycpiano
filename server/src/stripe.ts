import * as dotenv from 'dotenv';
import * as Stripe from 'stripe';

dotenv.config();

class StripeClient {
    private static stripe: Stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    private static currency: string = 'USD';

    async fetchSkus(skuIds?: string[]): Promise<Stripe.skus.ISku[]> {
        return new Promise((resolve, reject) => StripeClient.stripe.skus.list(
            (skuIds ? { ids: skuIds } : {}),
            { expand: ['data.product'] },
            (err, skus) => err ? reject(err) : resolve(skus.data),
        ));
    }

    async createOrder(skuIds: string[]): Promise<Stripe.orders.IOrder> {
        return new Promise((resolve, reject) => StripeClient.stripe.orders.create(
            {
                currency: StripeClient.currency,
                items: skuIds.map((skuId) => ({ parent: skuId })),
            },
            {},
            (err, order) => err ? reject(err) : resolve(order),
        ));
    }

    async payOrder(orderId: string, tokenId: string, email: string): Promise<Stripe.orders.IOrder> {
        return new Promise((resolve, reject) => StripeClient.stripe.orders.pay(
            orderId,
            { source: tokenId, email },
            {},
            (err, order) => err ? reject(err) : resolve(order),
        ));
    }

    // async createCharge(amount: number, description: string, tokenId: string) {
    //     return new Promise((resolve, reject) => StripeClient.stripe.charges.create(
    //         {
    //             amount,
    //             currency: StripeClient.currency,
    //             description,
    //             source: tokenId,
    //         },
    //         {},
    //         (err, charge) => err ? reject(err) : resolve(charge),
    //     ));
    // }
}

export const stripeClient = new StripeClient();
