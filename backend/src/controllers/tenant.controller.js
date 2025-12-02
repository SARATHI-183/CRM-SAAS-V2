// import { v4 as uuidv4 } from "uuid";
// import { knex } from "../db/knex.js";
// import { createTenantSchema, createDefaultModules } from "../db/tenantSchema.js";
// import { createUser } from "../services/tenant.service.js";
// import bcrypt from "bcrypt";

// export const createTenant = async (req, res) => {
//   const trx = await knex.transaction();
//   try {
//     const { company_name, company_email, industry_type, admin } = req.body;
//     if (!company_name || !company_email || !admin?.name || !admin?.email || !admin?.password)
//       return res.status(400).json({ message: "Missing required fields" });

//     const tenantId = uuidv4();
//     const schemaName = `tenant_${tenantId.replace(/-/g, "")}`;

//     // 1️⃣ Insert tenant into master.tenants
//     await trx("master.tenants").insert({
//       id: tenantId,
//       company_name,
//       company_email,
//       industry_type,
//       schema_name: schemaName,
//     });

//     // 2️⃣ Create schema + tables
//     await createTenantSchema(schemaName, industry_type, trx);

//     // 3️⃣ Create default modules
//     await createDefaultModules(schemaName, trx);

//     // 4️⃣ Create Tenant Admin user
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

//     // 5️⃣ Commit transaction
//     await trx.commit();

//     return res.status(201).json({
//       message: "Tenant created successfully",
//       tenant_id: tenantId,
//       schema: schemaName,
//       adminUser: { id: adminUser.id, email: adminUser.email },
//     });
//   } catch (err) {
//     await trx.rollback();
//     console.error("Tenant Creation Error:", err);
//     return res.status(500).json({ message: "Tenant creation failed", error: err.message });
//   }
// };

// export const getAllTenants = async (req, res) => {
//   try {
//     const tenants = await knex("master.tenants").select(
//       "id",
//       "company_name",
//       "company_email",
//       "industry_type",
//       "plan_id",
//       "schema_name",
//       "status",
//       "created_at",
//       "updated_at"
//     );

//     return res.json({ data: tenants });
//   } catch (err) {
//     console.error("Error fetching tenants:", err);
//     return res.status(500).json({ message: "Failed to fetch tenants", error: err.message });
//   }
// };

// // export const softDeleteTenant = async (req, res) => {
// //   try {
// //     const { tenantId } = req.params;

// //     const tenant = await knex("master.tenants")
// //       .where({ id: tenantId })
// //       .first();

// //     if (!tenant) {
// //       return res.status(404).json({ message: "Tenant not found" });
// //     }

// //     await knex("master.tenants")
// //       .where({ id: tenantId })
// //       .update({ status: "inactive", deleted_at: knex.fn.now() });

// //     return res.json({ message: "Tenant deactivated successfully" });

// //   } catch (err) {
// //     console.error("Soft Delete Error:", err);
// //     return res.status(500).json({ message: "Failed to deactivate tenant", error: err.message });
// //   }
// // };


// export const softDeleteTenant = async (req, res) => {
//   const trx = await knex.transaction();
//   try {
//     const { tenantId } = req.params;

//     // 1) Fetch old data before deleting
//     const oldTenant = await trx("master.tenants")
//       .where({ id: tenantId })
//       .first();

//     if (!oldTenant) {
//       await trx.rollback();
//       return res.status(404).json({ message: "Tenant not found" });
//     }

//     // 2) Perform soft delete
//     await trx("master.tenants")
//       .where({ id: tenantId })
//       .update({
//         status: "inactive",
//         updated_at: trx.fn.now(),  // always update timestamp
//       });

//     // 3) Insert audit log
//     await trx("master.audit_logs").insert({
//       id: uuidv4(),
//       user_id: req.superadmin?.id || null,
//       action: "tenant_soft_delete",
//       metadata: JSON.stringify({
//         tenant_id: tenantId,
//         company_name: oldTenant.company_name,
//         previous_status: oldTenant.status,
//         new_status: "inactive",
//       }),
//     });

//     // 4) Commit
//     await trx.commit();

//     return res.json({ message: "Tenant soft deleted successfully" });

//   } catch (err) {
//     await trx.rollback();
//     console.error("Soft Delete Error:", err);
//     return res.status(500).json({
//       message: "Failed to soft delete tenant",
//       error: err.message,
//     });
//   }
// };


// //optional
// export const hardDeleteTenant = async (req, res) => {
//   const trx = await knex.transaction();

//   try {
//     const { tenantId } = req.params;

//     const tenant = await trx("master.tenants")
//       .where({ id: tenantId })
//       .first();

//     if (!tenant) {
//       await trx.rollback();
//       return res.status(404).json({ message: "Tenant not found" });
//     }

//     // 1️⃣ Drop tenant schema completely
//     await trx.raw(`DROP SCHEMA IF EXISTS ${tenant.schema_name} CASCADE`);

//     // 2️⃣ Delete tenant record from master
//     await trx("master.tenants")
//       .where({ id: tenantId })
//       .del();

//     await trx.commit();

//     return res.json({
//       message: "Tenant deleted permanently",
//       schema: tenant.schema_name
//     });

//   } catch (err) {
//     await trx.rollback();
//     console.error("Hard Delete Error:", err);
//     return res.status(500).json({ message: "Failed to delete tenant", error: err.message });
//   }
// };


// import { v4 as uuidv4 } from "uuid";
// import { knex } from "../db/knex.js";
// import { createTenantSchema, createDefaultModules } from "../db/tenantSchema.js";
// import { createUser } from "../services/tenant.service.js";
// import bcrypt from "bcrypt";
// import { auditLog } from "../utils/auditLogger.js";

// // create tenant
// export const createTenant = async (req, res) => {
//   const trx = await knex.transaction();

//   try {
//     const { company_name, company_email, industry_type, admin } = req.body;

//     if (!company_name || !company_email || !admin?.name || !admin?.email || !admin?.password)
//       return res.status(400).json({ message: "Missing required fields" });

//     const tenantId = uuidv4();
//     const schemaName = `tenant_${tenantId.replace(/-/g, "")}`;

//     // 1️⃣ Insert into master.tenants
//     await trx("master.tenants").insert({
//       id: tenantId,
//       company_name,
//       company_email,
//       industry_type,
//       schema_name: schemaName,
//     });

//     // 2️⃣ Create tenant schema + tables
//     await createTenantSchema(schemaName, industry_type, trx);

//     // 3️⃣ Create default modules
//     await createDefaultModules(schemaName, trx);

//     // 4️⃣ Create Tenant Admin user
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

//     // 5️⃣ Audit Log
//     await auditLog(trx, {
//       userId: req.superadmin?.id,
//       tenantId,
//       action: "TENANT_CREATED",
//       resource: "tenant",
//       resourceId: tenantId,
//       metadata: {
//         company_name,
//         company_email,
//         industry_type,
//         created_admin: admin.email,
//       },
//       req,
//     });

//     await trx.commit();

//     return res.status(201).json({
//       message: "Tenant created successfully",
//       tenant_id: tenantId,
//       schema: schemaName,
//       adminUser: { id: adminUser.id, email: adminUser.email },
//     });

//   } catch (err) {
//     await trx.rollback();
//     console.error("Tenant Creation Error:", err);
//     return res.status(500).json({ message: "Tenant creation failed", error: err.message });
//   }
// };


// //get all tenants
// export const getAllTenants = async (req, res) => {
//   try {
//     const tenants = await knex("master.tenants").select(
//       "id",
//       "company_name",
//       "company_email",
//       "industry_type",
//       "plan_id",
//       "schema_name",
//       "status",
//       "created_at",
//       "updated_at"
//     );

//     return res.json({ data: tenants });
//   } catch (err) {
//     console.error("Error fetching tenants:", err);
//     return res.status(500).json({ message: "Failed to fetch tenants", error: err.message });
//   }
// };

// export const updateTenant = async (req, res) => {
//   const trx = await knex.transaction();
//   try {
//     const { tenantId } = req.params;
//     const updateData = req.body;

//     // 1️⃣ Fetch existing tenant
//     const oldTenant = await trx("master.tenants")
//       .where({ id: tenantId })
//       .first();

//     if (!oldTenant) {
//       await trx.rollback();
//       return res.status(404).json({ message: "Tenant not found" });
//     }

//     // 2️⃣ Update tenant fields
//     const allowedFields = [
//       "company_name",
//       "company_email",
//       "company_phone",
//       "company_website",
//       "plan_id",
//       "status",
//       "industry_type"
//     ];
//     const dataToUpdate = {};
//     for (const field of allowedFields) {
//       if (updateData[field] !== undefined) {
//         dataToUpdate[field] = updateData[field];
//       }
//     }

//     if (Object.keys(dataToUpdate).length === 0) {
//       await trx.rollback();
//       return res.status(400).json({ message: "No valid fields to update" });
//     }

//     dataToUpdate.updated_at = trx.fn.now();

//     await trx("master.tenants").where({ id: tenantId }).update(dataToUpdate);

//     // 3️⃣ Insert audit log
//     await trx("master.audit_logs").insert({
//       id: uuidv4(),
//       user_id: req.superadmin?.id || null,
//       action: "tenant_update",
//       metadata: JSON.stringify({
//         tenant_id: tenantId,
//         old_values: oldTenant,
//         new_values: dataToUpdate,
//       }),
//     });

//     await trx.commit();

//     return res.json({
//       message: "Tenant updated successfully",
//       tenant_id: tenantId,
//       updated_fields: dataToUpdate,
//     });
//   } catch (err) {
//     await trx.rollback();
//     console.error("Update Tenant Error:", err);
//     return res.status(500).json({
//       message: "Failed to update tenant",
//       error: err.message,
//     });
//   }
// };


// //soft delete
// export const softDeleteTenant = async (req, res) => {
//   const trx = await knex.transaction();

//   try {
//     const { tenantId } = req.params;

//     const oldTenant = await trx("master.tenants")
//       .where({ id: tenantId })
//       .first();

//     if (!oldTenant) {
//       await trx.rollback();
//       return res.status(404).json({ message: "Tenant not found" });
//     }

//     // Soft delete
//     await trx("master.tenants")
//       .where({ id: tenantId })
//       .update({
//         status: "inactive",
//         updated_at: trx.fn.now(),
//       });

//     // Audit
//     await auditLog(trx, {
//       userId: req.superadmin?.id,
//       tenantId,
//       action: "TENANT_SOFT_DELETED",
//       resource: "tenant",
//       resourceId: tenantId,
//       metadata: {
//         previous_status: oldTenant.status,
//         new_status: "inactive",
//         company_name: oldTenant.company_name,
//       },
//       req,
//     });

//     await trx.commit();

//     return res.json({ message: "Tenant soft deleted successfully" });

//   } catch (err) {
//     await trx.rollback();
//     console.error("Soft Delete Error:", err);
//     return res.status(500).json({ message: "Failed to soft delete tenant", error: err.message });
//   }
// };


// //hard delete
// export const hardDeleteTenant = async (req, res) => {
//   const trx = await knex.transaction();

//   try {
//     const { tenantId } = req.params;

//     const tenant = await trx("master.tenants")
//       .where({ id: tenantId })
//       .first();

//     if (!tenant) {
//       await trx.rollback();
//       return res.status(404).json({ message: "Tenant not found" });
//     }

//     // Drop schema
//     await trx.raw(`DROP SCHEMA IF EXISTS ${tenant.schema_name} CASCADE`);

//     // Delete tenant
//     await trx("master.tenants")
//       .where({ id: tenantId })
//       .del();

//     // Audit
//     await auditLog(trx, {
//       userId: req.superadmin?.id,
//       tenantId,
//       action: "TENANT_HARD_DELETED",
//       resource: "tenant",
//       resourceId: tenantId,
//       metadata: {
//         schema: tenant.schema_name,
//         company_name: tenant.company_name,
//       },
//       req,
//     });

//     await trx.commit();

//     return res.json({
//       message: "Tenant deleted permanently",
//       schema: tenant.schema_name
//     });

//   } catch (err) {
//     await trx.rollback();
//     console.error("Hard Delete Error:", err);
//     return res.status(500).json({ message: "Failed to delete tenant", error: err.message });
//   }
// };

// import { v4 as uuidv4 } from "uuid";
// import { knex } from "../db/knex.js";
// import { createTenantSchema, createDefaultModules } from "../db/tenantSchema.js";
// import { createUser } from "../services/tenant.service.js";
// import { auditLog } from "../utils/auditLogger.js";
// import { safeTenantData } from "../utils/safeTenantData.js";

// // ----------------------------
// // Create Tenant
// // ----------------------------
// export const createTenant = async (req, res) => {
//   const trx = await knex.transaction();
//   try {
//     const { company_name, company_email, industry_type, admin } = req.body;

//     if (!company_name || !company_email || !admin?.name || !admin?.email || !admin?.password)
//       return res.status(400).json({ message: "Missing required fields" });

//     const tenantId = uuidv4();
//     const schemaName = `tenant_${tenantId.replace(/-/g, "")}`;

//     await trx("master.tenants").insert({
//       id: tenantId,
//       company_name,
//       company_email,
//       industry_type,
//       schema_name: schemaName,
//     });

//     await createTenantSchema(schemaName, industry_type, trx);
//     await createDefaultModules(schemaName, trx);

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

//     await auditLog(trx, {
//       userId: req.superadmin?.id,
//       tenantId,
//       action: "TENANT_CREATED",
//       resource: "tenant",
//       resourceId: tenantId,
//       metadata: safeTenantData({
//         id: tenantId,
//         company_name,
//         company_email,
//         industry_type,
//         schema_name: schemaName,
//         created_admin: admin.email,
//       }),
//       req,
//     });

//     await trx.commit();

//     return res.status(201).json({
//       message: "Tenant created successfully",
//       tenant_id: tenantId,
//       schema: schemaName,
//       adminUser: { id: adminUser.id, email: adminUser.email },
//     });
//   } catch (err) {
//     await trx.rollback();
//     console.error("Tenant Creation Error:", err);
//     return res.status(500).json({ message: "Tenant creation failed", error: err.message });
//   }
// };

// // ----------------------------
// // Get All Tenants
// // ----------------------------
// export const getAllTenants = async (req, res) => {
//   try {
//     const tenants = await knex("master.tenants").select(
//       "id",
//       "company_name",
//       "company_email",
//       "company_phone",
//       "company_website",
//       "industry_type",
//       "plan_id",
//       "schema_name",
//       "status",
//       "created_at",
//       "updated_at"
//     );
//     return res.json({ data: tenants });
//   } catch (err) {
//     console.error("Error fetching tenants:", err);
//     return res.status(500).json({ message: "Failed to fetch tenants", error: err.message });
//   }
// };

// // ----------------------------
// // Update Tenant
// // ----------------------------
// // ----------------------------
// // Update Tenant
// // ----------------------------
// export const updateTenant = async (req, res) => {
//   const trx = await knex.transaction();
//   try {
//     const { tenantId } = req.params;
//     const updateData = req.body;

//     // 1️⃣ Fetch existing tenant
//     const oldTenant = await trx("master.tenants").where({ id: tenantId }).first();
//     if (!oldTenant) {
//       await trx.rollback();
//       return res.status(404).json({ message: "Tenant not found" });
//     }

//     // 2️⃣ Filter allowed fields
//     const allowedFields = [
//       "company_name",
//       "company_email",
//       "company_phone",
//       "company_website",
//       "plan_id",
//       "status",
//       "industry_type",
//     ];
//     const dataToUpdate = {};
//     for (const field of allowedFields) {
//       if (updateData[field] !== undefined) {
//         dataToUpdate[field] = updateData[field];
//       }
//     }

//     if (!Object.keys(dataToUpdate).length) {
//       await trx.rollback();
//       return res.status(400).json({ message: "No valid fields to update" });
//     }

//     dataToUpdate.updated_at = trx.fn.now();

//     // 3️⃣ Update tenant in DB
//     await trx("master.tenants").where({ id: tenantId }).update(dataToUpdate);

//     // 4️⃣ Insert audit log with safe data
//     await auditLog(trx, {
//       userId: req.superadmin?.id,
//       tenantId,
//       action: "TENANT_UPDATED",
//       resource: "tenant",
//       resourceId: tenantId,
//       metadata: {
//         old_values: safeTenantData(oldTenant),
//         new_values: safeTenantData(dataToUpdate),
//       },
//       req,
//     });

//     await trx.commit();

//     // 5️⃣ Return only serializable fields
//     const responseData = { ...dataToUpdate };
//     delete responseData.updated_at; // remove knex.fn.now() object

//     return res.json({
//       message: "Tenant updated successfully",
//       tenant_id: tenantId,
//       updated_fields: responseData,
//     });

//   } catch (err) {
//     await trx.rollback();
//     console.error("Update Tenant Error:", err);
//     return res.status(500).json({
//       message: "Failed to update tenant",
//       error: err.message,
//     });
//   }
// };

// // ----------------------------
// // Soft Delete Tenant
// // ----------------------------
// export const softDeleteTenant = async (req, res) => {
//   const trx = await knex.transaction();
//   try {
//     const { tenantId } = req.params;

//     const oldTenant = await trx("master.tenants").where({ id: tenantId }).first();
//     if (!oldTenant) {
//       await trx.rollback();
//       return res.status(404).json({ message: "Tenant not found" });
//     }

//     const newData = { status: "inactive", updated_at: trx.fn.now() };
//     await trx("master.tenants").where({ id: tenantId }).update(newData);

//     await auditLog(trx, {
//       userId: req.superadmin?.id,
//       tenantId,
//       action: "TENANT_SOFT_DELETED",
//       resource: "tenant",
//       resourceId: tenantId,
//       metadata: {
//         old_values: safeTenantData(oldTenant),
//         new_values: newData,
//       },
//       req,
//     });

//     await trx.commit();
//     return res.json({ message: "Tenant soft deleted successfully" });
//   } catch (err) {
//     await trx.rollback();
//     console.error("Soft Delete Error:", err);
//     return res.status(500).json({ message: "Failed to soft delete tenant", error: err.message });
//   }
// };

// // ----------------------------
// // Hard Delete Tenant
// // ----------------------------
// export const hardDeleteTenant = async (req, res) => {
//   const trx = await knex.transaction();
//   try {
//     const { tenantId } = req.params;

//     const tenant = await trx("master.tenants").where({ id: tenantId }).first();
//     if (!tenant) {
//       await trx.rollback();
//       return res.status(404).json({ message: "Tenant not found" });
//     }

//     await trx.raw(`DROP SCHEMA IF EXISTS ${tenant.schema_name} CASCADE`);
//     await trx("master.tenants").where({ id: tenantId }).del();

//     await auditLog(trx, {
//       userId: req.superadmin?.id,
//       tenantId,
//       action: "TENANT_HARD_DELETED",
//       resource: "tenant",
//       resourceId: tenantId,
//       metadata: safeTenantData({
//         id: tenant.id,
//         company_name: tenant.company_name,
//         schema_name: tenant.schema_name,
//       }),
//       req,
//     });

//     await trx.commit();
//     return res.json({ message: "Tenant deleted permanently", schema: tenant.schema_name });
//   } catch (err) {
//     await trx.rollback();
//     console.error("Hard Delete Error:", err);
//     return res.status(500).json({ message: "Failed to delete tenant", error: err.message });
//   }
// };


// import { v4 as uuidv4 } from "uuid";
// import { knex } from "../db/knex.js";
// import { createTenantSchema, createDefaultModules } from "../db/tenantSchema.js";
// import { createUser } from "../services/tenant.service.js";
// import { auditLog } from "../utils/auditLogger.js";
// import { safeTenantData } from "../utils/safeTenantData.js";

// // ----------------------------
// // Create Tenant
// // ----------------------------
// export const createTenant = async (req, res) => {
//   const trx = await knex.transaction();
//   try {
//     const { company_name, company_email, industry_type, admin } = req.body;

//     if (!company_name || !company_email || !admin?.name || !admin?.email || !admin?.password)
//       return res.status(400).json({ message: "Missing required fields" });

//     const tenantId = uuidv4();
//     const schemaName = `tenant_${tenantId.replace(/-/g, "")}`;

//     await trx("master.tenants").insert({
//       id: tenantId,
//       company_name,
//       company_email,
//       industry_type,
//       schema_name: schemaName,
//     });

//     await createTenantSchema(schemaName, industry_type, trx);
//     await createDefaultModules(schemaName, trx);

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

//     // Audit log
//     await auditLog(trx, {
//       userId: req.superadmin?.id,
//       tenantId,
//       action: "TENANT_CREATED",
//       resource: "tenant",
//       resourceId: tenantId,
//       metadata: safeTenantData({
//         id: tenantId,
//         company_name,
//         company_email,
//         industry_type,
//         schema_name: schemaName,
//         created_admin: admin.email,
//       }),
//       req,
//     });

//     await trx.commit();

//     return res.status(201).json({
//       message: "Tenant created successfully",
//       tenant: safeTenantData({
//         id: tenantId,
//         company_name,
//         company_email,
//         industry_type,
//         schema_name: schemaName,
//       }),
//       adminUser: { id: adminUser.id, email: adminUser.email },
//     });
//   } catch (err) {
//     await trx.rollback();
//     console.error("Tenant Creation Error:", err);
//     return res.status(500).json({ message: "Tenant creation failed", error: err.message });
//   }
// };

// // ----------------------------
// // Get All Tenants
// // ----------------------------
// export const getAllTenants = async (req, res) => {
//   try {
//     const tenants = await knex("master.tenants").select(
//       "id",
//       "company_name",
//       "company_email",
//       "company_phone",
//       "company_website",
//       "industry_type",
//       "plan_id",
//       "schema_name",
//       "status",
//       "created_at",
//       "updated_at"
//     );
//     return res.json({ data: tenants.map(safeTenantData) });
//   } catch (err) {
//     console.error("Error fetching tenants:", err);
//     return res.status(500).json({ message: "Failed to fetch tenants", error: err.message });
//   }
// };

// // ----------------------------
// // Update Tenant
// // ----------------------------
// export const updateTenant = async (req, res) => {
//   const trx = await knex.transaction();

//   try {
//     const { tenantId } = req.params;
//     const updateData = req.body;

//     // 1️⃣ Fetch existing tenant
//     const oldTenant = await trx("master.tenants").where({ id: tenantId }).first();
//     if (!oldTenant) {
//       await trx.rollback();
//       return res.status(404).json({ message: "Tenant not found" });
//     }

//     // 2️⃣ Filter allowed fields
//     const allowedFields = [
//       "company_name",
//       "company_email",
//       "company_phone",
//       "company_website",
//       "plan_id",
//       "status",
//       "industry_type",
//     ];

//     const dataToUpdate = {};
//     for (const field of allowedFields) {
//       if (updateData[field] !== undefined) {
//         dataToUpdate[field] = updateData[field];
//       }
//     }

//     if (!Object.keys(dataToUpdate).length) {
//       await trx.rollback();
//       return res.status(400).json({ message: "No valid fields to update" });
//     }

//     // 3️⃣ Update DB with trx.fn.now() for updated_at
//     await trx("master.tenants")
//       .where({ id: tenantId })
//       .update({ ...dataToUpdate, updated_at: trx.fn.now() });

//     // 4️⃣ Audit log: use safeTenantData for old and new values
//     await auditLog(trx, {
//       userId: req.superadmin?.id,
//       tenantId,
//       action: "TENANT_UPDATED",
//       resource: "tenant",
//       resourceId: tenantId,
//       metadata: {
//         old_values: safeTenantData(oldTenant),
//         new_values: safeTenantData({ ...oldTenant, ...dataToUpdate }),
//       },
//       req,
//     });

//     await trx.commit();

//     // 5️⃣ Respond with only safe/serializable fields
//     const responseTenant = safeTenantData({ ...oldTenant, ...dataToUpdate });

//     return res.json({
//       message: "Tenant updated successfully",
//       tenant: responseTenant,
//     });
//   } catch (err) {
//     await trx.rollback();
//     console.error("Update Tenant Error:", err);
//     return res.status(500).json({
//       message: "Failed to update tenant",
//       error: err.message,
//     });
//   }
// };


// // ----------------------------
// // Soft Delete Tenant
// // ----------------------------
// export const softDeleteTenant = async (req, res) => {
//   const trx = await knex.transaction();
//   try {
//     const { tenantId } = req.params;

//     const oldTenant = await trx("master.tenants").where({ id: tenantId }).first();
//     if (!oldTenant) {
//       await trx.rollback();
//       return res.status(404).json({ message: "Tenant not found" });
//     }

//     const newData = { status: "inactive", updated_at: trx.fn.now() };
//     await trx("master.tenants").where({ id: tenantId }).update(newData);

//     // Audit log
//     await auditLog(trx, {
//       userId: req.superadmin?.id,
//       tenantId,
//       action: "TENANT_SOFT_DELETED",
//       resource: "tenant",
//       resourceId: tenantId,
//       metadata: {
//         old_values: safeTenantData(oldTenant),
//         new_values: safeTenantData({ ...oldTenant, ...newData }),
//       },
//       req,
//     });

//     await trx.commit();
//     return res.json({ message: "Tenant soft deleted successfully", tenant: safeTenantData({ ...oldTenant, ...newData }) });
//   } catch (err) {
//     await trx.rollback();
//     console.error("Soft Delete Error:", err);
//     return res.status(500).json({ message: "Failed to soft delete tenant", error: err.message });
//   }
// };

// // ----------------------------
// // Hard Delete Tenant
// // ----------------------------
// export const hardDeleteTenant = async (req, res) => {
//   const trx = await knex.transaction();
//   try {
//     const { tenantId } = req.params;

//     const tenant = await trx("master.tenants").where({ id: tenantId }).first();
//     if (!tenant) {
//       await trx.rollback();
//       return res.status(404).json({ message: "Tenant not found" });
//     }

//     await trx.raw(`DROP SCHEMA IF EXISTS ${tenant.schema_name} CASCADE`);
//     await trx("master.tenants").where({ id: tenantId }).del();

//     // Audit log
//     await auditLog(trx, {
//       userId: req.superadmin?.id,
//       tenantId,
//       action: "TENANT_HARD_DELETED",
//       resource: "tenant",
//       resourceId: tenantId,
//       metadata: safeTenantData({
//         id: tenant.id,
//         company_name: tenant.company_name,
//         schema_name: tenant.schema_name,
//       }),
//       req,
//     });

//     await trx.commit();
//     return res.json({ message: "Tenant deleted permanently", tenant: safeTenantData(tenant) });
//   } catch (err) {
//     await trx.rollback();
//     console.error("Hard Delete Error:", err);
//     return res.status(500).json({ message: "Failed to delete tenant", error: err.message });
//   }
// };


import { v4 as uuidv4 } from "uuid";
import { knex } from "../db/knex.js";
import { createTenantSchema, createDefaultModules } from "../db/tenantSchema.js";
import { createTenantUser } from "../services/tenant.service.js";
import { auditLog } from "../utils/auditLogger.js";
import { safeTenantData } from "../utils/safeTenantData.js";

// ----------------------------
// Create Tenant
// ----------------------------
export const createTenant = async (req, res) => {
  const trx = await knex.transaction();
  try {
    const { company_name, company_email, industry_type, admin } = req.body;
    if (!company_name || !company_email || !admin?.name || !admin?.email || !admin?.password)
      return res.status(400).json({ message: "Missing required fields" });

    const tenantId = uuidv4();
    const schemaName = `tenant_${tenantId.replace(/-/g, "")}`;

    await trx("master.tenants").insert({
      id: tenantId,
      company_name,
      company_email,
      industry_type,
      schema_name: schemaName,
    });

    await createTenantSchema(schemaName, industry_type, trx);
    await createDefaultModules(schemaName, trx);

    const adminUser = await createTenantUser(
      { schema: schemaName, name: admin.name, email: admin.email, password: admin.password, role: "tenant_admin" },
      trx
    );

    // ✅ Audit log with safeTenantData
    await auditLog(trx, {
      userId: req.superadmin?.id,
      tenantId,
      action: "TENANT_CREATED",
      resource: "tenant",
      resourceId: tenantId,
      metadata: safeTenantData({ id: tenantId, company_name, company_email, industry_type, schema_name: schemaName, created_admin: admin.email }),
      req,
    });

    await trx.commit();

    return res.status(201).json({
      message: "Tenant created successfully",
      tenant: safeTenantData({ id: tenantId, company_name, company_email, industry_type, schema_name: schemaName }),
      adminUser: { id: adminUser.id, email: adminUser.email },
    });
  } catch (err) {
    await trx.rollback();
    console.error("Tenant Creation Error:", err);
    return res.status(500).json({ message: "Tenant creation failed", error: err.message });
  }
};

// ----------------------------
// Get All Tenants
// ----------------------------
export const getAllTenants = async (req, res) => {
  try {
    const tenants = await knex("master.tenants").select(
      "id", "company_name", "company_email", "company_phone", "company_website",
      "industry_type", "plan_id", "schema_name", "status", "created_at", "updated_at"
    );
    return res.json({ data: tenants.map(safeTenantData) });
  } catch (err) {
    console.error("Error fetching tenants:", err);
    return res.status(500).json({ message: "Failed to fetch tenants", error: err.message });
  }
};

// ----------------------------
// Update Tenant
// ----------------------------
export const updateTenant = async (req, res) => {
  const trx = await knex.transaction();
  try {
    const { tenantId } = req.params;
    const updateData = req.body;

    const oldTenant = await trx("master.tenants").where({ id: tenantId }).first();
    if (!oldTenant) {
      await trx.rollback();
      return res.status(404).json({ message: "Tenant not found" });
    }

    const allowedFields = ["company_name", "company_email", "company_phone", "company_website", "plan_id", "status", "industry_type"];
    const dataToUpdate = {};
    for (const field of allowedFields) if (updateData[field] !== undefined) dataToUpdate[field] = updateData[field];

    if (!Object.keys(dataToUpdate).length) {
      await trx.rollback();
      return res.status(400).json({ message: "No valid fields to update" });
    }

    // ✅ Update tenant
    await trx("master.tenants").where({ id: tenantId }).update({ ...dataToUpdate, updated_at: trx.fn.now() });

    // ✅ Audit log
    await auditLog(trx, {
      userId: req.superadmin?.id,
      tenantId,
      action: "TENANT_UPDATED",
      resource: "tenant",
      resourceId: tenantId,
      metadata: {
        old_values: safeTenantData(oldTenant),
        new_values: safeTenantData({ ...oldTenant, ...dataToUpdate }),
      },
      req,
    });

    await trx.commit();

    return res.json({
      message: "Tenant updated successfully",
      tenant: safeTenantData({ ...oldTenant, ...dataToUpdate }),
    });
  } catch (err) {
    await trx.rollback();
    console.error("Update Tenant Error:", err);
    return res.status(500).json({ message: "Failed to update tenant", error: err.message });
  }
};

// ----------------------------
// Soft Delete Tenant
// ----------------------------
export const softDeleteTenant = async (req, res) => {
  const trx = await knex.transaction();
  try {
    const { tenantId } = req.params;

    const oldTenant = await trx("master.tenants").where({ id: tenantId }).first();
    if (!oldTenant) {
      await trx.rollback();
      return res.status(404).json({ message: "Tenant not found" });
    }

    const newData = { status: "inactive" };
    await trx("master.tenants").where({ id: tenantId }).update({ ...newData, updated_at: trx.fn.now() });

    await auditLog(trx, {
      userId: req.superadmin?.id,
      tenantId,
      action: "TENANT_SOFT_DELETED",
      resource: "tenant",
      resourceId: tenantId,
      metadata: {
        old_values: safeTenantData(oldTenant),
        new_values: safeTenantData({ ...oldTenant, ...newData }),
      },
      req,
    });

    await trx.commit();
    return res.json({
      message: "Tenant soft deleted successfully",
      tenant: safeTenantData({ ...oldTenant, ...newData }),
    });
  } catch (err) {
    await trx.rollback();
    console.error("Soft Delete Error:", err);
    return res.status(500).json({ message: "Failed to soft delete tenant", error: err.message });
  }
};

// ----------------------------
// Hard Delete Tenant
// ----------------------------
export const hardDeleteTenant = async (req, res) => {
  const trx = await knex.transaction();
  try {
    const { tenantId } = req.params;

    const tenant = await trx("master.tenants").where({ id: tenantId }).first();
    if (!tenant) {
      await trx.rollback();
      return res.status(404).json({ message: "Tenant not found" });
    }

    await trx.raw(`DROP SCHEMA IF EXISTS ${tenant.schema_name} CASCADE`);
    await trx("master.tenants").where({ id: tenantId }).del();

    await auditLog(trx, {
      userId: req.superadmin?.id,
      tenantId,
      action: "TENANT_HARD_DELETED",
      resource: "tenant",
      resourceId: tenantId,
      metadata: safeTenantData({ id: tenant.id, company_name: tenant.company_name, schema_name: tenant.schema_name }),
      req,
    });

    await trx.commit();
    return res.json({
      message: "Tenant deleted permanently",
      tenant: safeTenantData(tenant),
    });
  } catch (err) {
    await trx.rollback();
    console.error("Hard Delete Error:", err);
    return res.status(500).json({ message: "Failed to delete tenant", error: err.message });
  }
};
