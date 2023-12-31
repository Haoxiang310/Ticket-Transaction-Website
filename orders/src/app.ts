import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { Request, Response } from 'express';
import { errorHandler, NotFoundError, currentUser } from '@hxtickets/common';
import { deleteOrderRouter } from './routes/delete';
import { newOrderRouter } from './routes/new';
import { indexOrderRouter } from './routes';
import { showOrderRouter } from './routes/show';

const app = express();
app.set('trust proxy',true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
  })
);
app.use(currentUser);
app.use(deleteOrderRouter);
app.use(indexOrderRouter);
app.use(newOrderRouter);
app.use(showOrderRouter);

app.all('*', async(req: Response,res: Request) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };