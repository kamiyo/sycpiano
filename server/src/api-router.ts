import { Router } from 'express';

import acclaimsHandler from './apis/acclaims';
import bioHandler from './apis/bio';
import calendarRouter from './apis/calendar';
import discHandler from './apis/disc';
import musicHandler from './apis/music';
import photosHandler from './apis/photos';

const apiRouter = Router();

apiRouter.get('/bio', bioHandler);
apiRouter.get('/acclaims', acclaimsHandler);
apiRouter.use(/\/calendar/, calendarRouter);
apiRouter.get('/music', musicHandler);
apiRouter.get('/photos', photosHandler);
apiRouter.get('/discs', discHandler);

export const ApiRouter = apiRouter;
