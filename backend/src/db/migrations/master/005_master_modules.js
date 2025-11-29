export async function up(knex) {
  await knex.schema.withSchema("master").table("modules", (table) => {
    table.boolean("is_premium").defaultTo(false);
  });
}

export async function down(knex) {
  await knex.schema.withSchema("master").table("modules", (table) => {
    table.dropColumn("is_premium");
  });
}
