import * as dotenv from 'dotenv';
import * as Stripe from 'stripe';

import { StoreItem } from 'types';

dotenv.config();

class StripeClient {
    private static stripe: Stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    convertIProductToStoreItem(iproduct: Stripe.products.IProduct): StoreItem {
        const { caption, created, description, id, images, name, updated } = iproduct;
        return { caption, created, description, id, images, name, updated };
    }

    async fetchStoreItems(): Promise<StoreItem[]> {
        return new Promise((resolve, reject) => StripeClient.stripe.products.list(
            {},
            (err, products) => {
                if (err) {
                    reject(err);
                } else {
                    const storeItems = products.data.map(this.convertIProductToStoreItem);
                    resolve(storeItems);
                }
            }));
    }
}

export const stripeClient = new StripeClient();
