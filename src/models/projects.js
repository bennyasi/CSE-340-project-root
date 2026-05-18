import db from './db.js';

const getAllProjects = async () => {
  try {
    const query = `
      SELECT project_id, title, description, category_id, organization_id
      FROM project
      ORDER BY project_id;
    `;

    const result = await db.query(query);

    return result.rows || [];

  } catch (error) {
    console.error('PROJECTS ERROR:', error.message);
    return [];
  }
};

export { getAllProjects };