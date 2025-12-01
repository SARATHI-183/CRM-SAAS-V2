export async function up(knex) {
  // ---------------------------
  // roles table
  // ---------------------------
await knex.schema.withSchema('master').createTable('roles', table => {
  table.uuid('id').primary();
  table.string('name').notNullable();
  table.integer('role_level').notNullable();
  table.text('description').nullable();
  table.uuid('tenant_id').nullable();
  table.timestamp('created_at').defaultTo(knex.fn.now());
  table.timestamp('updated_at').defaultTo(knex.fn.now());

  table.unique(['name', 'tenant_id'], 'uq_roles_name_tenant');
  table.index(['role_level'], 'idx_roles_role_level');
});


  // ---------------------------
  // permissions table
  // ---------------------------
  await knex.schema.withSchema('master').createTable('permissions', table => {
    table.uuid('id').primary();
    table.string('name').notNullable().unique(); // e.g., CREATE_USER, DELETE_USER
    table.text('description').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    // name is unique, index created automatically
  });

  // ---------------------------
  // role_permissions table
  // ---------------------------
  await knex.schema.withSchema('master').createTable('role_permissions', table => {
    table.uuid('role_id').notNullable().references('id').inTable('master.roles').onDelete('CASCADE');
    table.uuid('permission_id').notNullable().references('id').inTable('master.permissions').onDelete('CASCADE');
    table.primary(['role_id', 'permission_id']);

    // INDEXES
    table.index(['role_id'], 'idx_role_permissions_role_id');
    table.index(['permission_id'], 'idx_role_permissions_permission_id');
  });

  // ---------------------------
  // user_roles table
  // ---------------------------
  await knex.schema.withSchema('master').createTable('user_roles', table => {
    table.uuid('user_id').notNullable();
    table.uuid('role_id').notNullable().references('id').inTable('master.roles').onDelete('CASCADE');
    table.primary(['user_id', 'role_id']);

    // INDEXES
    table.index(['user_id'], 'idx_user_roles_user_id');
    table.index(['role_id'], 'idx_user_roles_role_id');
  });
}

export async function down(knex) {
  await knex.schema.withSchema('master').dropTableIfExists('user_roles');
  await knex.schema.withSchema('master').dropTableIfExists('role_permissions');
  await knex.schema.withSchema('master').dropTableIfExists('permissions');
  await knex.schema.withSchema('master').dropTableIfExists('roles');
}
