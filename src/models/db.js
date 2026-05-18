import { Pool } from 'pg';

/**
 * PostgreSQL connection pool
 * Uses DB_URL from .env
 */

const pool = new Pool({
  connectionString: process.env.DB_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

/**
 * Wrapper for queries (adds logging in dev mode)
 */
const query = async (text, params) => {
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
    console.error('Database query error:', {
      text: text.replace(/\s+/g, ' ').trim(),
      error: error.message,
    });
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

export default {
  query,
  close: () => pool.end(),
};

export { testConnection };
