// migrations/000_master_init.js

export async function up(knex) {
  // ---------------------------------------------------------
  // 1. Create master schema
  // ---------------------------------------------------------
  await knex.raw(`CREATE SCHEMA IF NOT EXISTS master`);

  // ---------------------------------------------------------
  // 2. Install DB extensions
  // ---------------------------------------------------------
  await knex.raw(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
  await knex.raw(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);

  // ---------------------------------------------------------
  // 3. MASTER TABLES
  // ---------------------------------------------------------

  // =========================================================
  // master.users  (Super Admin Users)
  // =========================================================
  if (!(await knex.schema.withSchema("master").hasTable("users"))) {
    await knex.schema.withSchema("master").createTable("users", (table) => {
      table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));

      table.string("name", 150).notNullable();
      table.string("email", 150).notNullable().unique();  // unique index auto-created
      table.string("password", 255).notNullable();

      table.enu("role", ["super_admin"], {
        useNative: true,
        enumName: "user_role_enum",
      }).defaultTo("super_admin");

      table.boolean("is_active").defaultTo(true);

      table.timestamps(true, true);
    });

    // Important query indexes
    await knex.schema.withSchema("master").table("users", (table) => {
      table.index(["email"], "idx_users_email");
      table.index(["is_active"], "idx_users_is_active");
    });
  }

  // =========================================================
  // master.industries
  // =========================================================
  if (!(await knex.schema.withSchema("master").hasTable("industries"))) {
    await knex.schema.withSchema("master").createTable("industries", (table) => {
      table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
      table.string("name", 120).notNullable().unique();
      table.timestamps(true, true);
    });

    await knex.schema.withSchema("master").table("industries", (table) => {
      table.index(["name"], "idx_industries_name");
    });
  }

  // =========================================================
  // master.roles
  // =========================================================
  if (!(await knex.schema.withSchema("master").hasTable("roles"))) {
    await knex.schema.withSchema("master").createTable("roles", (table) => {
      table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
      table.string("name", 100).notNullable().unique();
      table.integer("role_level").notNullable();
      table.string("description", 255);
      table.timestamps(true, true);
    });

    await knex.schema.withSchema("master").table("roles", (table) => {
      table.index(["role_level"], "idx_roles_role_level");
    });
  }

  // =========================================================
  // master.plans
  // =========================================================
  if (!(await knex.schema.withSchema("master").hasTable("plans"))) {
    await knex.schema.withSchema("master").createTable("plans", (table) => {
      table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
      table.string("name", 100).notNullable();
      table.decimal("price", 10, 2).notNullable();
      table.jsonb("limits").defaultTo("{}");
      table.timestamps(true, true);
    });

    await knex.schema.withSchema("master").table("plans", (table) => {
      table.index(["price"], "idx_plans_price");
    });
  }

  // =========================================================
  // master.modules
  // =========================================================
  if (!(await knex.schema.withSchema("master").hasTable("modules"))) {
    await knex.schema.withSchema("master").createTable("modules", (table) => {
      table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
      table.string("name", 120).notNullable().unique();
      table.enu("type", ["core", "addon", "industry"], {
        useNative: true,
        enumName: "module_type_enum",
      }).notNullable();
      table.timestamps(true, true);
    });

    await knex.schema.withSchema("master").table("modules", (table) => {
      table.index(["type"], "idx_modules_type");
    });
  }

  // =========================================================
  // master.tenants
  // =========================================================
  if (!(await knex.schema.withSchema("master").hasTable("tenants"))) {
    await knex.schema.withSchema("master").createTable("tenants", (table) => {
      table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));

      table.string("company_name", 150).notNullable();
      table.string("company_email", 150).notNullable().unique();
      table.string("company_phone", 20);
      table.string("company_website", 200);

      table
        .uuid("industry_type")
        .references("id")
        .inTable("master.industries")
        .onDelete("SET NULL");

      table.string("schema_name", 120).notNullable().unique();

      table
        .uuid("plan_id")
        .references("id")
        .inTable("master.plans")
        .onDelete("SET NULL");

      table.enu("status", ["active", "inactive", "trial", "expired"], {
        useNative: true,
        enumName: "tenant_status_enum",
      }).defaultTo("active");

      table.timestamps(true, true);
    });

    await knex.schema.withSchema("master").table("tenants", (table) => {
      table.index(["industry_type"], "idx_tenants_industry");
      table.index(["plan_id"], "idx_tenants_plan");
      table.index(["status"], "idx_tenants_status");
      table.index(["company_name"], "idx_tenants_company_name");
      table.index(["company_email"], "idx_tenants_company_email");
    });
  }

  // =========================================================
  // master.tenant_addons
  // =========================================================
  if (!(await knex.schema.withSchema("master").hasTable("tenant_addons"))) {
    await knex.schema.withSchema("master").createTable("tenant_addons", (table) => {
      table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));

      table.uuid("tenant_id")
        .notNullable()
        .references("id")
        .inTable("master.tenants")
        .onDelete("CASCADE");

      table.uuid("addon_id")
        .notNullable()
        .references("id")
        .inTable("master.modules")
        .onDelete("CASCADE");

      table
        .enu("status", ["active", "inactive"], {
          useNative: true,
          enumName: "addon_status_enum",
        })
        .defaultTo("active");

      table.timestamps(true, true);

      table.unique(["tenant_id", "addon_id"]);
    });

    await knex.schema.withSchema("master").table("tenant_addons", (table) => {
      table.index(["tenant_id"], "idx_tenant_addons_tenant_id");
      table.index(["addon_id"], "idx_tenant_addons_addon_id");
      table.index(["status"], "idx_tenant_addons_status");
    });
  }

  // =========================================================
  // master.billing
  // =========================================================
  if (!(await knex.schema.withSchema("master").hasTable("billing"))) {
    await knex.schema.withSchema("master").createTable("billing", (table) => {
      table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));

      table
        .uuid("tenant_id")
        .references("id")
        .inTable("master.tenants")
        .onDelete("SET NULL");

      table.string("invoice_no", 120).notNullable();
      table.decimal("amount", 10, 2).notNullable();
      table.string("status", 50).defaultTo("pending");
      table.timestamps(true, true);
    });

    await knex.schema.withSchema("master").table("billing", (table) => {
      table.index(["tenant_id"], "idx_billing_tenant_id");
      table.index(["invoice_no"], "idx_billing_invoice_no");
      table.index(["status"], "idx_billing_status");
    });
  }

  // =========================================================
  // master.audit_logs
  // =========================================================
  if (!(await knex.schema.withSchema("master").hasTable("audit_logs"))) {
    await knex.schema.withSchema("master").createTable("audit_logs", (table) => {
      table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));

      table.uuid("user_id").references("id").inTable("master.users");
      table.string("action", 200).notNullable();
      table.jsonb("metadata").defaultTo("{}");

      table.timestamps(true, true);
    });

    await knex.schema.withSchema("master").table("audit_logs", (table) => {
      table.index(["user_id"], "idx_audit_logs_user_id");
      table.index(["action"], "idx_audit_logs_action");
    });
  }
}

// ---------------------------------------------------------
// DOWN
// ---------------------------------------------------------
export async function down(knex) {
  await knex.raw(`DROP SCHEMA IF EXISTS master CASCADE`);
}
