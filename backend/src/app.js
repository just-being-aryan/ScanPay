import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import orderRoutes from './routes/order.routes.js';
import { notFound, errorHandler } from './middleware/error.middleware.js';
import webhookRoutes from './routes/webhook.routes.js';
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.use("/webhooks", webhookRoutes);
app.use("/orders", orderRoutes);


app.use(notFound);
app.use(errorHandler);

export default app;
