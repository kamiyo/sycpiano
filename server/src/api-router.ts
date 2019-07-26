import { Router } from 'express';

import acclaimsHandler from './apis/acclaims';
import bioHandler from './apis/bio';
import calendarRouter from './apis/calendar';
import discHandler from './apis/disc';
import musicHandler from './apis/music';
import photosHandler from './apis/photos';
import { stripeClient } from './stripe';

const apiRouter = Router();

apiRouter.get('/bio', bioHandler);
apiRouter.get('/acclaims', acclaimsHandler);
apiRouter.use(/\/calendar/, calendarRouter);
apiRouter.get('/music', musicHandler);
apiRouter.get('/photos', photosHandler);
apiRouter.get('/discs', discHandler);

apiRouter.get('/storeItems', async (_, res) => {
    const storeItems = await stripeClient.fetchStoreItems();
    res.json(storeItems);
});

apiRouter.get('/order/:id?', async (req, res) => {
    try {
        const order = await stripeClient.fetchOrder(req.params.id);
        res.json(order);
    } catch (err) {
        res.json({});
    }
});

// apiRouter.put('/order/:id', async (req, res) => {
//     const id = req.params.id;
//     const sku = req.query.sku;
// })

export const ApiRouter = apiRouter;
