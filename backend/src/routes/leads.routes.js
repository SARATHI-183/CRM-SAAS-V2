// src/routes/leads.routes.js
import express from "express";
import { getLeads, createLead } from "../controllers/leads.controller.js";
import requireTenant from "../middlewares/requireTenant.js";

const router = express.Router();

// Apply tenant middleware to all routes
router.use(requireTenant);

// GET /api/v1/leads → list leads for current tenant
router.get("/", getLeads);

// POST /api/v1/leads → create a lead for current tenant
router.post("/", createLead);

export default router;
