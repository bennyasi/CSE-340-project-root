import { Pool } from 'pg';

/**
 * PostgreSQL connection pool (Render-safe)
 */

const pool = new Pool({
  connectionString: process.env.DB_URL,

  ssl: {
    rejectUnauthorized: false,
  },

  // Stability improvements
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

/**
 * Query wrapper with retry + FULL error logging
 */
const query = async (text, params = [], retries = 2) => {
  try {
    const start = Date.now();

    const res = await pool.query(text, params);

    const duration = Date.now() - start;

    if (process.env.NODE_ENV === 'development') {
      console.log('Executed query:', {
        text: text.replace(/\s+/g, ' ').trim(),
        duration: `${duration}ms`,
        rows: res.rowCount,
      });
    }

    return res;

  } catch (error) {
    // 🔥 FULL ERROR OUTPUT (FIXED)
    console.error(
      'Database query error FULL:',
      JSON.stringify({
        text,
        message: error?.message,
        code: error?.code,
        detail: error?.detail,
        hint: error?.hint,
        stack: error?.stack
      }, null, 2)
    );

    // Retry logic (Render instability fix)
    if (retries > 0) {
      console.log(`Retrying query... attempts left: ${retries}`);
      return query(text, params, retries - 1);
    }

    throw error;
  }
};

/**
 * Test database connection
 */
const testConnection = async () => {
  try {
    const result = await query('SELECT NOW() as current_time');

    console.log(
      'Database connection successful:',
      result.rows[0].current_time
    );

    return true;

  } catch (error) {
    console.error('Database connection failed:', error.message);
    throw error;
  }
};

/**
 * Graceful shutdown
 */
const close = async () => {
  await pool.end();
};

export default {
  query,
  close,
};

export { testConnection };
