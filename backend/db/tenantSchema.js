import { knex } from "./knex.js";

/**
 * Create tenant schema + core tables
 * @param {string} tenantId
 * @returns {Promise<void>}
 */
export async function createTenantSchema(tenantId) {
  const schemaName = `tenant_${tenantId.replace(/-/g, "")}`;

  await knex.transaction(async (trx) => {
    //-----------------------------------------
    // 1. CREATE SCHEMA
    //-----------------------------------------
    await trx.raw(`CREATE SCHEMA IF NOT EXISTS ${schemaName}`);

    //-----------------------------------------
    // 2. LEADS TABLE (core example)
    //-----------------------------------------
    await trx.schema.withSchema(schemaName).createTable("leads", (table) => {
      table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
      table.string("name").notNullable();
      table.string("email");
      table.string("phone");
      table.string("status").defaultTo("new");
      table.timestamps(true, true); // created_at, updated_at
    });

    //-----------------------------------------
    // 3. USERS TABLE (tenant employees)
    //-----------------------------------------
    await trx.schema.withSchema(schemaName).createTable("users", (table) => {
      table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
      table.string("name").notNullable();
      table.string("email").notNullable().unique();
      table.string("password").notNullable();
      table.string("role").defaultTo("employee");
      table.boolean("is_active").defaultTo(true);
      table.timestamps(true, true);
    });

    //-----------------------------------------
    // 4. ACTIVITY LOGS
    //-----------------------------------------
    await trx.schema.withSchema(schemaName).createTable("activity_logs", (table) => {
      table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
      table.string("entity_type");
      table.uuid("entity_id");
      table.string("action");
      table.jsonb("details");
      table.uuid("performed_by");
      table.timestamps(true, true);
    });
  });

  return { schemaName };
}
