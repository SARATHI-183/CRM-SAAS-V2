export async function up(knex) {
  await knex.schema.withSchema("master").createTable("plan_features", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));

    table
      .uuid("plan_id")
      .notNullable()
      .references("id")
      .inTable("master.plans")
      .onDelete("CASCADE");

    table
      .uuid("feature_id")
      .notNullable()
      .references("id")
      .inTable("master.features")
      .onDelete("CASCADE");

    table.boolean("is_enabled").defaultTo(true);
    table.integer("limit_value").nullable(); // max users, max modules, etc.

    table.timestamps(true, true);

    table.unique(["plan_id", "feature_id"]);
  });

  await knex.schema.withSchema("master").table("plan_features", (table) => {
    table.index(["plan_id"], "idx_plan_features_plan");
    table.index(["feature_id"], "idx_plan_features_feature");
  });
}

export async function down(knex) {
  await knex.schema.withSchema("master").dropTableIfExists("plan_features");
}
