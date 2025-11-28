// routes/tenants.js
import express from 'express';
import { createTenant, getAllTenants } from '../controllers/tenant.controller.js';

const router = express.Router();

router.post('/', createTenant);

router.get('/', getAllTenants);

export default router;
