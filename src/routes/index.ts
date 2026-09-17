import { Router } from 'express';
import { healthRouter } from './healthRoutes';
import { requestRouter } from './requestRoutes';
import { resourceRouter } from './resourceRoutes';

export const apiRouter = Router();

apiRouter.use(healthRouter);
apiRouter.use(requestRouter);
apiRouter.use(resourceRouter);
