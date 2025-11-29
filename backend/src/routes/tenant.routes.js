// /routes/tenantRoutes.js
import express from "express";
import { createTenant } from "../services/tenant.service.js";

const router = express.Router();

/**
 * POST /api/tenants
 * Body: { companyName, industryType, admin: {name,email,password} }
 */
router.post("/", async (req, res) => {
  const { companyName, industryType, admin } = req.body;

  if (!companyName || !industryType || !admin?.name || !admin?.email || !admin?.password) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const schemaName = companyName.toLowerCase().replace(/\s+/g, "_");

  try {
    const result = await createTenant({
      schemaName,
      industryType,
      admin,
    });
    res.status(201).json({
      message: "Tenant created successfully",
      tenant: result.schemaName,
      adminUser: result.adminUser,
    });
  } catch (err) {
    console.error("Tenant creation error:", err);
    res.status(500).json({ message: "Failed to create tenant", error: err.message });
  }
});

export default router;
