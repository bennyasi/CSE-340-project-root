import db from './db.js';

const getAllProjects = async () => {
    try {
        const result = await db.query(`SELECT project_id, title, description, organization_id, start_date FROM public.project ORDER BY title ASC;`);
        return result.rows || [];
    } catch (error) { console.error("DB ERROR (getAllProjects):", error.message); return []; }
};

const getProjectDetails = async (projectId) => {
    try {
        const result = await db.query(`SELECT project_id, title, description, organization_id, start_date FROM public.project WHERE project_id = $1;`, [projectId]);
        return result.rows[0] || null;
    } catch (error) { console.error("DB ERROR (getProjectDetails):", error.message); return null; }
};

const getProjectsByOrganizationId = async (organizationId) => {
    try {
        const result = await db.query(`SELECT project_id, title, description, start_date FROM public.project WHERE organization_id = $1;`, [organizationId]);
        return result.rows || [];
    } catch (error) { console.error("DB ERROR (getProjectsByOrganizationId):", error.message); return []; }
};

const getProjectsByCategoryId = async (categoryId) => {
    try {
        const result = await db.query(`
            SELECT p.project_id, p.title, p.description 
            FROM public.project p 
            JOIN public.project_category pc ON p.project_id = pc.project_id 
            WHERE pc.category_id = $1;`, [categoryId]);
        return result.rows || [];
    } catch (error) { console.error("DB ERROR (getProjectsByCategoryId):", error.message); return []; }
};

const getUpcomingProjects = async () => {
    try {
        const result = await db.query(`
            SELECT project_id, title, description, start_date 
            FROM public.project 
            ORDER BY start_date ASC 
            LIMIT 5;
        `);
        return result.rows || [];
    } catch (error) { 
        console.error("DB ERROR (getUpcomingProjects):", error.message); 
        return []; 
    }
};

const getProjectCategoryIds = async (projectId) => {
    try {
        const result = await db.query(`SELECT category_id FROM public.project_category WHERE project_id = $1;`, [projectId]);
        return result.rows?.map(row => row.category_id) || [];
    } catch (error) { console.error("DB ERROR (getProjectCategoryIds):", error.message); return []; }
};

const createProject = async (title, description, organizationId) => {
    try {
        const result = await db.query(`INSERT INTO public.project (title, description, organization_id) VALUES ($1, $2, $3) RETURNING project_id;`, [title, description, organizationId]);
        return result.rows[0].project_id;
    } catch (error) { console.error("DB ERROR (createProject):", error.message); throw error; }
};

const updateProject = async (projectId, title, description, organizationId) => {
    try {
        const result = await db.query(`UPDATE public.project SET title = $1, description = $2, organization_id = $3 WHERE project_id = $4 RETURNING project_id;`, [title, description, organizationId, projectId]);
        return result.rows.length > 0 ? result.rows[0].project_id : null;
    } catch (error) { console.error("DB ERROR (updateProject):", error.message); throw error; }
};

// ... (all your functions)

export {
    getAllProjects,
    getProjectDetails,
    getProjectsByOrganizationId,
    getProjectsByCategoryId,
    getUpcomingProjects,
    getProjectCategoryIds,
    createProject,
    updateProject
};