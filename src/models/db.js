import dotenv from 'dotenv';
dotenv.config();

import pg from 'pg';
const { Pool } = pg;

// Debugging: Log the current DB_URL value to Render logs
console.log("Checking DB_URL:", process.env.DB_URL);

/**
 * Render PostgreSQL connection (CLOUD ONLY)
 */
const pool = new Pool({
  connectionString: process.env.DB_URL,

  ssl: {
    rejectUnauthorized: false
  },

  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 15000
});

/**
 * Query helper
 */
const query = async (text, params = [], retries = 2) => {
  try {
    const start = Date.now();
    const result = await pool.query(text, params);

    const duration = Date.now() - start;

    if (process.env.NODE_ENV === 'development') {
      console.log('Query executed:', {
        text: text.replace(/\s+/g, ' ').trim(),
        duration: `${duration}ms`,
        rows: result.rowCount,
      });
    }

    return result;

  } catch (error) {
    console.error('Database query error:', error.message);

    if (retries > 0) {
      console.log(`Retrying query... (${retries} left)`);
      return query(text, params, retries - 1);
    }

    throw error;
  }
};

/**
 * Test connection
 */
const testConnection = async () => {
  const result = await query('SELECT NOW() as current_time');
  console.log('Database connected:', result.rows[0].current_time);
};

/**
 * Close pool
 */
const close = async () => {
  await pool.end();
};

export default { query, close };
export { testConnection };
