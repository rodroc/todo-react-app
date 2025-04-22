import knex from 'knex';
import config from '../../knexfile.js';

// console.log({config})

export const db = knex(config)

export async function setupDB() {
  try {
    console.log(`Setup database and start server...`);
    // Check connection
    await db.raw('SELECT 1');
    console.log('Database connected!');

    // Check if tables exist, if not run migrations
    const tablesExist = await db.schema.hasTable('users') && await db.schema.hasTable('tasks');
    
    if (!tablesExist) {
      console.log('Tables not found, running migrations...');
      
      // Create users table
      if (!await db.schema.hasTable('users')) {
        await db.schema.createTable('users', table => {
          table.increments('id').primary();
          table.string('name').notNullable();
          table.string('email').notNullable().unique();
          table.string('password').notNullable();
          table.timestamps(true, true);
        });
        console.log('Users table created');
      }
      
      // Create tasks table
      if (!await db.schema.hasTable('tasks')) {
        await db.schema.createTable('tasks', table => {
          table.increments('id').primary();
          table.integer('user_id').unsigned().notNullable();
          table.datetime('datetime').notNullable();
          table.text('note').notNullable();
          table.timestamps(true, true);
          
          table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
        });
        console.log('Tasks table created');
      }
    }
    
    return true;
  } catch (error) {
    console.error('Database setup error:', error);
    console.error(`PLEASE MAKE SURE TO SET THE 'DB_HOST' in 'local.env' TO YOUR HOST NETWORK IP.`)
    throw error;
  }
}