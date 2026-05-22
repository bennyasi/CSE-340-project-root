import db from './db.js'; 

// 1. Get all organizations
const getAllOrganizations = async () => {
  try {
    const query = `
      SELECT organization_id, name, description, contact_email, logo_filename
      FROM public.organization
      ORDER BY organization_id;
    `;

    const result = await db.query(query);
    return result.rows || [];

  } catch (error) {
    console.error("DB ERROR (getAllOrganizations):", error.message);
    return [];
  }
};

// 2. Get details for a single organization
const getOrganizationDetails = async (organization_id) => {
  try {
    const query = `
      SELECT organization_id, name, description, contact_email, logo_filename
      FROM public.organization
      WHERE organization_id = $1;
    `;

    const result = await db.query(query, [organization_id]);
    return result.rows[0] || null;

  } catch (error) {
    console.error(`DB ERROR (getOrganizationDetails for ID ${organization_id}):`, error.message);
    return null;
  }
};

export { getAllOrganizations, getOrganizationDetails };