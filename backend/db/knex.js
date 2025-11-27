// db/knex.js
import knexLib from 'knex';
import knexConfig from '../knexfile.js';
import dotenv from 'dotenv';
dotenv.config();

const env = process.env.NODE_ENV || 'development';
export const knex = knexLib(knexConfig[env]);
