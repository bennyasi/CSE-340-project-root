// src/models/projects.js
import pool from './db.js';

/**
 * Fetch all projects from the database
 * @returns {Promise<Array>} Array of project objects
 */
export const getAllProjects = async () => {
    try {
        // Query to select all core project details from the project table
        const sql = 'SELECT project_id, title, description, category_id, organization_id FROM public.project ORDER BY project_id ASC;';
        const res = await pool.query(sql);
        
        // Return the rows array containing the records
        return res.rows;
    } catch (error) {
        console.error('Error fetching projects from DB:', error.message);
        throw error;
    }
};