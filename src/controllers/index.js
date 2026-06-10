import { getAllOrganizations } from '../models/organizations.js';

// Define controller functions
const showHomePage = async (req, res, next) => {
    try {
        const title = 'Home';
        
        // Fetch organizations from the database
        const organizations = await getAllOrganizations();
        
        // Filter out duplicates if your database has them
        const uniqueOrgs = organizations.filter((org, index, self) =>
            index === self.findIndex((o) => o.name === org.name)
        );

        // Render the home page with the fetched data
        res.render('home', { 
            title, 
            organizations: uniqueOrgs 
        });
    } catch (error) {
        // Pass errors to your error handling middleware
        next(error);
    }
};

// Export functions
export { showHomePage };