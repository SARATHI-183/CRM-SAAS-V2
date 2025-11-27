// app.js
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { knex } from './db/knex.js'; // we'll create this file

import tenantRoutes from './routes/tenants.routes.js';

dotenv.config();

const app = express();

// ----------------------
// MIDDLEWARE
// ----------------------
app.use(cors());
app.use(helmet());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// ----------------------
// HEALTH CHECK
// ----------------------
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', environment: process.env.NODE_ENV || 'development' });
});

// ----------------------
// PLACEHOLDER ROUTES
// ----------------------
app.use('/api/tenants', tenantRoutes);

app.get('/api/superadmin', (req, res) => {
  res.json({ message: 'Super Admin API working!' });
});

export default app;
