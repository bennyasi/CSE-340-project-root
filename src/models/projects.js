import db from './db.js';

// 1. Get all projects
const getAllProjects = async () => {
  try {
    const query = `
      SELECT project_id, title, description, category_id, organization_id
      FROM public.project
      ORDER BY project_id;
    `;

    const result = await db.query(query);
    return result.rows || [];

  } catch (error) {
    console.error('PROJECTS ERROR (getAllProjects):', error.message);
    return [];
  }
};

// 2. Get projects for a specific organization
const getProjectsByOrganizationId = async (organization_id) => {
  try {
    const query = `
      SELECT project_id, title, description, category_id, organization_id
      FROM public.project
      WHERE organization_id = $1
      ORDER BY project_id;
    `;

    const result = await db.query(query, [organization_id]);
    return result.rows || [];

  } catch (error) {
    console.error(`PROJECTS ERROR (getProjectsByOrganizationId for Org ${organization_id}):`, error.message);
    return [];
  }
};

export { getAllProjects, getProjectsByOrganizationId };