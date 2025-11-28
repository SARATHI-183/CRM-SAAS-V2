// tenantSchema.js
import { knex } from "./knex.js";


export async function createTenantSchema(schemaName, trx) {
  // Use the passed transaction
  const transaction = trx || knex;

  //-----------------------------------------
  // 1. CREATE SCHEMA
  //-----------------------------------------
  await transaction.raw(`CREATE SCHEMA IF NOT EXISTS ${schemaName}`);

  //-----------------------------------------
  // 2. LEADS TABLE
  //-----------------------------------------
  await transaction.schema.withSchema(schemaName).createTable("leads", (table) => {
    table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
    table.string("name").notNullable();
    table.string("email");
    table.string("phone");
    table.string("status").defaultTo("new");
    table.timestamps(true, true);
  });

  //-----------------------------------------
  // 3. USERS TABLE
  //-----------------------------------------
  await transaction.schema.withSchema(schemaName).createTable("users", (table) => {
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
  await transaction.schema.withSchema(schemaName).createTable("activity_logs", (table) => {
    table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
    table.string("entity_type");
    table.uuid("entity_id");
    table.string("action");
    table.jsonb("details");
    table.uuid("performed_by");
    table.timestamps(true, true);
  });
}
