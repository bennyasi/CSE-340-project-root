// organization.js
import db from './db.js'

const getAllOrganizations = async() => {
    const query = `
        SELECT organization_id, name, description, contact_email, logo_filename
        FROM public.organization;
    `; // Note: Double-check if your table is 'organization' or 'organizations'

    try {
        const result = await db.query(query);
        return result.rows;
    } catch (error) {
        console.error("Error fetching organizations from DB:", error);
        return []; // Return an empty array if the query crashes
    }
}

export { getAllOrganizations } 