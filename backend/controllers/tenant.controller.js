// // controllers/tenantController.js
// import { knex } from '../db/knex.js';
// import { createTenantSchema } from '../db/tenantSchema.js';
// import { v4 as uuidv4 } from 'uuid';

// export async function createTenant(req, res) {
//   const { company_name, industry_type, plan_id } = req.body;

//   if (!company_name) return res.status(400).json({ message: 'Company name is required' });

//   try {
//     // Generate unique schema name
//     const schema_name = company_name.toLowerCase().replace(/\s+/g, '_') + '_' + Date.now();

//     // Insert into master.tenants
//     const [tenant] = await knex('master.tenants')
//       .insert({
//         id: uuidv4(),
//         company_name,
//         industry_type,
//         plan_id,
//         schema_name,
//         status: 'active',
//       })
//       .returning('*');

//     // Create tenant schema and core tables
//     await createTenantSchema(schema_name);

//     res.status(201).json({ message: 'Tenant created', tenant });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Failed to create tenant', error: err.message });
//   }
// }

import { v4 as uuidv4 } from "uuid";
import { knex } from "../db/knex.js";
import { createTenantSchema } from "../db/tenantSchema.js";
import bcrypt from "bcrypt";

export const createTenant = async (req, res) => {
  try {
    const { company_name, company_email, industry_type } = req.body;

    if (!company_name || !company_email)
      return res.status(400).json({ message: "company_name & company_email required" });

    // Generate tenant ID
    const tenantId = uuidv4();
    const schemaName = `tenant_${tenantId.replace(/-/g, "")}`;

    // Create admin password (temporary)
    const password = "Admin@123"; // you should email/change this later
    const hashedPassword = await bcrypt.hash(password, 10);

    //-------------------------------------------
    // Insert Tenant into MASTER DB
    //-------------------------------------------
    await knex("master.tenants").insert({
      id: tenantId,
      company_name,
      company_email,
      industry_type,
      schema_name: schemaName,
    });

    //-------------------------------------------
    // Create tenant schema + core tables
    //-------------------------------------------
    await createTenantSchema(tenantId);

    //-------------------------------------------
    // Insert Tenant Admin into tenant schema
    //-------------------------------------------
    await knex(`${schemaName}.users`).insert({
      id: uuidv4(),
      name: "Tenant Admin",
      email: company_email,
      password: hashedPassword,
      role: "tenant_admin",
      is_active: true,
    });

    return res.json({
      message: "Tenant created successfully",
      tenant_id: tenantId,
      schema: schemaName,
      temp_password: password,
    });
  } catch (err) {
    console.error("Tenant Creation Error:", err);
    return res.status(500).json({ message: "Tenant creation failed", error: err.message });
  }
};
