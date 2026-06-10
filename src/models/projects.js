import db from './db.js';

/* =========================
   GET ALL PROJECTS
========================= */
const getAllProjects = async () => {
    try {
        const result = await db.query(`
            SELECT
                p.project_id,
                p.title,
                p.description,
                p.organization_id,
                p.category_id,
                c.name AS category_name,
                p.start_date
            FROM public.project p
            LEFT JOIN public.category c
                ON p.category_id = c.category_id
            ORDER BY p.title ASC;
        `);

        return result.rows || [];
    } catch (error) {
        console.error('DB ERROR (getAllProjects):', error.message);
        return [];
    }
};

/* =========================
   GET PROJECT DETAILS
========================= */
const getProjectDetails = async (projectId) => {
    try {
        const result = await db.query(`
            SELECT
                p.project_id,
                p.title,
                p.description,
                p.organization_id,
                p.category_id,
                c.name AS category_name,
                p.start_date
            FROM public.project p
            LEFT JOIN public.category c
                ON p.category_id = c.category_id
            WHERE p.project_id = $1;
        `, [projectId]);

        return result.rows[0] || null;
    } catch (error) {
        console.error('DB ERROR (getProjectDetails):', error.message);
        return null;
    }
};

/* =========================
   GET PROJECTS BY ORGANIZATION
========================= */
const getProjectsByOrganizationId = async (organizationId) => {
    try {
        const result = await db.query(`
            SELECT
                p.project_id,
                p.title,
                p.description,
                p.category_id,
                c.name AS category_name,
                p.start_date
            FROM public.project p
            LEFT JOIN public.category c
                ON p.category_id = c.category_id
            WHERE p.organization_id = $1;
        `, [organizationId]);

        return result.rows || [];
    } catch (error) {
        console.error('DB ERROR (getProjectsByOrganizationId):', error.message);
        return [];
    }
};

/* =========================
   GET PROJECTS BY CATEGORY
========================= */
const getProjectsByCategoryId = async (categoryId) => {
    try {
        const result = await db.query(`
            SELECT
                project_id,
                title,
                description,
                organization_id,
                category_id
            FROM public.project
            WHERE category_id = $1;
        `, [categoryId]);

        return result.rows || [];
    } catch (error) {
        console.error('DB ERROR (getProjectsByCategoryId):', error.message);
        return [];
    }
};

/* =========================
   CREATE PROJECT
========================= */
const createProject = async (
    title,
    description,
    organizationId,
    categoryId
) => {
    try {
        const result = await db.query(`
            INSERT INTO public.project
            (
                title,
                description,
                organization_id,
                category_id
            )
            VALUES ($1, $2, $3, $4)
            RETURNING project_id;
        `, [
            title,
            description,
            organizationId,
            categoryId
        ]);

        return result.rows[0].project_id;
    } catch (error) {
        console.error('DB ERROR (createProject):', error.message);
        throw error;
    }
};

/* =========================
   UPDATE PROJECT
========================= */
const updateProject = async (
    projectId,
    title,
    description,
    organizationId,
    categoryId
) => {
    try {
        const result = await db.query(`
            UPDATE public.project
            SET
                title = $1,
                description = $2,
                organization_id = $3,
                category_id = $4
            WHERE project_id = $5
            RETURNING project_id;
        `, [
            title,
            description,
            organizationId,
            categoryId,
            projectId
        ]);

        return result.rows[0]?.project_id || null;
    } catch (error) {
        console.error('DB ERROR (updateProject):', error.message);
        throw error;
    }
};

/* =========================
   UPDATE PROJECT CATEGORY
========================= */
const updateProjectCategory = async (
    projectId,
    categoryId
) => {
    try {
        await db.query(`
            UPDATE public.project
            SET category_id = $1
            WHERE project_id = $2;
        `, [categoryId, projectId]);
    } catch (error) {
        console.error(
            'DB ERROR (updateProjectCategory):',
            error.message
        );
        throw error;
    }
};

/* =========================
   EXPORTS
========================= */
export {
    getAllProjects,
    getProjectDetails,
    getProjectsByOrganizationId,
    getProjectsByCategoryId,
    createProject,
    updateProject,
    updateProjectCategory
};