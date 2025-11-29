// src/routes/auth.routes.js
import express from 'express';
import tenantResolver from '../middlewares/tenantResolver.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { login, me, changePassword } from '../controllers/auth.controller.js';

const router = express.Router();

// POST /api/v1/auth/login  -> tenantResolver required to pick the correct tenant DB
router.post('/login', tenantResolver(), login);

// GET /api/v1/auth/me -> tenantResolver + requireTenant + auth middleware
router.get('/me', tenantResolver(), authMiddleware, me);

// PUT /api/v1/auth/change-password
router.put(
  '/change-password',
  tenantResolver(),  // resolve tenant DB
  authMiddleware,    // user must be logged in
  changePassword     // controller
);


export default router;
