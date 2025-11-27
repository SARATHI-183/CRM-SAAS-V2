// routes/tenants.js
import express from 'express';
import { createTenant } from '../controllers/tenant.controller.js';

const router = express.Router();

router.post('/', createTenant);

export default router;
