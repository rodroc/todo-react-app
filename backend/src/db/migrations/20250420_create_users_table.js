const up = function(knex) {
    return knex.schema.createTable('users', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('email').notNullable().unique();
      table.string('password').notNullable();
      table.timestamps(true, true);
    });
  };
  
const down = function(knex) {
  return knex.schema.dropTable('users');
};

export { up, down };