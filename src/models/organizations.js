import db from './db.js';

const getAllOrganizations = async () => {
  try {
    const query = `
      SELECT organization_id, name, description, contact_email, logo_filename
      FROM public.organization
      ORDER BY organization_id;
    `;

    const result = await db.query(query);

    return result.rows;

  } catch (error) {
    console.error("DB ERROR (organizations):", error.message);
    return []; // prevents blank page
  }
};

export { getAllOrganizations };