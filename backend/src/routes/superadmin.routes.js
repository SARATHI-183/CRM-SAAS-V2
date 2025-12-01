import express from 'express';
import { superadminLogin } from '../controllers/superadmin.controller.js';
import { requireSuperAdmin } from '../middlewares/requireSuperAdmin.js';
import { createTenant, getAllTenants, updateTenant, softDeleteTenant, hardDeleteTenant } from '../controllers/tenant.controller.js';

const router = express.Router();

// PUBLIC route → superadmin login
router.post('/login', superadminLogin);

// PROTECTED routes → only superadmin can create tenants
router.post('/tenants', requireSuperAdmin, createTenant);

router.get('/tenants', requireSuperAdmin, getAllTenants)

router.put('/tenants/:tenantId', requireSuperAdmin, updateTenant);

router.delete("/tenants/:tenantId", requireSuperAdmin, softDeleteTenant);

//optional only if we need to delete tenant permanently
router.delete("/tenants/:tenantId/hard", requireSuperAdmin, hardDeleteTenant);

export default router;
