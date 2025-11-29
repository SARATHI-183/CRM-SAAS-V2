// migrations/tenant_schema_migration.js
import { knex } from "./backend/src/db/knex.js";

/**
 * Create full tenant schema with core CRM, industry modules, communication suite, and custom modules.
 * @param {string} schemaName - Tenant schema name
 * @param {string} industryType - Industry type for industry-specific tables
 * @param {object} trx - Optional transaction
 */
async function createTenantSchema(schemaName, industryType, trx) {
  const transaction = trx || knex;

  // -----------------------------
  // 1. CREATE SCHEMA
  // -----------------------------
  await transaction.raw(`CREATE SCHEMA IF NOT EXISTS ${schemaName}`);

  // -----------------------------
  // 2. CORE CRM TABLES
  // -----------------------------
  await transaction.schema.withSchema(schemaName).createTable("users", (table) => {
    table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
    table.string("name").notNullable();
    table.string("email").notNullable().unique();
    table.string("password").notNullable();
    table.string("role").defaultTo("employee");
    table.boolean("is_active").defaultTo(true);
    table.timestamps(true, true);
  });

  await transaction.schema.withSchema(schemaName).createTable("leads", (table) => {
    table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
    table.string("name").notNullable();
    table.string("email");
    table.string("phone");
    table.string("status").defaultTo("new");
    table.timestamps(true, true);
  });

  await transaction.schema.withSchema(schemaName).createTable("contacts", (table) => {
    table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
    table.string("first_name");
    table.string("last_name");
    table.string("email");
    table.string("phone");
    table.string("company");
    table.timestamps(true, true);
  });

  await transaction.schema.withSchema(schemaName).createTable("products", (table) => {
    table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
    table.string("name").notNullable();
    table.text("description");
    table.decimal("price", 12, 2).defaultTo(0);
    table.timestamps(true, true);
  });

  await transaction.schema.withSchema(schemaName).createTable("deals", (table) => {
    table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
    table.string("title").notNullable();
    table.string("stage");
    table.decimal("value", 12, 2).defaultTo(0);
    table.uuid("owner_id").references("id").inTable(`${schemaName}.users`);
    table.timestamps(true, true);
  });

  await transaction.schema.withSchema(schemaName).createTable("quotes", (table) => {
    table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
    table.uuid("lead_id").references("id").inTable(`${schemaName}.leads`);
    table.uuid("product_id").references("id").inTable(`${schemaName}.products`);
    table.decimal("amount", 12, 2).defaultTo(0);
    table.string("status").defaultTo("draft");
    table.timestamps(true, true);
  });

  await transaction.schema.withSchema(schemaName).createTable("invoices", (table) => {
    table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
    table.uuid("quote_id").references("id").inTable(`${schemaName}.quotes`);
    table.decimal("total_amount", 12, 2).defaultTo(0);
    table.string("status").defaultTo("pending");
    table.timestamps(true, true);
  });

  await transaction.schema.withSchema(schemaName).createTable("activities", (table) => {
    table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
    table.string("type");
    table.string("title").notNullable();
    table.text("description");
    table.timestamp("start_time");
    table.timestamp("end_time");
    table.uuid("assigned_to").references("id").inTable(`${schemaName}.users`);
    table.string("status").defaultTo("pending");
    table.timestamps(true, true);
  });

  await transaction.schema.withSchema(schemaName).createTable("notes", (table) => {
    table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
    table.string("entity_type");
    table.uuid("entity_id");
    table.text("content");
    table.uuid("created_by").references("id").inTable(`${schemaName}.users`);
    table.timestamps(true, true);
  });

  await transaction.schema.withSchema(schemaName).createTable("files", (table) => {
    table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
    table.string("file_name").notNullable();
    table.string("file_url").notNullable();
    table.string("entity_type");
    table.uuid("entity_id");
    table.uuid("uploaded_by").references("id").inTable(`${schemaName}.users`);
    table.timestamps(true, true);
  });

  // -----------------------------
  // 3. CUSTOM MODULES AND FIELDS
  // -----------------------------
  await transaction.schema.withSchema(schemaName).createTable("custom_modules", (table) => {
    table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
    table.string("name").notNullable();
    table.jsonb("settings").defaultTo("{}");
    table.timestamps(true, true);
  });

  await transaction.schema.withSchema(schemaName).createTable("custom_fields", (table) => {
    table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
    table.uuid("module_id").references("id").inTable(`${schemaName}.custom_modules`);
    table.string("name").notNullable();
    table.string("type").notNullable();
    table.jsonb("settings").defaultTo("{}");
    table.timestamps(true, true);
  });

  // -----------------------------
  // 4. INDUSTRY-SPECIFIC TABLES
  // -----------------------------
  if (industryType === "healthcare") {
    await transaction.schema.withSchema(schemaName).createTable("patients", (table) => {
      table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
      table.string("name").notNullable();
      table.string("email");
      table.string("phone");
      table.date("dob");
      table.timestamps(true, true);
    });

    await transaction.schema.withSchema(schemaName).createTable("appointments", (table) => {
      table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
      table.uuid("patient_id").references("id").inTable(`${schemaName}.patients`);
      table.uuid("doctor_id").references("id").inTable(`${schemaName}.users`);
      table.timestamp("appointment_time");
      table.string("status").defaultTo("scheduled");
      table.timestamps(true, true);
    });
  } else if (industryType === "real_estate") {
    await transaction.schema.withSchema(schemaName).createTable("properties", (table) => {
      table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
      table.string("name").notNullable();
      table.string("location");
      table.decimal("price", 12, 2);
      table.timestamps(true, true);
    });

    await transaction.schema.withSchema(schemaName).createTable("site_visits", (table) => {
      table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
      table.uuid("property_id").references("id").inTable(`${schemaName}.properties`);
      table.uuid("visited_by").references("id").inTable(`${schemaName}.users`);
      table.timestamp("visit_time");
      table.timestamps(true, true);
    });
  }

  // -----------------------------
  // 5. COMMUNICATION SUITE TABLES (MANDATORY)
  // -----------------------------
  const commTables = [
    "calls",
    "call_recordings",
    "ivr_flows",
    "wa_campaigns",
    "wa_templates",
    "wa_logs",
    "email_campaigns",
    "email_templates",
    "email_logs",
    "sms_campaigns",
    "sms_templates",
    "sms_logs",
  ];

  for (const table of commTables) {
    await transaction.schema.withSchema(schemaName).createTable(table, (t) => {
      t.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
      t.timestamps(true, true);
    });
  }
}

/**
 * Drop full tenant schema and all tables
 */
async function dropTenantSchema(schemaName, trx) {
  const transaction = trx || knex;

  const tables = [
    "sms_logs",
    "sms_templates",
    "sms_campaigns",
    "email_logs",
    "email_templates",
    "email_campaigns",
    "wa_logs",
    "wa_templates",
    "wa_campaigns",
    "ivr_flows",
    "call_recordings",
    "calls",
    "site_visits",
    "properties",
    "appointments",
    "patients",
    "custom_fields",
    "custom_modules",
    "files",
    "notes",
    "activities",
    "invoices",
    "quotes",
    "deals",
    "products",
    "contacts",
    "leads",
    "users",
  ];

  for (const table of tables) {
    await transaction.schema.withSchema(schemaName).dropTableIfExists(table);
  }

  await transaction.raw(`DROP SCHEMA IF EXISTS ${schemaName} CASCADE`);
}

// --------------------------------------
// Knex Migration Exports
// --------------------------------------
export async function up(knex) {
  // Example usage: createTenantSchema("tenant_abc", "healthcare");
  // This should be called dynamically in your tenant creation API
}

export async function down(knex) {
  // Example usage: dropTenantSchema("tenant_abc");
}
