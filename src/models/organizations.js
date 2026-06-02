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

// 3. Create a new organization record
const createOrganization = async (name, description, contactEmail, logoFilename) => {
  try {
    const query = `
      INSERT INTO organization (name, description, contact_email, logo_filename)
      VALUES ($1, $2, $3, $4)
      RETURNING organization_id;
    `;

    const queryParams = [name, description, contactEmail, logoFilename];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
      throw new Error('Failed to create organization');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
      console.log('Created new organization with ID:', result.rows[0].organization_id);
    }

    return result.rows[0].organization_id;

  } catch (error) {
    console.error("DB ERROR (createOrganization):", error.message);
    throw error; 
  }
};

// 4. Update an organization record using sample code criteria
const updateOrganization = async (organizationId, name, description, contactEmail, logoFilename) => {
  try {
    const query = `
      UPDATE organization
      SET name = $1, description = $2, contact_email = $3, logo_filename = $4
      WHERE organization_id = $5
      RETURNING organization_id;
    `;

    const queryParams = [name, description, contactEmail, logoFilename, organizationId];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
      throw new Error('Organization not found');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
      console.log('Updated organization with ID:', organizationId);
    }

    return result.rows[0].organization_id;
  } catch (error) {
    console.error("DB ERROR (updateOrganization):", error.message);
    throw error;
  }
};

// Unified Export Block - Exporting all 4 functions cleanly
export { 
    getAllOrganizations, 
    getOrganizationDetails, 
    createOrganization, 
    updateOrganization 
};