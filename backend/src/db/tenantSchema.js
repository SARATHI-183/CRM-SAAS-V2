// // tenantSchema.js
// import { knex } from "./knex.js";


// export async function createTenantSchema(schemaName, trx) {
//   // Use the passed transaction
//   const transaction = trx || knex;

//   //-----------------------------------------
//   // 1. CREATE SCHEMA
//   //-----------------------------------------
//   await transaction.raw(`CREATE SCHEMA IF NOT EXISTS ${schemaName}`);

//   //-----------------------------------------
//   // 2. LEADS TABLE
//   //-----------------------------------------
//   await transaction.schema.withSchema(schemaName).createTable("leads", (table) => {
//     table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//     table.string("name").notNullable();
//     table.string("email");
//     table.string("phone");
//     table.string("status").defaultTo("new");
//     table.timestamps(true, true);
//   });

//   //-----------------------------------------
//   // 3. USERS TABLE
//   //-----------------------------------------
//   await transaction.schema.withSchema(schemaName).createTable("users", (table) => {
//     table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//     table.string("name").notNullable();
//     table.string("email").notNullable().unique();
//     table.string("password").notNullable();
//     table.string("role").defaultTo("employee");
//     table.boolean("is_active").defaultTo(true);
//     table.timestamps(true, true);
//   });

//   //-----------------------------------------
//   // 4. ACTIVITY LOGS
//   //-----------------------------------------
//   await transaction.schema.withSchema(schemaName).createTable("activity_logs", (table) => {
//     table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//     table.string("entity_type");
//     table.uuid("entity_id");
//     table.string("action");
//     table.jsonb("details");
//     table.uuid("performed_by");
//     table.timestamps(true, true);
//   });
// }

// import { knex } from "./knex.js";

// export async function createTenantSchema(schemaName, industryModules = [], enabledAddons = [], trx) {
//   const db = trx || knex;

//   // 1️⃣ Create Schema
//   await db.raw(`CREATE SCHEMA IF NOT EXISTS ${schemaName}`);

//   // 2️⃣ Core Tables
//   const coreTables = {
//     users: (table) => {
//       table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//       table.string("name").notNullable();
//       table.string("email").notNullable().unique();
//       table.string("password").notNullable();
//       table.enu("role", ["tenant_admin", "employee"]).defaultTo("employee");
//       table.boolean("is_active").defaultTo(true);
//       table.timestamps(true, true);
//     },
//     leads: (table) => {
//       table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//       table.string("name").notNullable();
//       table.string("email");
//       table.string("phone");
//       table.string("status").defaultTo("new");
//       table.timestamps(true, true);
//     },
//     contacts: (table) => {
//       table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//       table.string("name").notNullable();
//       table.string("email");
//       table.string("phone");
//       table.timestamps(true, true);
//     },
//     companies: (table) => {
//       table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//       table.string("name").notNullable();
//       table.string("email");
//       table.string("phone");
//       table.timestamps(true, true);
//     },
//     deals: (table) => {
//       table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//       table.string("name").notNullable();
//       table.uuid("contact_id");
//       table.uuid("company_id");
//       table.decimal("value", 12, 2);
//       table.enu("stage", ["lead", "prospect", "negotiation", "won", "lost"]).defaultTo("lead");
//       table.timestamps(true, true);
//     },
//     products: (table) => {
//       table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//       table.string("name").notNullable();
//       table.decimal("price", 12, 2).notNullable();
//       table.timestamps(true, true);
//     },
//     quotes: (table) => {
//       table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//       table.uuid("deal_id");
//       table.decimal("total", 12, 2);
//       table.timestamps(true, true);
//     },
//     invoices: (table) => {
//       table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//       table.uuid("deal_id");
//       table.decimal("total", 12, 2);
//       table.timestamps(true, true);
//     },
//     payments: (table) => {
//       table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//       table.uuid("invoice_id");
//       table.decimal("amount", 12, 2);
//       table.timestamps(true, true);
//     },
//     tasks: (table) => {
//       table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//       table.string("title").notNullable();
//       table.string("type").defaultTo("task");
//       table.uuid("assigned_to");
//       table.timestamp("due_date");
//       table.string("status").defaultTo("pending");
//       table.timestamps(true, true);
//     },
//     notes: (table) => {
//       table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//       table.string("title");
//       table.text("description");
//       table.uuid("related_id");
//       table.string("related_type");
//       table.timestamps(true, true);
//     },
//     files: (table) => {
//       table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//       table.string("filename");
//       table.string("filepath");
//       table.uuid("uploaded_by");
//       table.timestamps(true, true);
//     },
//     activity_logs: (table) => {
//       table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//       table.string("entity_type");
//       table.uuid("entity_id");
//       table.string("action");
//       table.jsonb("details");
//       table.uuid("performed_by");
//       table.timestamps(true, true);
//     }
//   };

//   for (const [name, builder] of Object.entries(coreTables)) {
//     await db.schema.withSchema(schemaName).createTable(name, builder);
//   }

//   // 3️⃣ Custom Modules & Fields (superadmin controlled)
//   await db.schema.withSchema(schemaName).createTable("custom_modules", (table) => {
//     table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//     table.string("name").notNullable();
//     table.string("description");
//     table.timestamps(true, true);
//   });

//   await db.schema.withSchema(schemaName).createTable("custom_fields", (table) => {
//     table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//     table.uuid("module_id").notNullable();
//     table.string("field_name").notNullable();
//     table.enu("field_type", ["text","number","date","dropdown","file","boolean","json"]).defaultTo("text");
//     table.boolean("is_required").defaultTo(false);
//     table.jsonb("options").defaultTo("{}");
//     table.timestamps(true, true);
//   });

//   // 4️⃣ Optional Add-ons
//   if (enabledAddons.includes("communications")) {
//     await db.schema.withSchema(schemaName).createTable("calls", (table) => {
//       table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
//       table.string("type");
//       table.string("status");
//       table.timestamps(true, true);
//     });
//   }

//   if (enabledAddons.includes("email_marketing")) {
//     await db.schema.withSchema(schemaName).createTable("email_campaigns", (table) => {
//       table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
//       table.string("name").notNullable();
//       table.timestamps(true, true);
//     });
//   }

// };

// // tenantSchema.js
// import { knex } from "./knex.js";

// /**
//  * Creates a full tenant schema with core CRM, industry modules, communication suite, and custom modules.
//  * @param {string} schemaName - The schema name for the tenant
//  * @param {string} industryType - Industry type (used to load industry-specific tables)
//  * @param {object} trx - Optional transaction object
//  */
// export async function createTenantSchema(schemaName, industryType, trx) {
//   const transaction = trx || knex;

//   // -----------------------------
//   // 1. CREATE SCHEMA
//   // -----------------------------
//   await transaction.raw(`CREATE SCHEMA IF NOT EXISTS ${schemaName}`);

//   // -----------------------------
//   // 2. CORE CRM TABLES
//   // -----------------------------

//   // Users
//   await transaction.schema.withSchema(schemaName).createTable("users", (table) => {
//     table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//     table.string("name").notNullable();
//     table.string("email").notNullable().unique();
//     table.string("password").notNullable();
//     table.string("role").defaultTo("employee");
//     table.boolean("is_active").defaultTo(true);
//     table.timestamps(true, true);
//   });

//   // Leads
//   await transaction.schema.withSchema(schemaName).createTable("leads", (table) => {
//     table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//     table.string("name").notNullable();
//     table.string("email");
//     table.string("phone");
//     table.string("status").defaultTo("new");
//     table.timestamps(true, true);
//   });

//   // Contacts
//   await transaction.schema.withSchema(schemaName).createTable("contacts", (table) => {
//     table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//     table.string("first_name");
//     table.string("last_name");
//     table.string("email");
//     table.string("phone");
//     table.string("company");
//     table.timestamps(true, true);
//   });

//   // Deals
//   await transaction.schema.withSchema(schemaName).createTable("deals", (table) => {
//     table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//     table.string("name").notNullable();
//     table.uuid("lead_id").references("id").inTable(`${schemaName}.leads`);
//     table.uuid("contact_id").references("id").inTable(`${schemaName}.contacts`);
//     table.decimal("value", 12, 2).defaultTo(0);
//     table.string("stage").defaultTo("prospecting");
//     table.string("status").defaultTo("open");
//     table.uuid("owner_id").references("id").inTable(`${schemaName}.users`);
//     table.timestamp("expected_close_date");
//     table.timestamps(true, true);
//   });

//   // Products
//   await transaction.schema.withSchema(schemaName).createTable("products", (table) => {
//     table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//     table.string("name").notNullable();
//     table.text("description");
//     table.decimal("price", 12, 2).defaultTo(0);
//     table.timestamps(true, true);
//   });

//   // Quotes
//   await transaction.schema.withSchema(schemaName).createTable("quotes", (table) => {
//     table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//     table.uuid("lead_id").references("id").inTable(`${schemaName}.leads`);
//     table.uuid("product_id").references("id").inTable(`${schemaName}.products`);
//     table.decimal("amount", 12, 2).defaultTo(0);
//     table.string("status").defaultTo("draft");
//     table.timestamps(true, true);
//   });

//   // Invoices
//   await transaction.schema.withSchema(schemaName).createTable("invoices", (table) => {
//     table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//     table.uuid("quote_id").references("id").inTable(`${schemaName}.quotes`);
//     table.decimal("total_amount", 12, 2).defaultTo(0);
//     table.string("status").defaultTo("pending");
//     table.timestamps(true, true);
//   });

//   // Activities (tasks, calls, meetings)
//   await transaction.schema.withSchema(schemaName).createTable("activities", (table) => {
//     table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//     table.string("type"); // task, call, meeting
//     table.string("title").notNullable();
//     table.text("description");
//     table.timestamp("start_time");
//     table.timestamp("end_time");
//     table.uuid("assigned_to").references("id").inTable(`${schemaName}.users`);
//     table.string("status").defaultTo("pending");
//     table.timestamps(true, true);
//   });

//   // Notes
//   await transaction.schema.withSchema(schemaName).createTable("notes", (table) => {
//     table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//     table.string("entity_type");
//     table.uuid("entity_id");
//     table.text("content");
//     table.uuid("created_by").references("id").inTable(`${schemaName}.users`);
//     table.timestamps(true, true);
//   });

//   // Files
//   await transaction.schema.withSchema(schemaName).createTable("files", (table) => {
//     table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//     table.string("file_name").notNullable();
//     table.string("file_url").notNullable();
//     table.string("entity_type");
//     table.uuid("entity_id");
//     table.uuid("uploaded_by").references("id").inTable(`${schemaName}.users`);
//     table.timestamps(true, true);
//   });

//   // Custom Modules
//   await transaction.schema.withSchema(schemaName).createTable("custom_modules", (table) => {
//     table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//     table.string("name").notNullable();
//     table.jsonb("settings").defaultTo("{}");
//     table.timestamps(true, true);
//   });

//   // Custom Fields
//   await transaction.schema.withSchema(schemaName).createTable("custom_fields", (table) => {
//     table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//     table.uuid("module_id").references("id").inTable(`${schemaName}.custom_modules`);
//     table.string("name").notNullable();
//     table.string("type").notNullable();
//     table.jsonb("settings").defaultTo("{}");
//     table.timestamps(true, true);
//   });

//   // -----------------------------
//   // 3. INDUSTRY-SPECIFIC TABLES
//   // -----------------------------
//   if (industryType === "healthcare") {
//     await transaction.schema.withSchema(schemaName).createTable("patients", (table) => {
//       table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//       table.string("name").notNullable();
//       table.string("email");
//       table.string("phone");
//       table.date("dob");
//       table.timestamps(true, true);
//     });

//     await transaction.schema.withSchema(schemaName).createTable("appointments", (table) => {
//       table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//       table.uuid("patient_id").references("id").inTable(`${schemaName}.patients`);
//       table.uuid("doctor_id").references("id").inTable(`${schemaName}.users`);
//       table.timestamp("appointment_time");
//       table.string("status").defaultTo("scheduled");
//       table.timestamps(true, true);
//     });
//   } else if (industryType === "real_estate") {
//     await transaction.schema.withSchema(schemaName).createTable("properties", (table) => {
//       table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//       table.string("name").notNullable();
//       table.string("location");
//       table.decimal("price", 12, 2);
//       table.timestamps(true, true);
//     });

//     await transaction.schema.withSchema(schemaName).createTable("site_visits", (table) => {
//       table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//       table.uuid("property_id").references("id").inTable(`${schemaName}.properties`);
//       table.uuid("visited_by").references("id").inTable(`${schemaName}.users`);
//       table.timestamp("visit_time");
//       table.timestamps(true, true);
//     });
//   }

//   // -----------------------------
//   // 4. COMMUNICATION SUITE TABLES
//   // -----------------------------
//   // Calls
//   await transaction.schema.withSchema(schemaName).createTable("calls", (table) => {
//     table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//     table.string("caller");
//     table.string("callee");
//     table.string("status");
//     table.timestamp("started_at");
//     table.timestamp("ended_at");
//     table.timestamps(true, true);
//   });

//   await transaction.schema.withSchema(schemaName).createTable("call_recordings", (table) => {
//     table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//     table.uuid("call_id").references("id").inTable(`${schemaName}.calls`);
//     table.string("file_url");
//     table.timestamps(true, true);
//   });

//   await transaction.schema.withSchema(schemaName).createTable("ivr_flows", (table) => {
//     table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//     table.string("name");
//     table.jsonb("flow").defaultTo("{}");
//     table.timestamps(true, true);
//   });

//   // WhatsApp
//   await transaction.schema.withSchema(schemaName).createTable("wa_campaigns", (table) => {
//     table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//     table.string("name");
//     table.jsonb("recipients").defaultTo("[]");
//     table.timestamps(true, true);
//   });
//   await transaction.schema.withSchema(schemaName).createTable("wa_templates", (table) => {
//     table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//     table.string("name");
//     table.string("content");
//     table.timestamps(true, true);
//   });
//   await transaction.schema.withSchema(schemaName).createTable("wa_logs", (table) => {
//     table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//     table.uuid("campaign_id").references("id").inTable(`${schemaName}.wa_campaigns`);
//     table.string("status");
//     table.timestamps(true, true);
//   });

//   // Email
//   await transaction.schema.withSchema(schemaName).createTable("email_campaigns", (table) => {
//     table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//     table.string("name");
//     table.timestamps(true, true);
//   });
//   await transaction.schema.withSchema(schemaName).createTable("email_templates", (table) => {
//     table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//     table.string("name");
//     table.text("content");
//     table.timestamps(true, true);
//   });
//   await transaction.schema.withSchema(schemaName).createTable("email_logs", (table) => {
//     table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//     table.uuid("campaign_id").references("id").inTable(`${schemaName}.email_campaigns`);
//     table.string("status");
//     table.timestamps(true, true);
//   });

//   // SMS
//   await transaction.schema.withSchema(schemaName).createTable("sms_campaigns", (table) => {
//     table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//     table.string("name");
//     table.timestamps(true, true);
//   });
//   await transaction.schema.withSchema(schemaName).createTable("sms_templates", (table) => {
//     table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//     table.string("name");
//     table.text("content");
//     table.timestamps(true, true);
//   });
//   await transaction.schema.withSchema(schemaName).createTable("sms_logs", (table) => {
//     table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//     table.uuid("campaign_id").references("id").inTable(`${schemaName}.sms_campaigns`);
//     table.string("status");
//     table.timestamps(true, true);
//   });
// }

// // tenantSchema.js (add this below createTenantSchema)

// export async function dropTenantSchema(schemaName, trx) {
//   const transaction = trx || knex;

//   // -----------------------------
//   // 1. DROP COMMUNICATION SUITE TABLES
//   // -----------------------------
//   const commTables = [
//     "sms_logs",
//     "sms_templates",
//     "sms_campaigns",
//     "email_logs",
//     "email_templates",
//     "email_campaigns",
//     "wa_logs",
//     "wa_templates",
//     "wa_campaigns",
//     "ivr_flows",
//     "call_recordings",
//     "calls",
//   ];

//   for (const table of commTables) {
//     await transaction.schema.withSchema(schemaName).dropTableIfExists(table);
//   }

//   // -----------------------------
//   // 2. DROP INDUSTRY-SPECIFIC TABLES
//   // -----------------------------
//   // For healthcare
//   await transaction.schema.withSchema(schemaName).dropTableIfExists("appointments");
//   await transaction.schema.withSchema(schemaName).dropTableIfExists("patients");

//   // For real estate
//   await transaction.schema.withSchema(schemaName).dropTableIfExists("site_visits");
//   await transaction.schema.withSchema(schemaName).dropTableIfExists("properties");

//   // -----------------------------
//   // 3. DROP CUSTOM MODULES AND FIELDS
//   // -----------------------------
//   await transaction.schema.withSchema(schemaName).dropTableIfExists("custom_fields");
//   await transaction.schema.withSchema(schemaName).dropTableIfExists("custom_modules");

//   // -----------------------------
//   // 4. DROP CORE CRM TABLES
//   // -----------------------------
//   const coreTables = [
//     "files",
//     "notes",
//     "activities",
//     "invoices",
//     "quotes",
//     "deals",
//     "products",
//     "contacts",
//     "leads",
//     "users",
//   ];

//   for (const table of coreTables) {
//     await transaction.schema.withSchema(schemaName).dropTableIfExists(table);
//   }

//   // -----------------------------
//   // 5. DROP SCHEMA ITSELF
//   // -----------------------------
//   await transaction.raw(`DROP SCHEMA IF EXISTS ${schemaName} CASCADE`);
// }

// tenantSchema.js
// import { knex } from "./knex.js";

// /**
//  * Creates a full tenant schema with core CRM, deals, industry modules, communication suite, and custom modules.
//  * @param {string} schemaName - The schema name for the tenant
//  * @param {string} industryType - Industry type (used to load industry-specific tables)
//  * @param {object} trx - Optional transaction object
//  */
// export async function createTenantSchema(schemaName, industryType, trx) {
//   const transaction = trx || knex;

//   await transaction.transaction(async (trx) => {
//     // -----------------------------
//     // 1. CREATE SCHEMA
//     // -----------------------------
//     await trx.raw(`CREATE SCHEMA IF NOT EXISTS ${schemaName}`);

//     // -----------------------------
//     // 2. CORE CRM TABLES
//     // -----------------------------

//     // Users
//     await trx.schema.withSchema(schemaName).createTable("users", (table) => {
//       table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//       table.string("name").notNullable();
//       table.string("email").notNullable().unique();
//       table.string("password").notNullable();
//       table.string("role").defaultTo("employee");
//       table.boolean("is_active").defaultTo(true);
//       table.timestamps(true, true);
//     });

//     // Leads
//     await trx.schema.withSchema(schemaName).createTable("leads", (table) => {
//       table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//       table.string("name").notNullable();
//       table.string("email");
//       table.string("phone");
//       table.string("status").defaultTo("new");
//       table.timestamps(true, true);
//     });

//     // Contacts
//     await trx.schema.withSchema(schemaName).createTable("contacts", (table) => {
//       table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//       table.string("first_name");
//       table.string("last_name");
//       table.string("email");
//       table.string("phone");
//       table.string("company");
//       table.timestamps(true, true);
//     });

//     // Deals / Sales
//     await trx.schema.withSchema(schemaName).createTable("deals", (table) => {
//       table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//       table.string("name").notNullable();
//       table.uuid("lead_id").references("id").inTable(`${schemaName}.leads`).onDelete("SET NULL");
//       table.uuid("contact_id").references("id").inTable(`${schemaName}.contacts`).onDelete("SET NULL");
//       table.decimal("value", 12, 2).defaultTo(0);
//       table.string("stage").defaultTo("prospecting");
//       table.string("status").defaultTo("open");
//       table.uuid("owner_id").references("id").inTable(`${schemaName}.users`).onDelete("SET NULL");
//       table.timestamp("expected_close_date");
//       table.timestamps(true, true);
//     });

//     // Products
//     await trx.schema.withSchema(schemaName).createTable("products", (table) => {
//       table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//       table.string("name").notNullable();
//       table.text("description");
//       table.decimal("price", 12, 2).defaultTo(0);
//       table.timestamps(true, true);
//     });

//     // Quotes
//     await trx.schema.withSchema(schemaName).createTable("quotes", (table) => {
//       table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//       table.uuid("lead_id").references("id").inTable(`${schemaName}.leads`).onDelete("SET NULL");
//       table.uuid("product_id").references("id").inTable(`${schemaName}.products`).onDelete("SET NULL");
//       table.decimal("amount", 12, 2).defaultTo(0);
//       table.string("status").defaultTo("draft");
//       table.timestamps(true, true);
//     });

//     // Invoices
//     await trx.schema.withSchema(schemaName).createTable("invoices", (table) => {
//       table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//       table.uuid("quote_id").references("id").inTable(`${schemaName}.quotes`).onDelete("SET NULL");
//       table.decimal("total_amount", 12, 2).defaultTo(0);
//       table.string("status").defaultTo("pending");
//       table.timestamps(true, true);
//     });

//     // Activities
//     await trx.schema.withSchema(schemaName).createTable("activities", (table) => {
//       table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//       table.string("type"); // task, call, meeting
//       table.string("title").notNullable();
//       table.text("description");
//       table.timestamp("start_time");
//       table.timestamp("end_time");
//       table.uuid("assigned_to").references("id").inTable(`${schemaName}.users`).onDelete("SET NULL");
//       table.string("status").defaultTo("pending");
//       table.timestamps(true, true);
//     });

//     // Notes
//     await trx.schema.withSchema(schemaName).createTable("notes", (table) => {
//       table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//       table.string("entity_type");
//       table.uuid("entity_id");
//       table.text("content");
//       table.uuid("created_by").references("id").inTable(`${schemaName}.users`).onDelete("SET NULL");
//       table.timestamps(true, true);
//     });

//     // Files
//     await trx.schema.withSchema(schemaName).createTable("files", (table) => {
//       table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//       table.string("file_name").notNullable();
//       table.string("file_url").notNullable();
//       table.string("entity_type");
//       table.uuid("entity_id");
//       table.uuid("uploaded_by").references("id").inTable(`${schemaName}.users`).onDelete("SET NULL");
//       table.timestamps(true, true);
//     });

//     // Custom Modules
//     await trx.schema.withSchema(schemaName).createTable("custom_modules", (table) => {
//       table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//       table.string("name").notNullable();
//       table.jsonb("settings").defaultTo("{}");
//       table.timestamps(true, true);
//     });

//     // Custom Fields
//     await trx.schema.withSchema(schemaName).createTable("custom_fields", (table) => {
//       table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//       table.uuid("module_id").references("id").inTable(`${schemaName}.custom_modules`).onDelete("CASCADE");
//       table.string("name").notNullable();
//       table.string("type").notNullable();
//       table.jsonb("settings").defaultTo("{}");
//       table.timestamps(true, true);
//     });

//     // -----------------------------
//     // 3. INDUSTRY-SPECIFIC TABLES
//     // -----------------------------
//     if (industryType === "healthcare") {
//       await trx.schema.withSchema(schemaName).createTable("patients", (table) => {
//         table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//         table.string("name").notNullable();
//         table.string("email");
//         table.string("phone");
//         table.date("dob");
//         table.timestamps(true, true);
//       });

//       await trx.schema.withSchema(schemaName).createTable("appointments", (table) => {
//         table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//         table.uuid("patient_id").references("id").inTable(`${schemaName}.patients`).onDelete("SET NULL");
//         table.uuid("doctor_id").references("id").inTable(`${schemaName}.users`).onDelete("SET NULL");
//         table.timestamp("appointment_time");
//         table.string("status").defaultTo("scheduled");
//         table.timestamps(true, true);
//       });
//     } else if (industryType === "real_estate") {
//       await trx.schema.withSchema(schemaName).createTable("properties", (table) => {
//         table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//         table.string("name").notNullable();
//         table.string("location");
//         table.decimal("price", 12, 2);
//         table.timestamps(true, true);
//       });

//       await trx.schema.withSchema(schemaName).createTable("site_visits", (table) => {
//         table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//         table.uuid("property_id").references("id").inTable(`${schemaName}.properties`).onDelete("SET NULL");
//         table.uuid("visited_by").references("id").inTable(`${schemaName}.users`).onDelete("SET NULL");
//         table.timestamp("visit_time");
//         table.timestamps(true, true);
//       });
//     }

//     // -----------------------------
//     // 4. COMMUNICATION SUITE TABLES
//     // -----------------------------
//     const commTables = [
//       // Calls
//       ["calls", (table) => {
//         table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//         table.string("caller");
//         table.string("callee");
//         table.string("status");
//         table.timestamp("started_at");
//         table.timestamp("ended_at");
//         table.timestamps(true, true);
//       }],
//       ["call_recordings", (table) => {
//         table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//         table.uuid("call_id").references("id").inTable(`${schemaName}.calls`).onDelete("CASCADE");
//         table.string("file_url");
//         table.timestamps(true, true);
//       }],
//       ["ivr_flows", (table) => {
//         table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//         table.string("name");
//         table.jsonb("flow").defaultTo("{}");
//         table.timestamps(true, true);
//       }],
//       // WhatsApp
//       ["wa_campaigns", (table) => { table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary(); table.string("name"); table.jsonb("recipients").defaultTo("[]"); table.timestamps(true, true); }],
//       ["wa_templates", (table) => { table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary(); table.string("name"); table.string("content"); table.timestamps(true, true); }],
//       ["wa_logs", (table) => { table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary(); table.uuid("campaign_id").references("id").inTable(`${schemaName}.wa_campaigns`).onDelete("CASCADE"); table.string("status"); table.timestamps(true, true); }],
//       // Email
//       ["email_campaigns", (table) => { table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary(); table.string("name"); table.timestamps(true, true); }],
//       ["email_templates", (table) => { table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary(); table.string("name"); table.text("content"); table.timestamps(true, true); }],
//       ["email_logs", (table) => { table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary(); table.uuid("campaign_id").references("id").inTable(`${schemaName}.email_campaigns`).onDelete("CASCADE"); table.string("status"); table.timestamps(true, true); }],
//       // SMS
//       ["sms_campaigns", (table) => { table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary(); table.string("name"); table.timestamps(true, true); }],
//       ["sms_templates", (table) => { table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary(); table.string("name"); table.text("content"); table.timestamps(true, true); }],
//       ["sms_logs", (table) => { table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary(); table.uuid("campaign_id").references("id").inTable(`${schemaName}.sms_campaigns`).onDelete("CASCADE"); table.string("status"); table.timestamps(true, true); }],
//     ];

//     for (const [name, builder] of commTables) {
//       await trx.schema.withSchema(schemaName).createTable(name, builder);
//     }
//   });
// }

// /**
//  * Drops a tenant schema completely
//  * @param {string} schemaName
//  * @param {object} trx
//  */
// export async function dropTenantSchema(schemaName, trx) {
//   const transaction = trx || knex;

//   await transaction.transaction(async (trx) => {
//     const tables = [
//       // Communication
//       "sms_logs","sms_templates","sms_campaigns",
//       "email_logs","email_templates","email_campaigns",
//       "wa_logs","wa_templates","wa_campaigns",
//       "ivr_flows","call_recordings","calls",
//       // Industry
//       "appointments","patients","site_visits","properties",
//       // Custom
//       "custom_fields","custom_modules",
//       // Core
//       "files","notes","activities","invoices","quotes","deals","products","contacts","leads","users"
//     ];

//     for (const table of tables) {
//       await trx.schema.withSchema(schemaName).dropTableIfExists(table);
//     }

//     await trx.raw(`DROP SCHEMA IF EXISTS ${schemaName} CASCADE`);
//   });
// }

// // /db/tenantSchema.js
// import { knex } from "./knex.js";

// /**
//  * Creates a full tenant schema with core CRM, industry modules, communication suite, and custom modules.
//  * @param {string} schemaName - The schema name for the tenant
//  * @param {string} industryType - Industry type (used to load industry-specific tables)
//  * @param {object} trx - Optional transaction object
//  */
// export async function createTenantSchema(schemaName, industryType, trx) {
//   const transaction = trx || knex;

//   // -----------------------------
//   // 1. CREATE SCHEMA
//   // -----------------------------
//   await transaction.raw(`CREATE SCHEMA IF NOT EXISTS ${schemaName}`);

//   // -----------------------------
//   // 2. CORE CRM TABLES
//   // -----------------------------

//   // Users
//   await transaction.schema.withSchema(schemaName).createTable("users", (table) => {
//     table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//     table.string("name").notNullable();
//     table.string("email").notNullable().unique();
//     table.string("password").notNullable();
//     table.string("role").defaultTo("employee");
//     table.boolean("is_active").defaultTo(true);
//     // 🔥 NEW FIELDS FOR FIRST LOGIN
//     table.boolean("force_password_change").defaultTo(true);
//     table.timestamp("last_password_change_at");
//     table.timestamps(true, true);
//   });

//   // Leads
//   await transaction.schema.withSchema(schemaName).createTable("leads", (table) => {
//     table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//     table.string("name").notNullable();
//     table.string("email");
//     table.string("phone");
//     table.string("status").defaultTo("new");
//     table.timestamps(true, true);
//   });

//   // Contacts
//   await transaction.schema.withSchema(schemaName).createTable("contacts", (table) => {
//     table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//     table.string("first_name");
//     table.string("last_name");
//     table.string("email");
//     table.string("phone");
//     table.string("company");
//     table.timestamps(true, true);
//   });

//   // Deals
//   await transaction.schema.withSchema(schemaName).createTable("deals", (table) => {
//     table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//     table.string("name").notNullable();
//     table.uuid("lead_id").references("id").inTable(`${schemaName}.leads`);
//     table.uuid("contact_id").references("id").inTable(`${schemaName}.contacts`);
//     table.decimal("value", 12, 2).defaultTo(0);
//     table.string("stage").defaultTo("prospecting");
//     table.string("status").defaultTo("open");
//     table.uuid("owner_id").references("id").inTable(`${schemaName}.users`);
//     table.timestamp("expected_close_date");
//     table.timestamps(true, true);
//   });

//   // Products
//   await transaction.schema.withSchema(schemaName).createTable("products", (table) => {
//     table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//     table.string("name").notNullable();
//     table.text("description");
//     table.decimal("price", 12, 2).defaultTo(0);
//     table.timestamps(true, true);
//   });

//   // Quotes
//   await transaction.schema.withSchema(schemaName).createTable("quotes", (table) => {
//     table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//     table.uuid("lead_id").references("id").inTable(`${schemaName}.leads`);
//     table.uuid("product_id").references("id").inTable(`${schemaName}.products`);
//     table.decimal("amount", 12, 2).defaultTo(0);
//     table.string("status").defaultTo("draft");
//     table.timestamps(true, true);
//   });

//   // Invoices
//   await transaction.schema.withSchema(schemaName).createTable("invoices", (table) => {
//     table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//     table.uuid("quote_id").references("id").inTable(`${schemaName}.quotes`);
//     table.decimal("total_amount", 12, 2).defaultTo(0);
//     table.string("status").defaultTo("pending");
//     table.timestamps(true, true);
//   });

//   // Activities
//   await transaction.schema.withSchema(schemaName).createTable("activities", (table) => {
//     table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//     table.string("type"); // task, call, meeting
//     table.string("title").notNullable();
//     table.text("description");
//     table.timestamp("start_time");
//     table.timestamp("end_time");
//     table.uuid("assigned_to").references("id").inTable(`${schemaName}.users`);
//     table.string("status").defaultTo("pending");
//     table.timestamps(true, true);
//   });

//   // Notes
//   await transaction.schema.withSchema(schemaName).createTable("notes", (table) => {
//     table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//     table.string("entity_type");
//     table.uuid("entity_id");
//     table.text("content");
//     table.uuid("created_by").references("id").inTable(`${schemaName}.users`);
//     table.timestamps(true, true);
//   });

//   // Files
//   await transaction.schema.withSchema(schemaName).createTable("files", (table) => {
//     table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//     table.string("file_name").notNullable();
//     table.string("file_url").notNullable();
//     table.string("entity_type");
//     table.uuid("entity_id");
//     table.uuid("uploaded_by").references("id").inTable(`${schemaName}.users`);
//     table.timestamps(true, true);
//   });

//   // Custom Modules
//   await transaction.schema.withSchema(schemaName).createTable("custom_modules", (table) => {
//     table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//     table.string("name").notNullable();
//     table.jsonb("settings").defaultTo("{}");
//     table.timestamps(true, true);
//   });

//   // Custom Fields
//   await transaction.schema.withSchema(schemaName).createTable("custom_fields", (table) => {
//     table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//     table.uuid("module_id").references("id").inTable(`${schemaName}.custom_modules`);
//     table.string("name").notNullable();
//     table.string("type").notNullable();
//     table.jsonb("settings").defaultTo("{}");
//     table.timestamps(true, true);
//   });

//   // -----------------------------
//   // 3. INDUSTRY-SPECIFIC TABLES
//   // -----------------------------
//   if (industryType === "healthcare") {
//     await transaction.schema.withSchema(schemaName).createTable("patients", (table) => {
//       table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//       table.string("name").notNullable();
//       table.string("email");
//       table.string("phone");
//       table.date("dob");
//       table.timestamps(true, true);
//     });
//     await transaction.schema.withSchema(schemaName).createTable("appointments", (table) => {
//       table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//       table.uuid("patient_id").references("id").inTable(`${schemaName}.patients`);
//       table.uuid("doctor_id").references("id").inTable(`${schemaName}.users`);
//       table.timestamp("appointment_time");
//       table.string("status").defaultTo("scheduled");
//       table.timestamps(true, true);
//     });
//   } else if (industryType === "real_estate") {
//     await transaction.schema.withSchema(schemaName).createTable("properties", (table) => {
//       table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//       table.string("name").notNullable();
//       table.string("location");
//       table.decimal("price", 12, 2);
//       table.timestamps(true, true);
//     });
//     await transaction.schema.withSchema(schemaName).createTable("site_visits", (table) => {
//       table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//       table.uuid("property_id").references("id").inTable(`${schemaName}.properties`);
//       table.uuid("visited_by").references("id").inTable(`${schemaName}.users`);
//       table.timestamp("visit_time");
//       table.timestamps(true, true);
//     });
//   }

//   // -----------------------------
//   // 4. COMMUNICATION SUITE TABLES
//   // -----------------------------
//   const commTables = [
//     {
//       name: "calls",
//       columns: (table) => {
//         table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//         table.string("caller");
//         table.string("callee");
//         table.string("status");
//         table.timestamp("started_at");
//         table.timestamp("ended_at");
//         table.timestamps(true, true);
//       },
//     },
//     {
//       name: "call_recordings",
//       columns: (table) => {
//         table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//         table.uuid("call_id").references("id").inTable(`${schemaName}.calls`);
//         table.string("file_url");
//         table.timestamps(true, true);
//       },
//     },
//     {
//       name: "ivr_flows",
//       columns: (table) => {
//         table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//         table.string("name");
//         table.jsonb("flow").defaultTo("{}");
//         table.timestamps(true, true);
//       },
//     },
//     {
//       name: "wa_campaigns",
//       columns: (table) => {
//         table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//         table.string("name");
//         table.jsonb("recipients").defaultTo("[]");
//         table.timestamps(true, true);
//       },
//     },
//     {
//       name: "wa_templates",
//       columns: (table) => {
//         table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//         table.string("name");
//         table.string("content");
//         table.timestamps(true, true);
//       },
//     },
//     {
//       name: "wa_logs",
//       columns: (table) => {
//         table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//         table.uuid("campaign_id").references("id").inTable(`${schemaName}.wa_campaigns`);
//         table.string("status");
//         table.timestamps(true, true);
//       },
//     },
//     {
//       name: "email_campaigns",
//       columns: (table) => {
//         table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//         table.string("name");
//         table.timestamps(true, true);
//       },
//     },
//     {
//       name: "email_templates",
//       columns: (table) => {
//         table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//         table.string("name");
//         table.text("content");
//         table.timestamps(true, true);
//       },
//     },
//     {
//       name: "email_logs",
//       columns: (table) => {
//         table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//         table.uuid("campaign_id").references("id").inTable(`${schemaName}.email_campaigns`);
//         table.string("status");
//         table.timestamps(true, true);
//       },
//     },
//     {
//       name: "sms_campaigns",
//       columns: (table) => {
//         table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//         table.string("name");
//         table.timestamps(true, true);
//       },
//     },
//     {
//       name: "sms_templates",
//       columns: (table) => {
//         table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//         table.string("name");
//         table.text("content");
//         table.timestamps(true, true);
//       },
//     },
//     {
//       name: "sms_logs",
//       columns: (table) => {
//         table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//         table.uuid("campaign_id").references("id").inTable(`${schemaName}.sms_campaigns`);
//         table.string("status");
//         table.timestamps(true, true);
//       },
//     },
//   ];

//   for (const t of commTables) {
//     await transaction.schema.withSchema(schemaName).createTable(t.name, t.columns);
//   }
// }

// /**
//  * Drops the entire tenant schema safely.
//  */
// export async function dropTenantSchema(schemaName, trx) {
//   const transaction = trx || knex;

//   // Drop communication suite first
//   const commTables = [
//     "sms_logs", "sms_templates", "sms_campaigns",
//     "email_logs", "email_templates", "email_campaigns",
//     "wa_logs", "wa_templates", "wa_campaigns",
//     "ivr_flows", "call_recordings", "calls",
//   ];
//   for (const table of commTables) await transaction.schema.withSchema(schemaName).dropTableIfExists(table);

//   // Drop industry-specific
//   await transaction.schema.withSchema(schemaName).dropTableIfExists("appointments");
//   await transaction.schema.withSchema(schemaName).dropTableIfExists("patients");
//   await transaction.schema.withSchema(schemaName).dropTableIfExists("site_visits");
//   await transaction.schema.withSchema(schemaName).dropTableIfExists("properties");

//   // Drop custom modules
//   await transaction.schema.withSchema(schemaName).dropTableIfExists("custom_fields");
//   await transaction.schema.withSchema(schemaName).dropTableIfExists("custom_modules");

//   // Drop core CRM tables
//   const coreTables = [
//     "files","notes","activities","invoices","quotes",
//     "deals","products","contacts","leads","users"
//   ];
//   for (const table of coreTables) await transaction.schema.withSchema(schemaName).dropTableIfExists(table);

//   // Drop schema itself
//   await transaction.raw(`DROP SCHEMA IF EXISTS ${schemaName} CASCADE`);
// }


// export async function createDefaultModules(schemaName, trx) {
//   const transaction = trx || knex;

//   // Create a default module, e.g., "Deals"
//   await transaction.schema.withSchema(schemaName).insert({
//     id: knex.raw("uuid_generate_v4()"),
//     name: "Deals",
//     settings: JSON.stringify({ defaultStages: ["prospecting","qualification","closed"] }),
//   }).into(`${schemaName}.custom_modules`);
// }


// import { knex } from "../db/knex.js";

// /**
//  * Creates a full tenant schema with core CRM, industry modules, communication suite, and custom modules.
//  */
// export async function createTenantSchema(schemaName, industryType, trx) {
//   const transaction = trx || knex;

//   await transaction.raw(`CREATE SCHEMA IF NOT EXISTS ${schemaName}`);

//   // CORE CRM TABLES
//   await transaction.schema.withSchema(schemaName).createTable("users", (table) => {
//     table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//     table.string("name").notNullable();
//     table.string("email").notNullable().unique();
//     table.string("password").notNullable();
//     table.string("role").defaultTo("employee");
//     table.boolean("is_active").defaultTo(true);
//     table.timestamps(true, true);
//   });

//   await transaction.schema.withSchema(schemaName).createTable("leads", (table) => {
//     table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//     table.string("name").notNullable();
//     table.string("email");
//     table.string("phone");
//     table.string("status").defaultTo("new");
//     table.timestamps(true, true);
//   });

//   await transaction.schema.withSchema(schemaName).createTable("contacts", (table) => {
//     table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//     table.string("first_name");
//     table.string("last_name");
//     table.string("email");
//     table.string("phone");
//     table.string("company");
//     table.timestamps(true, true);
//   });

//   await transaction.schema.withSchema(schemaName).createTable("deals", (table) => {
//     table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//     table.string("name").notNullable();
//     table.uuid("lead_id").references("id").inTable(`${schemaName}.leads`);
//     table.uuid("contact_id").references("id").inTable(`${schemaName}.contacts`);
//     table.decimal("value", 12, 2).defaultTo(0);
//     table.string("stage").defaultTo("prospecting");
//     table.string("status").defaultTo("open");
//     table.uuid("owner_id").references("id").inTable(`${schemaName}.users`);
//     table.timestamp("expected_close_date");
//     table.timestamps(true, true);
//   });

//   await transaction.schema.withSchema(schemaName).createTable("products", (table) => {
//     table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//     table.string("name").notNullable();
//     table.text("description");
//     table.decimal("price", 12, 2).defaultTo(0);
//     table.timestamps(true, true);
//   });

//   await transaction.schema.withSchema(schemaName).createTable("quotes", (table) => {
//     table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//     table.uuid("lead_id").references("id").inTable(`${schemaName}.leads`);
//     table.uuid("product_id").references("id").inTable(`${schemaName}.products`);
//     table.decimal("amount", 12, 2).defaultTo(0);
//     table.string("status").defaultTo("draft");
//     table.timestamps(true, true);
//   });

//   await transaction.schema.withSchema(schemaName).createTable("invoices", (table) => {
//     table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//     table.uuid("quote_id").references("id").inTable(`${schemaName}.quotes`);
//     table.decimal("total_amount", 12, 2).defaultTo(0);
//     table.string("status").defaultTo("pending");
//     table.timestamps(true, true);
//   });

//   await transaction.schema.withSchema(schemaName).createTable("activities", (table) => {
//     table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//     table.string("type");
//     table.string("title").notNullable();
//     table.text("description");
//     table.timestamp("start_time");
//     table.timestamp("end_time");
//     table.uuid("assigned_to").references("id").inTable(`${schemaName}.users`);
//     table.string("status").defaultTo("pending");
//     table.timestamps(true, true);
//   });

//   await transaction.schema.withSchema(schemaName).createTable("notes", (table) => {
//     table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//     table.string("entity_type");
//     table.uuid("entity_id");
//     table.text("content");
//     table.uuid("created_by").references("id").inTable(`${schemaName}.users`);
//     table.timestamps(true, true);
//   });

//   await transaction.schema.withSchema(schemaName).createTable("files", (table) => {
//     table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//     table.string("file_name").notNullable();
//     table.string("file_url").notNullable();
//     table.string("entity_type");
//     table.uuid("entity_id");
//     table.uuid("uploaded_by").references("id").inTable(`${schemaName}.users`);
//     table.timestamps(true, true);
//   });

//   // CUSTOM MODULES
//   await transaction.schema.withSchema(schemaName).createTable("custom_modules", (table) => {
//     table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//     table.string("name").notNullable();
//     table.jsonb("settings").defaultTo("{}");
//     table.timestamps(true, true);
//   });

//   await transaction.schema.withSchema(schemaName).createTable("custom_fields", (table) => {
//     table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//     table.uuid("module_id").references("id").inTable(`${schemaName}.custom_modules`);
//     table.string("name").notNullable();
//     table.string("type").notNullable();
//     table.jsonb("settings").defaultTo("{}");
//     table.timestamps(true, true);
//   });

//   // INDUSTRY SPECIFIC
//   if (industryType === "healthcare") {
//     await transaction.schema.withSchema(schemaName).createTable("patients", (table) => {
//       table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//       table.string("name").notNullable();
//       table.string("email");
//       table.string("phone");
//       table.date("dob");
//       table.timestamps(true, true);
//     });

//     await transaction.schema.withSchema(schemaName).createTable("appointments", (table) => {
//       table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//       table.uuid("patient_id").references("id").inTable(`${schemaName}.patients`);
//       table.uuid("doctor_id").references("id").inTable(`${schemaName}.users`);
//       table.timestamp("appointment_time");
//       table.string("status").defaultTo("scheduled");
//       table.timestamps(true, true);
//     });
//   }

//   if (industryType === "real_estate") {
//     await transaction.schema.withSchema(schemaName).createTable("properties", (table) => {
//       table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//       table.string("name").notNullable();
//       table.string("location");
//       table.decimal("price", 12, 2);
//       table.timestamps(true, true);
//     });

//     await transaction.schema.withSchema(schemaName).createTable("site_visits", (table) => {
//       table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//       table.uuid("property_id").references("id").inTable(`${schemaName}.properties`);
//       table.uuid("visited_by").references("id").inTable(`${schemaName}.users`);
//       table.timestamp("visit_time");
//       table.timestamps(true, true);
//     });
//   }
// }

// /**
//  * Drops full tenant schema.
//  */
// export async function dropTenantSchema(schemaName, trx) {
//   const transaction = trx || knex;

//   const commTables = [
//     "sms_logs", "sms_templates", "sms_campaigns",
//     "email_logs", "email_templates", "email_campaigns",
//     "wa_logs", "wa_templates", "wa_campaigns",
//     "ivr_flows", "call_recordings", "calls",
//   ];

//   for (const t of commTables) {
//     await transaction.schema.withSchema(schemaName).dropTableIfExists(t);
//   }

//   await transaction.schema.withSchema(schemaName).dropTableIfExists("appointments");
//   await transaction.schema.withSchema(schemaName).dropTableIfExists("patients");
//   await transaction.schema.withSchema(schemaName).dropTableIfExists("site_visits");
//   await transaction.schema.withSchema(schemaName).dropTableIfExists("properties");

//   await transaction.schema.withSchema(schemaName).dropTableIfExists("custom_fields");
//   await transaction.schema.withSchema(schemaName).dropTableIfExists("custom_modules");

//   const core = [
//     "files", "notes", "activities", "invoices",
//     "quotes", "deals", "products", "contacts", 
//     "leads", "users"
//   ];

//   for (const t of core) {
//     await transaction.schema.withSchema(schemaName).dropTableIfExists(t);
//   }

//   await transaction.raw(`DROP SCHEMA IF EXISTS ${schemaName} CASCADE`);
// }

// /**
//  * Creates default modules
//  */
// export async function createDefaultModules(schemaName, trx) {
//   const transaction = trx || knex;

//   await transaction(`${schemaName}.custom_modules`).insert({
//     id: knex.raw("uuid_generate_v4()"),
//     name: "Deals",
//     settings: JSON.stringify({
//       defaultStages: ["prospecting", "qualification", "closed"]
//     }),
//   });
// }


// import { knex } from "../db/knex.js";

// /**
//  * Creates a full tenant schema including:
//  * - Core CRM
//  * - RBAC (roles, permissions)
//  * - Custom modules
//  * - Industry modules
//  */
// export async function createTenantSchema(schemaName, industryType, trx) {
//   const transaction = trx || knex;

//   await transaction.raw(`CREATE SCHEMA IF NOT EXISTS ${schemaName}`);

//   // -------------------------------------
//   // ROLES (Tenant-level RBAC)
//   // -------------------------------------
//   await transaction.schema.withSchema(schemaName).createTable("roles", (table) => {
//     table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//     table.string("name").notNullable().unique();
//     table.string("description");
//     table.timestamps(true, true);
//   });

//   await transaction.schema.withSchema(schemaName).createTable("permissions", (table) => {
//     table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//     table.string("key").notNullable().unique();        // e.g. leads.create
//     table.string("module").notNullable();              // e.g. leads
//     table.string("description");
//     table.timestamps(true, true);
//   });

//   await transaction.schema.withSchema(schemaName).createTable("role_permissions", (table) => {
//     table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//     table.uuid("role_id")
//       .references("id")
//       .inTable(`${schemaName}.roles`)
//       .onDelete("CASCADE");
//     table.uuid("permission_id")
//       .references("id")
//       .inTable(`${schemaName}.permissions`)
//       .onDelete("CASCADE");
//     table.timestamps(true, true);
//   });

//   // -------------------------------------
//   // CORE CRM
//   // -------------------------------------
//   await transaction.schema.withSchema(schemaName).createTable("users", (table) => {
//     table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//     table.string("name").notNullable();
//     table.string("email").notNullable().unique();
//     table.string("password").notNullable();
//     table.uuid("role_id")
//       .references("id")
//       .inTable(`${schemaName}.roles`)
//       .onDelete("SET NULL");
//     table.boolean("is_active").defaultTo(true);
//     table.timestamps(true, true);
//   });

//   await transaction.schema.withSchema(schemaName).createTable("leads", (table) => {
//     table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//     table.string("name").notNullable();
//     table.string("email");
//     table.string("phone");
//     table.string("status").defaultTo("new");
//     table.timestamps(true, true);
//   });

//   await transaction.schema.withSchema(schemaName).createTable("contacts", (table) => {
//     table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//     table.string("first_name");
//     table.string("last_name");
//     table.string("email");
//     table.string("phone");
//     table.string("company");
//     table.timestamps(true, true);
//   });

//   await transaction.schema.withSchema(schemaName).createTable("deals", (table) => {
//     table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//     table.string("name").notNullable();
//     table.uuid("lead_id").references("id").inTable(`${schemaName}.leads`);
//     table.uuid("contact_id").references("id").inTable(`${schemaName}.contacts`);
//     table.decimal("value", 12, 2).defaultTo(0);
//     table.string("stage").defaultTo("prospecting");
//     table.string("status").defaultTo("open");
//     table.uuid("owner_id").references("id").inTable(`${schemaName}.users`);
//     table.timestamp("expected_close_date");
//     table.timestamps(true, true);
//   });

//   await transaction.schema.withSchema(schemaName).createTable("products", (table) => {
//     table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//     table.string("name").notNullable();
//     table.text("description");
//     table.decimal("price", 12, 2).defaultTo(0);
//     table.timestamps(true, true);
//   });

//   await transaction.schema.withSchema(schemaName).createTable("quotes", (table) => {
//     table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//     table.uuid("lead_id").references("id").inTable(`${schemaName}.leads`);
//     table.uuid("product_id").references("id").inTable(`${schemaName}.products`);
//     table.decimal("amount", 12, 2).defaultTo(0);
//     table.string("status").defaultTo("draft");
//     table.timestamps(true, true);
//   });

//   await transaction.schema.withSchema(schemaName).createTable("invoices", (table) => {
//     table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//     table.uuid("quote_id").references("id").inTable(`${schemaName}.quotes`);
//     table.decimal("total_amount", 12, 2).defaultTo(0);
//     table.string("status").defaultTo("pending");
//     table.timestamps(true, true);
//   });

//   await transaction.schema.withSchema(schemaName).createTable("activities", (table) => {
//     table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//     table.string("type");
//     table.string("title").notNullable();
//     table.text("description");
//     table.timestamp("start_time");
//     table.timestamp("end_time");
//     table.uuid("assigned_to").references("id").inTable(`${schemaName}.users`);
//     table.string("status").defaultTo("pending");
//     table.timestamps(true, true);
//   });

//   await transaction.schema.withSchema(schemaName).createTable("notes", (table) => {
//     table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//     table.string("entity_type");
//     table.uuid("entity_id");
//     table.text("content");
//     table.uuid("created_by").references("id").inTable(`${schemaName}.users`);
//     table.timestamps(true, true);
//   });

//   await transaction.schema.withSchema(schemaName).createTable("files", (table) => {
//     table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//     table.string("file_name").notNullable();
//     table.string("file_url").notNullable();
//     table.string("entity_type");
//     table.uuid("entity_id");
//     table.uuid("uploaded_by").references("id").inTable(`${schemaName}.users`);
//     table.timestamps(true, true);
//   });

//   // -------------------------------------
//   // CUSTOM MODULES
//   // -------------------------------------
//   await transaction.schema.withSchema(schemaName).createTable("custom_modules", (table) => {
//     table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//     table.string("name").notNullable();
//     table.jsonb("settings").defaultTo("{}");
//     table.timestamps(true, true);
//   });

//   await transaction.schema.withSchema(schemaName).createTable("custom_fields", (table) => {
//     table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//     table.uuid("module_id").references("id").inTable(`${schemaName}.custom_modules`);
//     table.string("name").notNullable();
//     table.string("type").notNullable();
//     table.jsonb("settings").defaultTo("{}");
//     table.timestamps(true, true);
//   });

//   // -------------------------------------
//   // INDUSTRY MODULES
//   // -------------------------------------
//   if (industryType === "healthcare") {
//     await transaction.schema.withSchema(schemaName).createTable("patients", (table) => {
//       table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//       table.string("name").notNullable();
//       table.string("email");
//       table.string("phone");
//       table.date("dob");
//       table.timestamps(true, true);
//     });

//     await transaction.schema.withSchema(schemaName).createTable("appointments", (table) => {
//       table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//       table.uuid("patient_id").references("id").inTable(`${schemaName}.patients`);
//       table.uuid("doctor_id").references("id").inTable(`${schemaName}.users`);
//       table.timestamp("appointment_time");
//       table.string("status").defaultTo("scheduled");
//       table.timestamps(true, true);
//     });
//   }

//   if (industryType === "real_estate") {
//     await transaction.schema.withSchema(schemaName).createTable("properties", (table) => {
//       table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//       table.string("name").notNullable();
//       table.string("location");
//       table.decimal("price", 12, 2);
//       table.timestamps(true, true);
//     });

//     await transaction.schema.withSchema(schemaName).createTable("site_visits", (table) => {
//       table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
//       table.uuid("property_id").references("id").inTable(`${schemaName}.properties`);
//       table.uuid("visited_by").references("id").inTable(`${schemaName}.users`);
//       table.timestamp("visit_time");
//       table.timestamps(true, true);
//     });
//   }

//   // -------------------------------------
//   // SEED DEFAULT ROLE + PERMISSIONS
//   // -------------------------------------
//   const [adminRoleId] = await transaction(`${schemaName}.roles`)
//     .insert({
//       id: knex.raw("uuid_generate_v4()"),
//       name: "tenant_admin",
//       description: "Full access to all modules",
//     })
//     .returning("id");

//   // basic CRM permissions
//   const basePermissions = [
//     { key: "leads.create", module: "leads", description: "Create leads" },
//     { key: "leads.view", module: "leads", description: "View leads" },
//     { key: "leads.update", module: "leads", description: "Update leads" },
//     { key: "leads.delete", module: "leads", description: "Delete leads" },

//     { key: "deals.create", module: "deals", description: "Create deals" },
//     { key: "deals.update", module: "deals", description: "Update deals" },
//     { key: "deals.view", module: "deals", description: "View deals" },
//   ];

//   const permissionIds = await transaction(`${schemaName}.permissions`)
//     .insert(
//       basePermissions.map((p) => ({
//         id: knex.raw("uuid_generate_v4()"),
//         key: p.key,
//         module: p.module,
//         description: p.description,
//       }))
//     )
//     .returning("id");

//   // Assign all permissions to admin
//   const adminRolePermissions = permissionIds.map((p) => ({
//     id: knex.raw("uuid_generate_v4()"),
//     role_id: adminRoleId.id || adminRoleId,
//     permission_id: p.id,
//   }));

//   await transaction(`${schemaName}.role_permissions`).insert(adminRolePermissions);
// }

// /**
//  * Drops full tenant schema.
//  */
// export async function dropTenantSchema(schemaName, trx) {
//   const transaction = trx || knex;

//   const commTables = [
//     "sms_logs", "sms_templates", "sms_campaigns",
//     "email_logs", "email_templates", "email_campaigns",
//     "wa_logs", "wa_templates", "wa_campaigns",
//     "ivr_flows", "call_recordings", "calls",
//   ];

//   for (const t of commTables) {
//     await transaction.schema.withSchema(schemaName).dropTableIfExists(t);
//   }

//   await transaction.schema.withSchema(schemaName).dropTableIfExists("appointments");
//   await transaction.schema.withSchema(schemaName).dropTableIfExists("patients");
//   await transaction.schema.withSchema(schemaName).dropTableIfExists("site_visits");
//   await transaction.schema.withSchema(schemaName).dropTableIfExists("properties");

//   await transaction.schema.withSchema(schemaName).dropTableIfExists("custom_fields");
//   await transaction.schema.withSchema(schemaName).dropTableIfExists("custom_modules");

//   const core = [
//     "files", "notes", "activities", "invoices",
//     "quotes", "deals", "products", "contacts",
//     "leads", "users",
//     "role_permissions", "permissions", "roles",
//   ];

//   for (const t of core) {
//     await transaction.schema.withSchema(schemaName).dropTableIfExists(t);
//   }

//   await transaction.raw(`DROP SCHEMA IF EXISTS ${schemaName} CASCADE`);
// }

// /**
//  * Creates default custom modules (optional)
//  */
// export async function createDefaultModules(schemaName, trx) {
//   const transaction = trx || knex;

//   await transaction(`${schemaName}.custom_modules`).insert({
//     id: knex.raw("uuid_generate_v4()"),
//     name: "Deals",
//     settings: JSON.stringify({
//       defaultStages: ["prospecting", "qualification", "closed"],
//     }),
//   });
// }


// import { knex } from "../db/knex.js";

// /**
//  * Create a full tenant schema including:
//  * - RBAC (roles, permissions, role_permissions)
//  * - Core CRM modules (users, leads, contacts, deals, etc.)
//  * - Custom modules
//  * - Optional industry-specific modules
//  */
// export async function createTenantSchema(schemaName, industryType, trx) {
//   const transaction = trx || knex;

//   // Ensure schema exists
//   await transaction.raw(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`);

//   // -------------------------------------
//   // RBAC: Roles, Permissions, Role_Permissions
//   // -------------------------------------
//   await transaction.schema.withSchema(schemaName).createTable("roles", (table) => {
//     table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
//     table.string("name").notNullable().unique();
//     table.string("description");
//     table.timestamps(true, true);
//   });

//   await transaction.schema.withSchema(schemaName).createTable("permissions", (table) => {
//     table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
//     table.string("key").notNullable().unique();       // e.g., leads.create
//     table.string("module").notNullable();             // e.g., leads
//     table.string("description");
//     table.timestamps(true, true);
//   });

//   await transaction.schema.withSchema(schemaName).createTable("role_permissions", (table) => {
//     table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
//     table.uuid("role_id").references("id").inTable(`${schemaName}.roles`).onDelete("CASCADE");
//     table.uuid("permission_id").references("id").inTable(`${schemaName}.permissions`).onDelete("CASCADE");
//     table.timestamps(true, true);
//   });

//   // -------------------------------------
//   // CORE CRM MODULES
//   // -------------------------------------
//   await transaction.schema.withSchema(schemaName).createTable("users", (table) => {
//     table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
//     table.string("name").notNullable();
//     table.string("email").notNullable().unique();
//     table.string("password").notNullable();
//     table.boolean("is_active").defaultTo(true);
//     table.timestamps(true, true);
//   });

//   await transaction.schema.withSchema(schemaName).createTable("leads", (table) => {
//     table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
//     table.string("name").notNullable();
//     table.string("email");
//     table.string("phone");
//     table.string("status").defaultTo("new");
//     table.timestamps(true, true);
//   });

//   await transaction.schema.withSchema(schemaName).createTable("contacts", (table) => {
//     table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
//     table.string("first_name");
//     table.string("last_name");
//     table.string("email");
//     table.string("phone");
//     table.string("company");
//     table.timestamps(true, true);
//   });

//   await transaction.schema.withSchema(schemaName).createTable("deals", (table) => {
//     table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
//     table.string("name").notNullable();
//     table.uuid("lead_id").references("id").inTable(`${schemaName}.leads`).onDelete("SET NULL");
//     table.uuid("contact_id").references("id").inTable(`${schemaName}.contacts`).onDelete("SET NULL");
//     table.decimal("value", 12, 2).defaultTo(0);
//     table.string("stage").defaultTo("prospecting");
//     table.string("status").defaultTo("open");
//     table.uuid("owner_id").references("id").inTable(`${schemaName}.users`).onDelete("SET NULL");
//     table.timestamp("expected_close_date");
//     table.timestamps(true, true);
//   });

//   await transaction.schema.withSchema(schemaName).createTable("products", (table) => {
//     table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
//     table.string("name").notNullable();
//     table.text("description");
//     table.decimal("price", 12, 2).defaultTo(0);
//     table.timestamps(true, true);
//   });

//   await transaction.schema.withSchema(schemaName).createTable("quotes", (table) => {
//     table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
//     table.uuid("lead_id").references("id").inTable(`${schemaName}.leads`).onDelete("SET NULL");
//     table.uuid("product_id").references("id").inTable(`${schemaName}.products`).onDelete("SET NULL");
//     table.decimal("amount", 12, 2).defaultTo(0);
//     table.string("status").defaultTo("draft");
//     table.timestamps(true, true);
//   });

//   await transaction.schema.withSchema(schemaName).createTable("invoices", (table) => {
//     table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
//     table.uuid("quote_id").references("id").inTable(`${schemaName}.quotes`).onDelete("SET NULL");
//     table.decimal("total_amount", 12, 2).defaultTo(0);
//     table.string("status").defaultTo("pending");
//     table.timestamps(true, true);
//   });

//   await transaction.schema.withSchema(schemaName).createTable("activities", (table) => {
//     table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
//     table.string("type");
//     table.string("title").notNullable();
//     table.text("description");
//     table.timestamp("start_time");
//     table.timestamp("end_time");
//     table.uuid("assigned_to").references("id").inTable(`${schemaName}.users`).onDelete("SET NULL");
//     table.string("status").defaultTo("pending");
//     table.timestamps(true, true);
//   });

//   await transaction.schema.withSchema(schemaName).createTable("notes", (table) => {
//     table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
//     table.string("entity_type");
//     table.uuid("entity_id");
//     table.text("content");
//     table.uuid("created_by").references("id").inTable(`${schemaName}.users`).onDelete("SET NULL");
//     table.timestamps(true, true);
//   });

//   await transaction.schema.withSchema(schemaName).createTable("files", (table) => {
//     table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
//     table.string("file_name").notNullable();
//     table.string("file_url").notNullable();
//     table.string("entity_type");
//     table.uuid("entity_id");
//     table.uuid("uploaded_by").references("id").inTable(`${schemaName}.users`).onDelete("SET NULL");
//     table.timestamps(true, true);
//   });

//   // -------------------------------------
//   // CUSTOM MODULES
//   // -------------------------------------
//   await transaction.schema.withSchema(schemaName).createTable("custom_modules", (table) => {
//     table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
//     table.string("name").notNullable();
//     table.jsonb("settings").defaultTo("{}");
//     table.timestamps(true, true);
//   });

//   await transaction.schema.withSchema(schemaName).createTable("custom_fields", (table) => {
//     table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
//     table.uuid("module_id").references("id").inTable(`${schemaName}.custom_modules`).onDelete("CASCADE");
//     table.string("name").notNullable();
//     table.string("type").notNullable();
//     table.jsonb("settings").defaultTo("{}");
//     table.timestamps(true, true);
//   });

//   // -------------------------------------
//   // INDUSTRY MODULES
//   // -------------------------------------
//   if (industryType === "healthcare") {
//     await transaction.schema.withSchema(schemaName).createTable("patients", (table) => {
//       table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
//       table.string("name").notNullable();
//       table.string("email");
//       table.string("phone");
//       table.date("dob");
//       table.timestamps(true, true);
//     });

//     await transaction.schema.withSchema(schemaName).createTable("appointments", (table) => {
//       table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
//       table.uuid("patient_id").references("id").inTable(`${schemaName}.patients`).onDelete("CASCADE");
//       table.uuid("doctor_id").references("id").inTable(`${schemaName}.users`).onDelete("SET NULL");
//       table.timestamp("appointment_time");
//       table.string("status").defaultTo("scheduled");
//       table.timestamps(true, true);
//     });
//   }

//   if (industryType === "real_estate") {
//     await transaction.schema.withSchema(schemaName).createTable("properties", (table) => {
//       table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
//       table.string("name").notNullable();
//       table.string("location");
//       table.decimal("price", 12, 2);
//       table.timestamps(true, true);
//     });

//     await transaction.schema.withSchema(schemaName).createTable("site_visits", (table) => {
//       table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
//       table.uuid("property_id").references("id").inTable(`${schemaName}.properties`).onDelete("CASCADE");
//       table.uuid("visited_by").references("id").inTable(`${schemaName}.users`).onDelete("SET NULL");
//       table.timestamp("visit_time");
//       table.timestamps(true, true);
//     });
//   }

//   // -------------------------------------
//   // DEFAULT TENANT ADMIN + BASIC PERMISSIONS
//   // -------------------------------------
//   const [adminRoleId] = await transaction(`${schemaName}.roles`)
//     .insert({
//       id: knex.raw("uuid_generate_v4()"),
//       name: "tenant_admin",
//       description: "Full access to all modules",
//     })
//     .returning("id");

//   const basePermissions = [
//     { key: "leads.create", module: "leads", description: "Create leads" },
//     { key: "leads.view", module: "leads", description: "View leads" },
//     { key: "leads.update", module: "leads", description: "Update leads" },
//     { key: "leads.delete", module: "leads", description: "Delete leads" },

//     { key: "deals.create", module: "deals", description: "Create deals" },
//     { key: "deals.view", module: "deals", description: "View deals" },
//     { key: "deals.update", module: "deals", description: "Update deals" },
//   ];

//   const permissionIds = await transaction(`${schemaName}.permissions`)
//     .insert(
//       basePermissions.map(p => ({
//         id: knex.raw("uuid_generate_v4()"),
//         key: p.key,
//         module: p.module,
//         description: p.description,
//       }))
//     )
//     .returning("id");

//   const rolePermissions = permissionIds.map(pid => ({
//     id: knex.raw("uuid_generate_v4()"),
//     role_id: adminRoleId.id || adminRoleId,
//     permission_id: pid.id,
//   }));

//   await transaction(`${schemaName}.role_permissions`).insert(rolePermissions);

//   console.log(`Tenant schema "${schemaName}" created successfully.`);
// }

// /**
//  * Drops the tenant schema including all tables
//  */
// export async function dropTenantSchema(schemaName, trx) {
//   const transaction = trx || knex;
//   await transaction.raw(`DROP SCHEMA IF EXISTS "${schemaName}" CASCADE`);
//   console.log(`Tenant schema "${schemaName}" dropped successfully.`);
// }



// import { knex } from "../db/knex.js";

/**
 * Create a full tenant schema including:
 * - RBAC (roles, permissions, role_permissions)
 * - Core CRM modules (users, leads, contacts, deals, etc.)
 * - Custom modules
 * - Optional industry-specific modules
 */

// export async function createTenantSchema(schemaName, industryType, trx) {
//   const transaction = trx || knex;

//   // Ensure schema exists
//   await transaction.raw(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`);

//   // -------------------------------------
//   // RBAC: Roles, Permissions, Role_Permissions
//   // -------------------------------------
//   await transaction.schema.withSchema(schemaName).createTable("roles", (table) => {
//     table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
//     table.string("name").notNullable().unique();
//     table.string("description");
//     table.timestamps(true, true);
//   });

//   await transaction.schema.withSchema(schemaName).createTable("permissions", (table) => {
//     table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
//     table.string("key").notNullable().unique();       // e.g., leads.create
//     table.string("module").notNullable();             // e.g., leads
//     table.string("description");
//     table.timestamps(true, true);
//   });

//   await transaction.schema.withSchema(schemaName).createTable("role_permissions", (table) => {
//     table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
//     table.uuid("role_id").references("id").inTable(`${schemaName}.roles`).onDelete("CASCADE");
//     table.uuid("permission_id").references("id").inTable(`${schemaName}.permissions`).onDelete("CASCADE");
//     table.timestamps(true, true);
//   });

//   // -------------------------------------
//   // CORE CRM MODULES
//   // -------------------------------------
//   const coreTables = [
//     {
//       name: "users",
//       fn: (table) => {
//         table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
//         table.string("name").notNullable();
//         table.string("email").notNullable().unique();
//         table.string("password").notNullable();
//         table.boolean("is_active").defaultTo(true);
//         table.timestamps(true, true);
//       },
//     },
//     {
//       name: "leads",
//       fn: (table) => {
//         table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
//         table.string("name").notNullable();
//         table.string("email");
//         table.string("phone");
//         table.string("status").defaultTo("new");
//         table.timestamps(true, true);
//       },
//     },
//     {
//       name: "contacts",
//       fn: (table) => {
//         table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
//         table.string("first_name");
//         table.string("last_name");
//         table.string("email");
//         table.string("phone");
//         table.string("company");
//         table.timestamps(true, true);
//       },
//     },
//     {
//       name: "deals",
//       fn: (table) => {
//         table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
//         table.string("name").notNullable();
//         table.uuid("lead_id").references("id").inTable(`${schemaName}.leads`).onDelete("SET NULL");
//         table.uuid("contact_id").references("id").inTable(`${schemaName}.contacts`).onDelete("SET NULL");
//         table.decimal("value", 12, 2).defaultTo(0);
//         table.string("stage").defaultTo("prospecting");
//         table.string("status").defaultTo("open");
//         table.uuid("owner_id").references("id").inTable(`${schemaName}.users`).onDelete("SET NULL");
//         table.timestamp("expected_close_date");
//         table.timestamps(true, true);
//       },
//     },
//     {
//       name: "products",
//       fn: (table) => {
//         table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
//         table.string("name").notNullable();
//         table.text("description");
//         table.decimal("price", 12, 2).defaultTo(0);
//         table.timestamps(true, true);
//       },
//     },
//     {
//       name: "quotes",
//       fn: (table) => {
//         table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
//         table.uuid("lead_id").references("id").inTable(`${schemaName}.leads`).onDelete("SET NULL");
//         table.uuid("product_id").references("id").inTable(`${schemaName}.products`).onDelete("SET NULL");
//         table.decimal("amount", 12, 2).defaultTo(0);
//         table.string("status").defaultTo("draft");
//         table.timestamps(true, true);
//       },
//     },
//     {
//       name: "invoices",
//       fn: (table) => {
//         table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
//         table.uuid("quote_id").references("id").inTable(`${schemaName}.quotes`).onDelete("SET NULL");
//         table.decimal("total_amount", 12, 2).defaultTo(0);
//         table.string("status").defaultTo("pending");
//         table.timestamps(true, true);
//       },
//     },
//     {
//       name: "activities",
//       fn: (table) => {
//         table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
//         table.string("type");
//         table.string("title").notNullable();
//         table.text("description");
//         table.timestamp("start_time");
//         table.timestamp("end_time");
//         table.uuid("assigned_to").references("id").inTable(`${schemaName}.users`).onDelete("SET NULL");
//         table.string("status").defaultTo("pending");
//         table.timestamps(true, true);
//       },
//     },
//     {
//       name: "notes",
//       fn: (table) => {
//         table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
//         table.string("entity_type");
//         table.uuid("entity_id");
//         table.text("content");
//         table.uuid("created_by").references("id").inTable(`${schemaName}.users`).onDelete("SET NULL");
//         table.timestamps(true, true);
//       },
//     },
//     {
//       name: "files",
//       fn: (table) => {
//         table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
//         table.string("file_name").notNullable();
//         table.string("file_url").notNullable();
//         table.string("entity_type");
//         table.uuid("entity_id");
//         table.uuid("uploaded_by").references("id").inTable(`${schemaName}.users`).onDelete("SET NULL");
//         table.timestamps(true, true);
//       },
//     },
//   ];

//   for (const t of coreTables) {
//     await transaction.schema.withSchema(schemaName).createTable(t.name, t.fn);
//   }

//   // -------------------------------------
//   // CUSTOM MODULES
//   // -------------------------------------
//   await transaction.schema.withSchema(schemaName).createTable("custom_modules", (table) => {
//     table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
//     table.string("name").notNullable();
//     table.jsonb("settings").defaultTo("{}");
//     table.timestamps(true, true);
//   });

//   await transaction.schema.withSchema(schemaName).createTable("custom_fields", (table) => {
//     table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
//     table.uuid("module_id").references("id").inTable(`${schemaName}.custom_modules`).onDelete("CASCADE");
//     table.string("name").notNullable();
//     table.string("type").notNullable();
//     table.jsonb("settings").defaultTo("{}");
//     table.timestamps(true, true);
//   });

//   // -------------------------------------
//   // INDUSTRY MODULES
//   // -------------------------------------
//   if (industryType === "healthcare") {
//     await transaction.schema.withSchema(schemaName).createTable("patients", (table) => {
//       table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
//       table.string("name").notNullable();
//       table.string("email");
//       table.string("phone");
//       table.date("dob");
//       table.timestamps(true, true);
//     });

//     await transaction.schema.withSchema(schemaName).createTable("appointments", (table) => {
//       table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
//       table.uuid("patient_id").references("id").inTable(`${schemaName}.patients`).onDelete("CASCADE");
//       table.uuid("doctor_id").references("id").inTable(`${schemaName}.users`).onDelete("SET NULL");
//       table.timestamp("appointment_time");
//       table.string("status").defaultTo("scheduled");
//       table.timestamps(true, true);
//     });
//   }

//   if (industryType === "real_estate") {
//     await transaction.schema.withSchema(schemaName).createTable("properties", (table) => {
//       table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
//       table.string("name").notNullable();
//       table.string("location");
//       table.decimal("price", 12, 2);
//       table.timestamps(true, true);
//     });

//     await transaction.schema.withSchema(schemaName).createTable("site_visits", (table) => {
//       table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
//       table.uuid("property_id").references("id").inTable(`${schemaName}.properties`).onDelete("CASCADE");
//       table.uuid("visited_by").references("id").inTable(`${schemaName}.users`).onDelete("SET NULL");
//       table.timestamp("visit_time");
//       table.timestamps(true, true);
//     });
//   }

//   console.log(`Tenant schema "${schemaName}" created successfully.`);
// }

// /**
//  * Seed default modules, roles, and permissions for a tenant
//  */
// export async function createDefaultModules(schemaName, trx) {
//   const transaction = trx || knex;

//   console.log(`Seeding default modules for tenant schema: ${schemaName}`);

//   const modules = [
//     { name: "Leads" },
//     { name: "Contacts" },
//     { name: "Deals" },
//     { name: "Products" },
//     { name: "Quotes" },
//     { name: "Invoices" },
//     { name: "Activities" },
//     { name: "Notes" },
//     { name: "Files" },
//   ];

//   const moduleIds = await Promise.all(
//     modules.map(async (mod) => {
//       const [m] = await transaction(`${schemaName}.custom_modules`)
//         .insert({
//           id: knex.raw("uuid_generate_v4()"),
//           name: mod.name,
//           settings: JSON.stringify({}),
//         })
//         .returning("*");
//       return m.id;
//     })
//   );

//   const defaultPermissions = [
//     { key: "leads.create", module: "leads", description: "Create leads" },
//     { key: "leads.view", module: "leads", description: "View leads" },
//     { key: "leads.update", module: "leads", description: "Update leads" },
//     { key: "leads.delete", module: "leads", description: "Delete leads" },

//     { key: "deals.create", module: "deals", description: "Create deals" },
//     { key: "deals.view", module: "deals", description: "View deals" },
//     { key: "deals.update", module: "deals", description: "Update deals" },
//   ];

//   const permissionIds = await Promise.all(
//     defaultPermissions.map(async (perm) => {
//       const [p] = await transaction(`${schemaName}.permissions`)
//         .insert({
//           id: knex.raw("uuid_generate_v4()"),
//           key: perm.key,
//           module: perm.module,
//           description: perm.description,
//         })
//         .returning("*");
//       return p.id;
//     })
//   );

//   const [adminRole] = await transaction(`${schemaName}.roles`)
//     .insert({
//       id: knex.raw("uuid_generate_v4()"),
//       name: "tenant_admin",
//       description: "Full access to all modules",
//     })
//     .returning("*");

//   const rolePermissions = permissionIds.map((pid) => ({
//     id: knex.raw("uuid_generate_v4()"),
//     role_id: adminRole.id,
//     permission_id: pid,
//   }));

//   await transaction(`${schemaName}.role_permissions`).insert(rolePermissions);

//   console.log(`Default modules and permissions seeded for tenant schema: ${schemaName}`);
// }

// /**
//  * Drops the tenant schema including all tables
//  */
// export async function dropTenantSchema(schemaName, trx) {
//   const transaction = trx || knex;
//   await transaction.raw(`DROP SCHEMA IF EXISTS "${schemaName}" CASCADE`);
//   console.log(`Tenant schema "${schemaName}" dropped successfully.`);
// }


// /db/tenantSchema.js
import { knex } from "./knex.js";


export async function createTenantSchema(schemaName, industryType, trx) {
  const transaction = trx || knex;

  // Ensure schema exists
  await transaction.raw(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`);

  // -------------------------------------
  // RBAC: Roles, Permissions, Role_Permissions, User_Roles
  // -------------------------------------
  await transaction.schema.withSchema(schemaName).createTable("roles", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
    table.string("name").notNullable().unique();
    table.string("description");
    table.timestamps(true, true);
  });

  await transaction.schema.withSchema(schemaName).createTable("permissions", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
    table.string("key").notNullable().unique();
    table.string("module").notNullable();
    table.string("description");
    table.timestamps(true, true);
  });

  await transaction.schema.withSchema(schemaName).createTable("role_permissions", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
    table.uuid("role_id").references("id").inTable(`${schemaName}.roles`).onDelete("CASCADE");
    table.uuid("permission_id").references("id").inTable(`${schemaName}.permissions`).onDelete("CASCADE");
    table.timestamps(true, true);
  });

  await transaction.schema.withSchema(schemaName).createTable("user_roles", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
    table.uuid("user_id").notNullable();
    table.uuid("role_id").notNullable();
    table.timestamps(true, true);
  });

  // -------------------------------------
  // CORE CRM MODULES
  // -------------------------------------
  const coreTables = [
    {
      name: "users",
      fn: (table) => {
        table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
        table.string("name").notNullable();
        table.string("email").notNullable().unique();
        table.string("password").notNullable();
        table.boolean("is_active").defaultTo(true);
        table.timestamps(true, true);
      },
    },
    {
      name: "leads",
      fn: (table) => {
        table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
        table.string("name").notNullable();
        table.string("email");
        table.string("phone");
        table.string("status").defaultTo("new");
        table.timestamps(true, true);
      },
    },
    {
      name: "contacts",
      fn: (table) => {
        table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
        table.string("first_name");
        table.string("last_name");
        table.string("email");
        table.string("phone");
        table.string("company");
        table.timestamps(true, true);
      },
    },
    {
      name: "deals",
      fn: (table) => {
        table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
        table.string("name").notNullable();
        table.uuid("lead_id").references("id").inTable(`${schemaName}.leads`).onDelete("SET NULL");
        table.uuid("contact_id").references("id").inTable(`${schemaName}.contacts`).onDelete("SET NULL");
        table.decimal("value", 12, 2).defaultTo(0);
        table.string("stage").defaultTo("prospecting");
        table.string("status").defaultTo("open");
        table.uuid("owner_id").references("id").inTable(`${schemaName}.users`).onDelete("SET NULL");
        table.timestamp("expected_close_date");
        table.timestamps(true, true);
      },
    },
    {
      name: "products",
      fn: (table) => {
        table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
        table.string("name").notNullable();
        table.text("description");
        table.decimal("price", 12, 2).defaultTo(0);
        table.timestamps(true, true);
      },
    },
    {
      name: "quotes",
      fn: (table) => {
        table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
        table.uuid("lead_id").references("id").inTable(`${schemaName}.leads`).onDelete("SET NULL");
        table.uuid("product_id").references("id").inTable(`${schemaName}.products`).onDelete("SET NULL");
        table.decimal("amount", 12, 2).defaultTo(0);
        table.string("status").defaultTo("draft");
        table.timestamps(true, true);
      },
    },
    {
      name: "invoices",
      fn: (table) => {
        table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
        table.uuid("quote_id").references("id").inTable(`${schemaName}.quotes`).onDelete("SET NULL");
        table.decimal("total_amount", 12, 2).defaultTo(0);
        table.string("status").defaultTo("pending");
        table.timestamps(true, true);
      },
    },
    {
      name: "activities",
      fn: (table) => {
        table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
        table.string("type");
        table.string("title").notNullable();
        table.text("description");
        table.timestamp("start_time");
        table.timestamp("end_time");
        table.uuid("assigned_to").references("id").inTable(`${schemaName}.users`).onDelete("SET NULL");
        table.string("status").defaultTo("pending");
        table.timestamps(true, true);
      },
    },
    {
      name: "notes",
      fn: (table) => {
        table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
        table.string("entity_type");
        table.uuid("entity_id");
        table.text("content");
        table.uuid("created_by").references("id").inTable(`${schemaName}.users`).onDelete("SET NULL");
        table.timestamps(true, true);
      },
    },
    {
      name: "files",
      fn: (table) => {
        table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
        table.string("file_name").notNullable();
        table.string("file_url").notNullable();
        table.string("entity_type");
        table.uuid("entity_id");
        table.uuid("uploaded_by").references("id").inTable(`${schemaName}.users`).onDelete("SET NULL");
        table.timestamps(true, true);
      },
    },
  ];

  for (const t of coreTables) {
    await transaction.schema.withSchema(schemaName).createTable(t.name, t.fn);
  }

  // -------------------------------------
  // CUSTOM MODULES
  // -------------------------------------
  await transaction.schema.withSchema(schemaName).createTable("custom_modules", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
    table.string("name").notNullable();
    table.jsonb("settings").defaultTo("{}");
    table.timestamps(true, true);
  });

  await transaction.schema.withSchema(schemaName).createTable("custom_fields", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
    table.uuid("module_id").references("id").inTable(`${schemaName}.custom_modules`).onDelete("CASCADE");
    table.string("name").notNullable();
    table.string("type").notNullable();
    table.jsonb("settings").defaultTo("{}");
    table.timestamps(true, true);
  });

  // -------------------------------------
  // INDUSTRY MODULES (optional)
  // -------------------------------------
  if (industryType === "healthcare") {
    await transaction.schema.withSchema(schemaName).createTable("patients", (table) => {
      table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
      table.string("name").notNullable();
      table.string("email");
      table.string("phone");
      table.date("dob");
      table.timestamps(true, true);
    });

    await transaction.schema.withSchema(schemaName).createTable("appointments", (table) => {
      table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
      table.uuid("patient_id").references("id").inTable(`${schemaName}.patients`).onDelete("CASCADE");
      table.uuid("doctor_id").references("id").inTable(`${schemaName}.users`).onDelete("SET NULL");
      table.timestamp("appointment_time");
      table.string("status").defaultTo("scheduled");
      table.timestamps(true, true);
    });
  }

  if (industryType === "real_estate") {
    await transaction.schema.withSchema(schemaName).createTable("properties", (table) => {
      table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
      table.string("name").notNullable();
      table.string("location");
      table.decimal("price", 12, 2);
      table.timestamps(true, true);
    });

    await transaction.schema.withSchema(schemaName).createTable("site_visits", (table) => {
      table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
      table.uuid("property_id").references("id").inTable(`${schemaName}.properties`).onDelete("CASCADE");
      table.uuid("visited_by").references("id").inTable(`${schemaName}.users`).onDelete("SET NULL");
      table.timestamp("visit_time");
      table.timestamps(true, true);
    });
  }

  console.log(`Tenant schema "${schemaName}" created successfully.`);
}

/**
 * Seed default modules, roles, and permissions for a tenant
 */
export async function createDefaultModules(schemaName, trx) {
  const transaction = trx || knex;

  console.log(`Seeding default modules for tenant schema: ${schemaName}`);

  const modules = [
    "Leads","Contacts","Deals","Products","Quotes","Invoices","Activities","Notes","Files"
  ];

  const moduleIds = await Promise.all(
    modules.map(async (name) => {
      const [m] = await transaction(`${schemaName}.custom_modules`)
        .insert({ id: knex.raw("uuid_generate_v4()"), name, settings: JSON.stringify({}) })
        .returning("*");
      return m.id;
    })
  );

  // Default tenant permissions
  const defaultPermissions = [
    { key: "leads.create", module: "leads", description: "Create leads" },
    { key: "leads.view", module: "leads", description: "View leads" },
    { key: "leads.update", module: "leads", description: "Update leads" },
    { key: "leads.delete", module: "leads", description: "Delete leads" },
    { key: "deals.create", module: "deals", description: "Create deals" },
    { key: "deals.view", module: "deals", description: "View deals" },
    { key: "deals.update", module: "deals", description: "Update deals" },
  ];

  const permissionIds = await Promise.all(
    defaultPermissions.map(async (perm) => {
      const [p] = await transaction(`${schemaName}.permissions`)
        .insert({
          id: knex.raw("uuid_generate_v4()"),
          key: perm.key,
          module: perm.module,
          description: perm.description,
        })
        .returning("*");
      return p.id;
    })
  );

  // Seed tenant_admin role
  const [adminRole] = await transaction(`${schemaName}.roles`)
    .insert({ id: knex.raw("uuid_generate_v4()"), name: "tenant_admin", description: "Full access to all modules" })
    .returning("*");

  const rolePermissions = permissionIds.map((pid) => ({
    id: knex.raw("uuid_generate_v4()"),
    role_id: adminRole.id,
    permission_id: pid,
  }));

  await transaction(`${schemaName}.role_permissions`).insert(rolePermissions);

  console.log(`Default modules and permissions seeded for tenant schema: ${schemaName}`);
}

/**
 * Drops the tenant schema including all tables
 */
export async function dropTenantSchema(schemaName, trx) {
  const transaction = trx || knex;
  await transaction.raw(`DROP SCHEMA IF EXISTS "${schemaName}" CASCADE`);
  console.log(`Tenant schema "${schemaName}" dropped successfully.`);
}
