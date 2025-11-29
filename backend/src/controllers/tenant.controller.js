import { v4 as uuidv4 } from "uuid";
import { knex } from "../db/knex.js";
import { createTenantSchema, createDefaultModules } from "../db/tenantSchema.js";
import { createUser } from "../services/tenant.service.js";
import bcrypt from "bcrypt";

export const createTenant = async (req, res) => {
  const trx = await knex.transaction();
  try {
    const { company_name, company_email, industry_type, admin } = req.body;
    if (!company_name || !company_email || !admin?.name || !admin?.email || !admin?.password)
      return res.status(400).json({ message: "Missing required fields" });

    const tenantId = uuidv4();
    const schemaName = `tenant_${tenantId.replace(/-/g, "")}`;

    // 1️⃣ Insert tenant into master.tenants
    await trx("master.tenants").insert({
      id: tenantId,
      company_name,
      company_email,
      industry_type,
      schema_name: schemaName,
    });

    // 2️⃣ Create schema + tables
    await createTenantSchema(schemaName, industry_type, trx);

    // 3️⃣ Create default modules
    await createDefaultModules(schemaName, trx);

    // 4️⃣ Create Tenant Admin user
    const adminUser = await createUser(
      {
        schema: schemaName,
        name: admin.name,
        email: admin.email,
        password: admin.password,
        role: "tenant_admin",
      },
      trx
    );

    // 5️⃣ Commit transaction
    await trx.commit();

    return res.status(201).json({
      message: "Tenant created successfully",
      tenant_id: tenantId,
      schema: schemaName,
      adminUser: { id: adminUser.id, email: adminUser.email },
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
    return res.status(500).json({ message: "Failed to fetch tenants", error: err.message });
  }
};
