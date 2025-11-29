// migrations/20251129_create_tenant_schema.js
import { knex } from "./backend/src/db/knex.js";

/**
 * Dynamically creates a tenant schema with core CRM, deals, custom modules,
 * industry-specific tables, and communication suite.
 */
async function createTenantSchema(schemaName, industryType, trx) {
  const transaction = trx || knex;

  await transaction.raw(`CREATE SCHEMA IF NOT EXISTS ${schemaName}`);

  // Core CRM tables
  const coreTables = [
    "users",
    "leads",
    "contacts",
    "products",
    "deals",
    "quotes",
    "invoices",
    "activities",
    "notes",
    "files",
    "custom_modules",
    "custom_fields",
  ];

  for (const table of coreTables) {
    await transaction.schema.withSchema(schemaName).createTable(table, (t) => {
      t.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
      t.timestamps(true, true);

      // Specific columns for some tables
      switch (table) {
        case "users":
          t.string("name").notNullable();
          t.string("email").notNullable().unique();
          t.string("password").notNullable();
          t.string("role").defaultTo("employee");
          t.boolean("is_active").defaultTo(true);
          break;
        case "leads":
          t.string("name").notNullable();
          t.string("email");
          t.string("phone");
          t.string("status").defaultTo("new");
          break;
        case "contacts":
          t.string("first_name");
          t.string("last_name");
          t.string("email");
          t.string("phone");
          t.string("company");
          break;
        case "products":
          t.string("name").notNullable();
          t.text("description");
          t.decimal("price", 12, 2).defaultTo(0);
          break;
        case "deals":
          t.string("title").notNullable();
          t.string("stage");
          t.decimal("value", 12, 2).defaultTo(0);
          t.uuid("owner_id").references("id").inTable(`${schemaName}.users`);
          break;
        case "quotes":
          t.uuid("lead_id").references("id").inTable(`${schemaName}.leads`);
          t.uuid("product_id").references("id").inTable(`${schemaName}.products`);
          t.decimal("amount", 12, 2).defaultTo(0);
          t.string("status").defaultTo("draft");
          break;
        case "invoices":
          t.uuid("quote_id").references("id").inTable(`${schemaName}.quotes`);
          t.decimal("total_amount", 12, 2).defaultTo(0);
          t.string("status").defaultTo("pending");
          break;
        case "activities":
          t.string("type");
          t.string("title").notNullable();
          t.text("description");
          t.timestamp("start_time");
          t.timestamp("end_time");
          t.uuid("assigned_to").references("id").inTable(`${schemaName}.users`);
          t.string("status").defaultTo("pending");
          break;
        case "notes":
          t.string("entity_type");
          t.uuid("entity_id");
          t.text("content");
          t.uuid("created_by").references("id").inTable(`${schemaName}.users`);
          break;
        case "files":
          t.string("file_name").notNullable();
          t.string("file_url").notNullable();
          t.string("entity_type");
          t.uuid("entity_id");
          t.uuid("uploaded_by").references("id").inTable(`${schemaName}.users`);
          break;
        case "custom_modules":
          t.string("name").notNullable();
          t.jsonb("settings").defaultTo("{}");
          break;
        case "custom_fields":
          t.uuid("module_id").references("id").inTable(`${schemaName}.custom_modules`);
          t.string("name").notNullable();
          t.string("type").notNullable();
          t.jsonb("settings").defaultTo("{}");
          break;
      }
    });
  }

  // Industry-specific tables
  if (industryType === "healthcare") {
    await transaction.schema.withSchema(schemaName).createTable("patients", (t) => {
      t.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
      t.string("name").notNullable();
      t.string("email");
      t.string("phone");
      t.date("dob");
      t.timestamps(true, true);
    });

    await transaction.schema.withSchema(schemaName).createTable("appointments", (t) => {
      t.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
      t.uuid("patient_id").references("id").inTable(`${schemaName}.patients`);
      t.uuid("doctor_id").references("id").inTable(`${schemaName}.users`);
      t.timestamp("appointment_time");
      t.string("status").defaultTo("scheduled");
      t.timestamps(true, true);
    });
  } else if (industryType === "real_estate") {
    await transaction.schema.withSchema(schemaName).createTable("properties", (t) => {
      t.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
      t.string("name").notNullable();
      t.string("location");
      t.decimal("price", 12, 2);
      t.timestamps(true, true);
    });

    await transaction.schema.withSchema(schemaName).createTable("site_visits", (t) => {
      t.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
      t.uuid("property_id").references("id").inTable(`${schemaName}.properties`);
      t.uuid("visited_by").references("id").inTable(`${schemaName}.users`);
      t.timestamp("visit_time");
      t.timestamps(true, true);
    });
  }

  // Communication suite
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
 * Drop a tenant schema and all tables
 */
async function dropTenantSchema(schemaName, trx) {
  const transaction = trx || knex;

  const allTables = [
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

  for (const table of allTables) {
    await transaction.schema.withSchema(schemaName).dropTableIfExists(table);
  }

  await transaction.raw(`DROP SCHEMA IF EXISTS ${schemaName} CASCADE`);
}

// --------------------------------------
// Knex Migration Exports
// --------------------------------------
export async function up(knex) {
  const schemaName = process.env.TENANT_SCHEMA;
  const industryType = process.env.TENANT_INDUSTRY;

  if (!schemaName || !industryType) {
    throw new Error("TENANT_SCHEMA and TENANT_INDUSTRY env variables required for tenant migration.");
  }

  await createTenantSchema(schemaName, industryType);
}

export async function down(knex) {
  const schemaName = process.env.TENANT_SCHEMA;
  if (!schemaName) throw new Error("TENANT_SCHEMA env variable required to drop tenant schema.");

  await dropTenantSchema(schemaName);
}
