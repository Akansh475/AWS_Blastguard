import { Router } from 'express';
import { healthRouter } from './healthRoutes';
import { requestRouter } from './requestRoutes';

export const apiRouter = Router();

apiRouter.use(healthRouter);
apiRouter.use(requestRouter);
