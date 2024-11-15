const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'user_db',
  password: 'varad',
  port: 5432,
});

module.exports = pool;
