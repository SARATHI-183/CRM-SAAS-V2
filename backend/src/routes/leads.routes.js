// src/routes/leads.routes.js
import express from "express";
import { getLeads, createLead } from "../controllers/leads.controller.js";
import requireTenant from "../middlewares/requireTenant.js";
import { requireRole } from "../middlewares/requireRole.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

// Apply tenant middleware to all routes
router.use(requireTenant);

// GET /api/v1/leads → list leads for current tenant
router.get("/", requireRole(["tenant_admin", "sales_admin", "sales_rep"]), getLeads);

// POST /api/v1/leads → create a lead for current tenant
router.post("/", requireRole(["tenant_admin", "sales_admin", "sales_rep"]), createLead);

export default router;
