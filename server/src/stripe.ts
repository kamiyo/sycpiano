import * as dotenv from 'dotenv';
import * as Stripe from 'stripe';

<<<<<<< HEAD
import { StoreItem, Order, OrderItem } from 'types';

=======
>>>>>>> origin/add_store_checkout
dotenv.config();

class StripeClient {
    private static stripe: Stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    private static currency: string = 'USD';

<<<<<<< HEAD
    convertIProductToStoreItem(isku: Stripe.skus.ISku): StoreItem {
        const { created, id, updated, image, product, price } = isku;
        const { caption, description, name } = product as Stripe.products.IProduct;
        return { caption, created, description, id, image, name, updated, price };
    }

    convertIOrderItemToOrderItem(iorderItem: Stripe.orders.IOrderItem): OrderItem {
        const { amount, parent, quantity, type } = iorderItem;
        return { amount, parent: parent as string, quantity, type };
    }

    convertIOrderToOrder(iorder: Stripe.orders.IOrder): Order {
        const { id, amount, items } = iorder;
        return { id, amount, items: items.map(this.convertIOrderItemToOrderItem) };
    }

    fetchStoreItems = async (): Promise<StoreItem[]> => {
        return new Promise((resolve, reject) => StripeClient.stripe.skus.list(
            { expand: ['data.product'] },
            (err, products) => {
                if (err) {
                    reject(err);
                } else {
                    const storeItems = products.data.map(this.convertIProductToStoreItem);
                    resolve(storeItems);
                }
            },
        ));
    };

    createOrder = async (): Promise<Order> => {
        return new Promise((resolve, reject) => StripeClient.stripe.orders.create(
            { currency: 'usd' },
            {},
            (err, orderResponse) => {
                if (err) {
                    reject(err);
                } else {
                    const order = this.convertIOrderToOrder(orderResponse);
                    resolve(order);
                }
            })
        );
    }


    fetchOrder = async (orderId: string): Promise<Order> => {
        console.log(orderId);
        if (orderId) {
            return new Promise((resolve, reject) => StripeClient.stripe.orders.retrieve(
                orderId,
                {},
                (err, orderResponse) => {
                    if (err) {
                        reject(err);
                    } else {
                        const order = this.convertIOrderToOrder(orderResponse);
                        resolve(order);
                    }
                }
            ));

        } else {
            return this.createOrder();
        }
=======
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
>>>>>>> origin/add_store_checkout
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
