import db from './db.js';

// 1. Get all projects
const getAllProjects = async () => {
  try {
    const query = `
      SELECT project_id, title, description, start_date, status, organization_id
      FROM public.project
      ORDER BY title ASC;
    `;
    const result = await db.query(query);
    return result.rows || [];
  } catch (error) {
    console.error("DB ERROR (getAllProjects):", error.message);
    return [];
  }
};

// 2. Get details for a single project
const getProjectDetails = async (projectId) => {
  try {
    const query = `
      SELECT project_id, title, description, start_date, status, organization_id
      FROM public.project
      WHERE project_id = $1;
    `;
    const result = await db.query(query, [projectId]);
    return result.rows[0] || null;
  } catch (error) {
    console.error(`DB ERROR (getProjectDetails for ID ${projectId}):`, error.message);
    return null;
  }
};

// 3. Get projects by org
const getProjectsByOrganizationId = async (organizationId) => {
  try {
    const query = `
      SELECT project_id, title, status
      FROM public.project
      WHERE organization_id = $1;
    `;
    const result = await db.query(query, [organizationId]);
    return result.rows || [];
  } catch (error) {
    console.error("DB ERROR (getProjectsByOrganizationId):", error.message);
    return [];
  }
};

// 4. Create new project
const createProject = async (title, description, startDate, status, organizationId) => {
  try {
    const query = `
      INSERT INTO public.project (title, description, start_date, status, organization_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING project_id;
    `;
    const result = await db.query(query, [title, description, startDate, status, organizationId]);
    return result.rows[0].project_id;
  } catch (error) {
    console.error("DB ERROR (createProject):", error.message);
    throw error;
  }
};

// 5. Update existing project
const updateProject = async (projectId, title, description, startDate, status, organizationId) => {
  try {
    const query = `
      UPDATE public.project
      SET title = $1, description = $2, start_date = $3, status = $4, organization_id = $5
      WHERE project_id = $6
      RETURNING project_id;
    `;
    const result = await db.query(query, [title, description, startDate, status, organizationId, projectId]);
    if (result.rows.length === 0) throw new Error('Project not found.');
    return result.rows[0].project_id;
  } catch (error) {
    console.error("DB ERROR (updateProject):", error.message);
    throw error;
  }
};

// 6. NEW: Fetch category IDs linked to a project
const getProjectCategoryIds = async (projectId) => {
  try {
    const query = `SELECT category_id FROM public.project_category WHERE project_id = $1`;
    const result = await db.query(query, [projectId]);
    return result.rows.map(row => row.category_id);
  } catch (error) {
    console.error("DB ERROR (getProjectCategoryIds):", error.message);
    return [];
  }
};

// 7. NEW: Update project category assignments (Transaction)
const updateProjectCategories = async (projectId, categoryIds) => {
  const client = await db.connect();
  try {
    await client.query('BEGIN');
    await client.query(`DELETE FROM public.project_category WHERE project_id = $1`, [projectId]);
    for (let catId of categoryIds) {
      await client.query(`INSERT INTO public.project_category (project_id, category_id) VALUES ($1, $2)`, [projectId, catId]);
    }
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};
// 8. NEW: Fetch projects by category ID
const getProjectsByCategoryId = async (categoryId) => {
  try {
    const query = `
      SELECT p.project_id, p.title 
      FROM public.project p
      JOIN public.project_category pc ON p.project_id = pc.project_id
      WHERE pc.category_id = $1
      ORDER BY p.title ASC;
    `;
    const result = await db.query(query, [categoryId]);
    return result.rows || [];
  } catch (error) {
    console.error("DB ERROR (getProjectsByCategoryId):", error.message);
    return [];
  }
};

export {
  getAllProjects,
  getProjectDetails,
  getProjectsByOrganizationId,
  createProject,
  updateProject,
  getProjectCategoryIds,
  updateProjectCategories,
  getProjectsByCategoryId // Add this to your export list
};