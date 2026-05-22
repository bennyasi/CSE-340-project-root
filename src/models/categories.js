// src/models/categories.js
import pool from './db.js';

/**
 * Fetch all categories from the database
 * @returns {Promise<Array>} Array of category objects
 */
export const getAllCategories = async () => {
    try {
        const sql = 'SELECT category_id, name FROM public.category ORDER BY category_id ASC;';
        const res = await pool.query(sql);
        return res.rows;
    } catch (error) {
        console.error('Error fetching categories from DB:', error.message);
        throw error;
    }
};

/**
 * Fetch a single category's details by its ID
 * @param {number} category_id 
 * @returns {Promise<Object|null>} The category object or null
 */
export const getCategoryDetails = async (category_id) => {
    try {
        const sql = 'SELECT category_id, name FROM public.category WHERE category_id = $1;';
        const res = await pool.query(sql, [category_id]);
        return res.rows[0] || null;
    } catch (error) {
        console.error(`Error fetching category details for ID ${category_id}:`, error.message);
        throw error;
    }
};

/**
 * Fetch all projects belonging to a specific category
 * @param {number} category_id 
 * @returns {Promise<Array>} Array of project objects
 */
export const getProjectsByCategoryId = async (category_id) => {
    try {
        const sql = `
            SELECT project_id, title, description, organization_id 
            FROM public.project 
            WHERE category_id = $1 
            ORDER BY title ASC;
        `;
        const res = await pool.query(sql, [category_id]);
        return res.rows || [];
    } catch (error) {
        console.error(`Error fetching projects for category ID ${category_id}:`, error.message);
        throw error;
    }
};