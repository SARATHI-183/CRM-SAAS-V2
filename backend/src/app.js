// app.js
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import dotenv from 'dotenv';

import tenantResolver from './middlewares/tenantResolver.js';
import requireTenant from './middlewares/requireTenant.js';
import { knex } from './db/knex.js'; // we'll create this file


import usersRoutes from './routes/users.routes.js';
import authRoutes from './routes/auth.routes.js';
import superadminRoutes from './routes/superadmin.routes.js';
// import contactsRoutes from './routes/contacts.routes.js';
import leadsRoutes from './routes/leads.routes.js';
import rbacRoutes from "./modules/rbac/rbac.routes.js";
import { authMiddleware } from './middlewares/auth.middleware.js';


dotenv.config();

const app = express();


// MIDDLEWARE
app.use(cors());
app.use(helmet());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Required for subdomain identification
app.set('trust proxy', true);

// This attaches: req.tenant + req.db (tenant schema DB helper)
// app.use(tenantResolver());

// HEALTH CHECK
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    environment: process.env.NODE_ENV || 'development',
    tenantResolved: !!req.tenantResolved
 });
});


// API ROUTE 

// Superadmin
app.use('/api/v1/superadmin', superadminRoutes);



//Tenant Login
app.use("/api/v1/auth", tenantResolver(), requireTenant, authRoutes);



app.use("/api/v1/rbac", authMiddleware,tenantResolver(), requireTenant, rbacRoutes);


app.use("/api/v1/users", tenantResolver(), requireTenant, usersRoutes);
app.use('/api/v1/leads', tenantResolver(), requireTenant, leadsRoutes);


// app.use('/api/v1/contacts', requireTenant(), contactsRoutes);



// For now create safe dummy route:
// app.get('/api/v1/tenant-test', tenantResolver(), requireTenant, (req, res) => {
//   res.json({
//     message: 'Tenant route OK!',
//     tenantId: req.tenant.id,
//     schema: req.tenant.schema_name
//   });
// });


// FALLBACK / 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ERROR HANDLER (Production-safe)
app.use((err, req, res, next) => {
  console.error('GlobalError:', err);

  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV !== 'production'
      ? { stack: err.stack }
      : {}),
  });
});

export default app;
