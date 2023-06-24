import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { Request, Response } from 'express';
import { createTicketRouter } from './routes/new';
import { errorHandler, NotFoundError, currentUser } from '@hxtickets/common';
import { showtTicketRouter } from './routes/show';
import { indexTicketRouter } from './routes';
import { updateTicketRouter } from './routes/update';
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
app.use(createTicketRouter);
app.use(showtTicketRouter);
app.use(indexTicketRouter);
app.use(updateTicketRouter);

app.all('*', async(req: Response,res: Request) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };