import { Router } from 'express';

import transactionsRouter from './transactions.routes';
import usersRouter from './users.routes';
import sessionsRouter from './sessions.routes';
import companiesRouter from './company.routes';

const routes = Router();

routes.use('/transactions', transactionsRouter);
routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/companies', companiesRouter);

export default routes;
