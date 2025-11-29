export async function up(knex) {
  await knex.schema.withSchema("master").createTable("features", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));

    table
      .uuid("module_id")
      .notNullable()
      .references("id")
      .inTable("master.modules")
      .onDelete("CASCADE");

    table.string("name", 150).notNullable(); // Human readable title
    table.string("feature_key", 150).notNullable().unique(); // programmatic key

    table.string("description", 255);
    table.boolean("is_advanced").defaultTo(false);

    table.timestamps(true, true);
  });

  await knex.schema.withSchema("master").table("features", (table) => {
    table.index(["module_id"], "idx_features_module");
    table.index(["feature_key"], "idx_features_key");
  });
}

export async function down(knex) {
  await knex.schema.withSchema("master").dropTableIfExists("features");
}
