// src/routes/auth.routes.js
import express from 'express';
import tenantResolver from '../middlewares/tenantResolver.js';
import requireTenant from '../middlewares/requireTenant.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { login, me } from '../controllers/auth.controller.js';

const router = express.Router();

// POST /api/v1/auth/login  -> tenantResolver required to pick the correct tenant DB
router.post('/login', tenantResolver(), login);

// GET /api/v1/auth/me -> tenantResolver + requireTenant + auth middleware
router.get('/me', tenantResolver(), authMiddleware, me);

export default router;
