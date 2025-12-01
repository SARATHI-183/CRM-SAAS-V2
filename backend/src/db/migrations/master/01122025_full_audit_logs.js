export async function up(knex) {
  await knex.schema.withSchema('master').createTable('audit_logs', (table) => {
    table.uuid('id').primary();
    table.uuid('user_id').nullable();
    table.uuid('tenant_id').nullable();

    table.string('action').notNullable();
    table.string('resource').nullable();
    table.uuid('resource_id').nullable();

    table.jsonb('metadata').defaultTo('{}');

    table.string('ip_address').nullable();
    table.text('user_agent').nullable();

    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex) {
  await knex.schema.withSchema('master').dropTableIfExists('audit_logs');
}
