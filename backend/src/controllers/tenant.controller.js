import { v4 as uuidv4 } from "uuid";
import { knex } from "../db/knex.js";
import { createTenantSchema } from "../db/tenantSchema.js";
import bcrypt from "bcrypt";

export const createTenant = async (req, res) => {
  const trx = await knex.transaction();
  try {
    const { company_name, company_email, industry_type } = req.body;
    if (!company_name || !company_email)
      return res.status(400).json({ message: "company_name & company_email required" });

    const tenantId = uuidv4();
    const schemaName = `tenant_${tenantId.replace(/-/g, "")}`;
    const password = "Admin@123";
    const hashedPassword = await bcrypt.hash(password, 10);

    // 1️⃣ Insert tenant into master.tenants
    await trx("master.tenants").insert({
      id: tenantId,
      company_name,
      company_email,
      industry_type,
      schema_name: schemaName,
    });

    // 2️⃣ Create schema + tables using the same trx
    await createTenantSchema(schemaName, trx);

    // 3️⃣ Insert Tenant Admin
    await trx.raw(
      `INSERT INTO "${schemaName}"."users" (id, name, email, password, role, is_active)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [uuidv4(), "Tenant Admin", company_email, hashedPassword, "tenant_admin", true]
    );

    // 4️⃣ Commit everything
    await trx.commit();

    return res.json({
      message: "Tenant created successfully",
      tenant_id: tenantId,
      schema: schemaName,
      temp_password: password,
    });
  } catch (err) {
    await trx.rollback();
    console.error("Tenant Creation Error:", err);
    return res.status(500).json({ message: "Tenant creation failed", error: err.message });
  }
};


export const getAllTenants = async (req, res) => {
  try {
    const tenants = await knex("master.tenants").select(
      "id",
      "company_name",
      "company_email",
      "industry_type",
      "plan_id",
      "schema_name",
      "status",
      "created_at",
      "updated_at"
    );

    return res.json({ data: tenants });
  } catch (err) {
    console.error("Error fetching tenants:", err);
    return res.status(500).json({
      message: "Failed to fetch tenants",
      error: err.message,
    });
  }
};