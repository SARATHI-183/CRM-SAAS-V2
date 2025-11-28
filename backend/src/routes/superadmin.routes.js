import express from 'express';
import { superadminLogin } from '../controllers/superadmin.controller.js';
import { requireSuperAdmin } from '../middlewares/requireSuperAdmin.js';
import { createTenant, getAllTenants } from '../controllers/tenant.controller.js';

const router = express.Router();

// PUBLIC route → superadmin login
router.post('/login', superadminLogin);

// PROTECTED routes → only superadmin can create tenants
router.post('/tenants', requireSuperAdmin, createTenant);

router.get('/tenants', requireSuperAdmin, getAllTenants)

export default router;
