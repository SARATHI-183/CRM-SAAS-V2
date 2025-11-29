// /services/tenantService.js
import { knex } from "../db/knex.js";
import { createTenantSchema, createDefaultModules } from "../db/tenantSchema.js";
import bcrypt from "bcrypt";

/**
 * Create a user inside a tenant schema
 */
export async function createUser({ schema, name, email, password, role = "employee" }, trx) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const [user] = await (trx || knex)(`${schema}.users`)
    .insert({
      name,
      email,
      password: hashedPassword,
      role,
      is_active: true,
    })
    .returning("*");
  return user;
}

/**
 * Create a full tenant: schema + default modules + admin user
 * @param {Object} params
 * @param {string} params.schemaName
 * @param {string} params.industryType
 * @param {Object} params.admin {name,email,password}
 */
export async function createTenant({ schemaName, industryType, admin }) {
    if (!admin?.name || !admin?.email || !admin?.password) {
    throw new Error("Admin user details required");
    }
  return knex.transaction(async (trx) => {
    // 1️⃣ Create schema and all tables
    await createTenantSchema(schemaName, industryType, trx);

    // 2️⃣ Add default modules
    await createDefaultModules(schemaName, trx);

    // 3️⃣ Create tenant admin user
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

    return { schemaName, adminUser };
  });
}
