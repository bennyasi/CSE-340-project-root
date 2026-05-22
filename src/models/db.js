import dotenv from 'dotenv';
dotenv.config(); // REQUIRED: Loads your .env file into process.env before anything else runs

import pg from 'pg';
const { Pool } = pg;

/**
 * PostgreSQL connection pool (Render-safe with forced SSL handling)
 */
const pool = new Pool({
  connectionString: process.env.DB_URL || process.env.DATABASE_URL,

  // Force SSL handling with self-signed certificate acceptance (crucial for Render/Neon)
  ssl: { rejectUnauthorized: false },

  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  family: 4,
});

/**
 * Query function
 */
const query = async (text, params = [], retries = 2) => {
  try {
    const start = Date.now();
    const result = await pool.query(text, params);
    const duration = Date.now() - start;

    if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
      console.log('Query executed:', {
        text: text.replace(/\s+/g, ' ').trim(),
        duration: `${duration}ms`,
        rows: result.rowCount,
      });
    }

    return result;

  } catch (error) {
    console.error('Database query error:', {
      message: error.message,
      code: error.code,
    });

    if (retries > 0) {
      console.log(`Retrying query... (${retries} left)`);
      return query(text, params, retries - 1);
    }

    throw error;
  }
};

/**
 * Test DB connection
 */
const testConnection = async () => {
  try {
    const result = await query('SELECT NOW() as current_time');
    console.log('Database connected:', result.rows[0].current_time);
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