// // /services/tenantService.js
// import { knex } from "../db/knex.js";
// import { createTenantSchema, createDefaultModules } from "../db/tenantSchema.js";
// import bcrypt from "bcrypt";

// /**
//  * Create a user inside a tenant schema
//  */
// export async function createUser({ schema, name, email, password, role = "employee" }, trx) {
//   const hashedPassword = await bcrypt.hash(password, 10);
//   const [user] = await (trx || knex)(`${schema}.users`)
//     .insert({
//       name,
//       email,
//       password: hashedPassword,
//       role,
//       is_active: true,
//     })
//     .returning("*");
//   return user;
// }

// /**
//  * Create a full tenant: schema + default modules + admin user
//  * @param {Object} params
//  * @param {string} params.schemaName
//  * @param {string} params.industryType
//  * @param {Object} params.admin {name,email,password}
//  */
// export async function createTenant({ schemaName, industryType, admin }) {
//     if (!admin?.name || !admin?.email || !admin?.password) {
//     throw new Error("Admin user details required");
//     }
//   return knex.transaction(async (trx) => {
//     // 1️⃣ Create schema and all tables
//     await createTenantSchema(schemaName, industryType, trx);

//     // 2️⃣ Add default modules
//     await createDefaultModules(schemaName, trx);

//     // 3️⃣ Create tenant admin user
//     const adminUser = await createUser(
//       {
//         schema: schemaName,
//         name: admin.name,
//         email: admin.email,
//         password: admin.password,
//         role: "tenant_admin",
//       },
//       trx
//     );

//     return { schemaName, adminUser };
//   });
// }



// // /services/tenantService.js
// import { knex } from "../db/knex.js";
// import bcrypt from "bcrypt";
// import { createTenantSchema, dropTenantSchema } from "../db/tenantSchema.js";
// import { auditLog } from "../utils/auditLogger.js";

// /**
//  * Create a user inside tenant schema
//  */
// export async function createTenantUser({ schema, name, email, password, role = "employee" }, trx) {
//   const hashedPassword = await bcrypt.hash(password, 10);
//   const [user] = await (trx || knex)(`${schema}.users`)
//     .insert({ name, email, password: hashedPassword, role, is_active: true })
//     .returning("*");
//   return user;
// }

// /**
//  * Create full tenant with schema, default modules, and admin user
//  */
// export async function createTenant({ company, schemaName, industryType, admin }) {
//   if (!admin?.name || !admin?.email || !admin?.password) {
//     throw new Error("Admin user details required");
//   }

//   return knex.transaction(async (trx) => {
//     // 1️⃣ Create schema & tables
//     await createTenantSchema(schemaName, industryType, trx);

//     // 2️⃣ Create tenant admin user
//     const adminUser = await createTenantUser(
//       { schema: schemaName, ...admin, role: "tenant_admin" },
//       trx
//     );

//     // 3️⃣ Insert tenant record in master.tenants
//     const [tenantRecord] = await trx("master.tenants")
//       .insert({
//         company_name: company.company_name,
//         company_email: company.company_email,
//         company_phone: company.company_phone,
//         company_website: company.company_website,
//         industry_type: industryType,
//         plan_id: company.plan_id || null,
//         status: "active",
//         schema_name: schemaName,
//       })
//       .returning("*");

//     // 4️⃣ Audit log
//     await auditLog(knex, {
//       userId: adminUser.id,
//       tenantId: tenantRecord.id,
//       action: "TENANT_CREATED",
//       resource: "tenant",
//       resourceId: tenantRecord.id,
//       metadata: { tenant: tenantRecord, admin: adminUser },
//     });

//     return { tenant: tenantRecord, adminUser };
//   });
// }

// /**
//  * Delete tenant
//  */
// export async function deleteTenant(schemaName, tenantId) {
//   return knex.transaction(async (trx) => {
//     // Drop schema
//     await dropTenantSchema(schemaName, trx);

//     // Delete from master.tenants
//     await trx("master.tenants").where({ id: tenantId }).del();

//     // Optionally log
//     await auditLog(knex, {
//       userId: null,
//       tenantId,
//       action: "TENANT_DELETED",
//       resource: "tenant",
//       resourceId: tenantId,
//       metadata: { schemaName },
//     });
//   });
// }


// /services/tenantService.js
import { knex } from "../db/knex.js";
import bcrypt from "bcrypt";
import { createTenantSchema, dropTenantSchema } from "../db/tenantSchema.js";
import { auditLog } from "../utils/auditLogger.js";

/**
 * Create a user inside tenant schema and assign role
 */
// export async function createTenantUser({ schema, name, email, password, roleName = "tenant_admin" }, trx) {
//   const transaction = trx || knex;

//   // 1️⃣ Hash password
//   const hashedPassword = await bcrypt.hash(password, 10);

//   // 2️⃣ Insert user into tenant users table
//   const [user] = await transaction(`${schema}.users`)
//     .insert({ name, email, password: hashedPassword, is_active: true })
//     .returning("*");

//   // 3️⃣ Assign role to user via tenant roles table
//   const role = await transaction(`${schema}.roles`)
//     .where({ name: roleName })
//     .first();

//   if (role) {
//     await transaction(`${schema}.user_roles`).insert({
//       user_id: user.id,
//       role_id: role.id
//     });
//   }

//   return user;
// }

export async function createTenantUser(
  { schema, name, email, password, roleName = "tenant_admin" },
  trx
) {
  const transaction = trx || knex;

  // 1️⃣ Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 2️⃣ Insert user into tenant users table
  const [user] = await transaction(`${schema}.users`)
    .insert({ name, email, password: hashedPassword, is_active: true })
    .returning("*");

  // 3️⃣ Lookup role
  const role = await transaction(`${schema}.roles`)
    .where({ name: roleName })
    .first();

  if (!role) {
    throw new Error(`Role '${roleName}' not found in tenant schema '${schema}'`);
  }

  // 4️⃣ Assign role to user
  await transaction(`${schema}.user_roles`).insert({
    user_id: user.id,
    role_id: role.id,
  });

  return user;
}

/**
 * Create full tenant with schema, default modules, and admin user
 */
export async function createTenant({ company, schemaName, industryType, admin }) {
  if (!admin?.name || !admin?.email || !admin?.password) {
    throw new Error("Admin user details required");
  }

  return knex.transaction(async (trx) => {
    // 1️⃣ Create schema & tables
    await createTenantSchema(schemaName, industryType, trx);

    // 2️⃣ Create tenant admin user
    const adminUser = await createTenantUser(
      { schema: schemaName, ...admin, roleName: "tenant_admin" },
      trx
    );

    // 3️⃣ Insert tenant record in master.tenants
    const [tenantRecord] = await trx("master.tenants")
      .insert({
        company_name: company.company_name,
        company_email: company.company_email,
        company_phone: company.company_phone,
        company_website: company.company_website,
        industry_type: industryType,
        plan_id: company.plan_id || null,
        status: "active",
        schema_name: schemaName,
      })
      .returning("*");

    // 4️⃣ Audit log
    await auditLog(knex, {
      userId: adminUser.id,
      tenantId: tenantRecord.id,
      action: "TENANT_CREATED",
      resource: "tenant",
      resourceId: tenantRecord.id,
      metadata: { tenant: tenantRecord, admin: adminUser },
    });

    return { tenant: tenantRecord, adminUser };
  });
}

/**
 * Delete tenant
 */
export async function deleteTenant(schemaName, tenantId) {
  return knex.transaction(async (trx) => {
    // Drop schema
    await dropTenantSchema(schemaName, trx);

    // Delete from master.tenants
    await trx("master.tenants").where({ id: tenantId }).del();

    // Optionally log
    await auditLog(knex, {
      userId: null,
      tenantId,
      action: "TENANT_DELETED",
      resource: "tenant",
      resourceId: tenantId,
      metadata: { schemaName },
    });
  });
}
