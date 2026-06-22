const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;

let pool = null;

if (connectionString) {
  pool = new Pool({
    connectionString,
    // Add SSL support for production environments (e.g. Supabase, Heroku, AWS RDS)
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });

  pool.on('error', (err) => {
    console.error('Unexpected error on idle PostgreSQL client', err);
  });
} else {
  console.warn(
    'DATABASE_URL environment variable is missing. Database persistence layer is disabled.'
  );
}

/**
 * Executes a SQL query using the connection pool.
 * Falls back gracefully if the database is not configured.
 * 
 * @param {string} text - SQL query string
 * @param {any[]} params - Query parameters
 * @returns {Promise<import('pg').QueryResult>}
 */
async function query(text, params) {
  if (!pool) {
    console.warn(`DB Query bypassed (Database not configured): ${text.substring(0, 50)}...`);
    return { rows: [], rowCount: 0 };
  }
  return pool.query(text, params);
}

module.exports = {
  query,
  pool,
};
