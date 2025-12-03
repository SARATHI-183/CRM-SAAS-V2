

// /db/tenantSchema.js
import { knex } from "./knex.js";


export async function createTenantSchema(schemaName, industryType, trx) {
  const transaction = trx || knex;

  // Ensure schema exists
  await transaction.raw(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`);

  // -------------------------------------
  // RBAC: Roles, Permissions, Role_Permissions, User_Roles
  // -------------------------------------
  // await transaction.schema.withSchema(schemaName).createTable("roles", (table) => {
  //   table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
  //   table.string("name").notNullable().unique();
  //   table.string("description");
  //   table.timestamps(true, true);
  // });

  // await transaction.schema.withSchema(schemaName).createTable("permissions", (table) => {
  //   table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
  //   table.string("key").notNullable().unique();
  //   table.string("module").notNullable();
  //   table.string("description");
  //   table.timestamps(true, true);
  // });

  // await transaction.schema.withSchema(schemaName).createTable("role_permissions", (table) => {
  //   table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
  //   table.uuid("role_id").references("id").inTable(`${schemaName}.roles`).onDelete("CASCADE");
  //   table.uuid("permission_id").references("id").inTable(`${schemaName}.permissions`).onDelete("CASCADE");
  //   table.timestamps(true, true);
  // });

  // await transaction.schema.withSchema(schemaName).createTable("user_roles", (table) => {
  //   table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
  //   table.uuid("user_id").notNullable();
  //   table.uuid("role_id").notNullable();
  //   table.timestamps(true, true);
  // });
  // ROLES
  await transaction.schema.withSchema(schemaName).createTable("roles", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
    table.string("name").notNullable().unique();
    table.string("description");
    table.timestamps(true, true);
  });

  // PERMISSIONS
  await transaction.schema.withSchema(schemaName).createTable("permissions", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
    table.string("key").notNullable().unique();
    table.string("module").notNullable();
    table.string("description");
    table.timestamps(true, true);
  });

  // ROLE_PERMISSIONS
  await transaction.schema.withSchema(schemaName).createTable("role_permissions", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
    table
      .uuid("role_id")
      .notNullable()
      .references("id")
      .inTable(`${schemaName}.roles`)
      .onDelete("CASCADE");

    table
      .uuid("permission_id")
      .notNullable()
      .references("id")
      .inTable(`${schemaName}.permissions`)
      .onDelete("CASCADE");

    table.timestamps(true, true);

    // IMPORTANT: Required for ON CONFLICT(role_id, permission_id)
    table.unique(["role_id", "permission_id"], {
      indexName: "role_permissions_unique"
    });
  });

  // USER_ROLES
  await transaction.schema.withSchema(schemaName).createTable("user_roles", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));

    table.uuid("user_id").notNullable(); // FK to master DB
    table
      .uuid("role_id")
      .notNullable()
      .references("id")
      .inTable(`${schemaName}.roles`)
      .onDelete("CASCADE");

    table.timestamps(true, true);

    // Prevent duplicate (user_id, role_id)
    table.unique(["user_id", "role_id"], {
      indexName: "user_roles_unique"
    });
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
  // const defaultPermissions = [
  //   { key: "leads.create", module: "leads", description: "Create leads" },
  //   { key: "leads.view", module: "leads", description: "View leads" },
  //   { key: "leads.update", module: "leads", description: "Update leads" },
  //   { key: "leads.delete", module: "leads", description: "Delete leads" },
  //   { key: "deals.create", module: "deals", description: "Create deals" },
  //   { key: "deals.view", module: "deals", description: "View deals" },
  //   { key: "deals.update", module: "deals", description: "Update deals" },
  // ];
  const defaultPermissions = [
    // ------- CRM MODULE: Leads -------
    { key: "leads.create", module: "leads", description: "Create leads" },
    { key: "leads.view", module: "leads", description: "View leads" },
    { key: "leads.update", module: "leads", description: "Update leads" },
    { key: "leads.delete", module: "leads", description: "Delete leads" },

    // ------- CRM MODULE: Deals -------
    { key: "deals.create", module: "deals", description: "Create deals" },
    { key: "deals.view", module: "deals", description: "View deals" },
    { key: "deals.update", module: "deals", description: "Update deals" },

    // ================================
    // 👉 NEW RBAC PERMISSIONS (Must add)
    // ================================

    // Roles CRUD
    { key: "roles.create", module: "rbac", description: "Create roles" },
    { key: "roles.view",   module: "rbac", description: "View roles" },
    { key: "roles.update", module: "rbac", description: "Update roles" },
    { key: "roles.delete", module: "rbac", description: "Delete roles" },

    // Permissions View/Manage
    { key: "permissions.view",   module: "rbac", description: "View permissions" },
    { key: "permissions.update", module: "rbac", description: "Update permissions" },

    // User-role mapping
    { key: "user.roles.assign", module: "rbac", description: "Assign roles to users" },
    { key: "user.roles.view",   module: "rbac", description: "View user roles" },

    // High-level RBAC management (for tenant_admin)
    { key: "rbac.view",   module: "rbac", description: "View RBAC resources" },
    { key: "rbac.manage", module: "rbac", description: "Manage RBAC fully" },
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
