export async function up(knex) {
  await knex.schema
    .withSchema("master")
    .createTable("tenant_feature_overrides", (table) => {
      table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));

      table
        .uuid("tenant_id")
        .notNullable()
        .references("id")
        .inTable("master.tenants")
        .onDelete("CASCADE");

      table
        .uuid("feature_id")
        .notNullable()
        .references("id")
        .inTable("master.features")
        .onDelete("CASCADE");

      table.boolean("is_enabled").defaultTo(true);

      table.integer("limit_value").nullable();

      table
        .enu("source", ["plan_override", "addon", "manual"], {
          useNative: true,
          enumName: "feature_override_source_enum",
        })
        .defaultTo("manual");

      table.timestamps(true, true);

      table.unique(["tenant_id", "feature_id"]);
    });

  await knex.schema.withSchema("master").table("tenant_feature_overrides", (table) => {
    table.index(["tenant_id"], "idx_tfo_tenant");
    table.index(["feature_id"], "idx_tfo_feature");
  });
}

export async function down(knex) {
  await knex.schema
    .withSchema("master")
    .dropTableIfExists("tenant_feature_overrides");
}
