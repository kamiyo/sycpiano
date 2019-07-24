import * as dotenv from 'dotenv';
import * as Stripe from 'stripe';

import { StoreItem, Order, OrderItem } from 'types';

dotenv.config();

class StripeClient {
    private static stripe: Stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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

    async fetchStoreItems(): Promise<StoreItem[]> {
        return new Promise((resolve, reject) => StripeClient.stripe.skus.list(
            { expand: ['data.product'] },
            (err, products) => {
                if (err) {
                    reject(err);
                } else {
                    const storeItems = products.data.map(this.convertIProductToStoreItem);
                    resolve(storeItems);
                }
            })
        );
    }

    async fetchOrder(orderId: string): Promise<Order> {
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
                }
            ));
        }
    }
}

export const stripeClient = new StripeClient();
