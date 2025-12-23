const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://user:password@db:5432/myapp',
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};