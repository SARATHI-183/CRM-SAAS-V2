// src/utils/tenantHelper.js
import { knex } from "../db/knex.js";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { createTenantSchema } from "../migrations/tenantschema.js";
import { auditLog } from "./auditLogger.js";

/**
 * Creates a new tenant schema + default admin user + tenant_admin role + permissions
 * @param {string} schemaName - Name of the tenant schema
 * @param {string} industryType - Industry type for optional modules (healthcare, real_estate)
 * @param {object} adminData - { name, email, password } for default admin
 * @param {object} req - Express request object (optional, for audit logs)
 */
export async function createTenantWithAdmin(schemaName, industryType, adminData, req = {}) {
  if (!schemaName) throw new Error("schemaName is required");
  if (!adminData?.name || !adminData?.email || !adminData?.password)
    throw new Error("Admin name, email, and password are required");

  // Start transaction
  await knex.transaction(async (trx) => {
    // 1️⃣ Create tenant schema & tables
    await createTenantSchema(schemaName, industryType, trx);

    // 2️⃣ Fetch tenant_admin role ID
    const [tenantAdminRole] = await trx(`${schemaName}.roles`)
      .where({ name: "tenant_admin" })
      .select("*")
      .limit(1);

    if (!tenantAdminRole) throw new Error("tenant_admin role not found in tenant schema");

    // 3️⃣ Hash admin password
    const hashedPassword = await bcrypt.hash(adminData.password, 10);

    const adminUserId = uuidv4();

    // 4️⃣ Create default admin user
    const [adminUser] = await trx(`${schemaName}.users`)
      .insert({
        id: adminUserId,
        name: adminData.name,
        email: adminData.email,
        password: hashedPassword,
        role_id: tenantAdminRole.id,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning("*");

    // 5️⃣ Assign all permissions to admin role
    const permissions = await trx(`${schemaName}.permissions`).select("id");
    const rolePermissions = permissions.map((p) => ({
      id: uuidv4(),
      role_id: tenantAdminRole.id,
      permission_id: p.id,
      created_at: new Date(),
      updated_at: new Date(),
    }));
    if (rolePermissions.length) await trx(`${schemaName}.role_permissions`).insert(rolePermissions);

    // 6️⃣ Audit log (optional)
    if (req && req.user) {
      await auditLog(trx, {
        userId: req.user.id,
        tenantId: schemaName,
        action: "TENANT_CREATED",
        resource: "tenant",
        resourceId: schemaName,
        metadata: {
          admin: adminUser,
          role: tenantAdminRole,
          permissions: rolePermissions.length,
        },
        req,
      });
    }

    return { adminUser, tenantAdminRole, permissionsAssigned: rolePermissions.length };
  });
}
