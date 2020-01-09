import * as bodyParser from 'body-parser';
import { Router } from 'express';

import acclaimsHandler from './apis/acclaims';
import bioHandler from './apis/bio';
import calendarRouter from './apis/calendar';
import discHandler from './apis/disc';
import musicHandler from './apis/music';
import photosHandler from './apis/photos';
import shopHandler from './apis/shop';

const apiRouter = Router();
// Since webhooks need to use raw body, don't use bodyParser before
apiRouter.use('/shop', shopHandler);

apiRouter.use(bodyParser.json());
apiRouter.get('/bio', bioHandler);
apiRouter.get('/acclaims', acclaimsHandler);
apiRouter.use(/\/calendar/, calendarRouter);
apiRouter.get('/music', musicHandler);
apiRouter.get('/photos', photosHandler);
apiRouter.get('/discs', discHandler);

export const ApiRouter = apiRouter;
