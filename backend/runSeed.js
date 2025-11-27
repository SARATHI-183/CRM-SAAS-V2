// runSeed.js
import { knex } from './db/knex.js';
import { seed as masterSeed } from './seeds/001_master_seed.js';

async function run() {
  try {
    console.log('Running master seed...');
    await masterSeed(knex);
    console.log('Master seed completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error running seed:', err);
    process.exit(1);
  } finally {
    await knex.destroy(); // close DB connection
  }
}

run();
