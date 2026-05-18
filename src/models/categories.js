// src/models/categories.js
import pool from './db.js';

/**
 * Fetch all categories from the database
 * @returns {Promise<Array>} Array of category objects
 */
export const getAllCategories = async () => {
    try {
        // Query to select all columns from the category table
        const sql = 'SELECT category_id, name FROM public.category ORDER BY category_id ASC;';
        const res = await pool.query(sql);
        
        // Return the rows array containing the records
        return res.rows;
    } catch (error) {
        console.error('Error fetching categories from DB:', error.message);
        throw error;
    }
};