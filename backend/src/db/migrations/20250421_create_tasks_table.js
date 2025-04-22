const up = function(knex) {
    return knex.schema.createTable('tasks', (table) => {
      table.increments('id').primary();
      table.integer('user_id').unsigned().notNullable();
      table.foreign('user_id').references('users.id').onDelete('CASCADE');
      table.datetime('datetime').notNullable();
      table.text('note').notNullable();
      table.timestamps(true, true);
    });
  };
  
const down = function(knex) {
  return knex.schema.dropTable('tasks');
};

export { up, down };