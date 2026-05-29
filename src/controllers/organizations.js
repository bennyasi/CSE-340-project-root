import { body, validationResult } from 'express-validator';
import { getAllOrganizations, getOrganizationDetails, createOrganization, updateOrganization } from '../models/organizations.js';
import { getProjectsByOrganizationId } from '../models/projects.js';

// 1. Organizations list page
const showOrganizationsPage = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Our Partner Organizations';
    res.render('organizations', { title, organizations });
};

// 2. Render the "Add New" Form page
const showNewOrganizationForm = async (req, res) => {
    const title = 'Add New Organization';
    res.render('new-organization', { title });
};

// 3. Organization details page
const showOrganizationDetailsPage = async (req, res) => {
    const organizationId = req.params.id;
    const organizationDetails = await getOrganizationDetails(organizationId);
    const projects = await getProjectsByOrganizationId(organizationId);
    const title = 'Organization Details';

    res.render('organization-details', {
        title,
        organizationDetails,
        projects
    });
};

// 4. Render the Pre-Populated Edit Form View
const showEditOrganizationForm = async (req, res) => {
    try {
        const organizationId = req.params.id;
        const organizationDetails = await getOrganizationDetails(organizationId);

        if (!organizationDetails) {
            return res.status(404).render('error', { title: 'Not Found', message: 'Organization not found' });
        }

        const title = `Edit ${organizationDetails.name}`;
        res.render('edit-organization', { 
            title, 
            organization: organizationDetails 
        });
    } catch (error) {
        console.error("Error loading edit form:", error.message);
        req.flash('error', 'Failed to load the edit form.');
        res.redirect('/organizations');
    }
};

// 5. Activity Rule Definition: Validation and Sanitization Rules
const organizationValidation = [
    body('name')
        .trim()
        .escape()
        .notEmpty()
        .withMessage('Organization name is required')
        .isLength({ min: 3, max: 150 })
        .withMessage('Organization name must be between 3 and 150 characters'),
        
    body('description')
        .trim()
        .escape()
        .notEmpty()
        .withMessage('Organization description is required')
        .isLength({ max: 500 })
        .withMessage('Organization description cannot exceed 500 characters'),
        
    body('contactEmail')
        .normalizeEmail()
        .notEmpty()
        .withMessage('Contact email is required')
        .isEmail()
        .withMessage('Please provide a valid email address')
];

// 6. Form Submission Processor (Create)
const processNewOrganizationForm = async (req, res) => {
    const results = validationResult(req);
    if (!results.isEmpty()) {
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });
        return res.redirect('/new-organization');
    }

    try {
        const { name, description, contactEmail } = req.body;
        const logoFilename = 'placeholder-logo.png';    
        const organizationId = await createOrganization(name, description, contactEmail, logoFilename);
        
        req.flash('success', 'Organization added successfully!');
        res.redirect(`/organizations/${organizationId}`);
    } catch (error) {
        console.error("Error processing form:", error.message);
        req.flash('error', `Failed to create organization: ${error.message}`);
        res.redirect('/new-organization');
    }
};

// 7. Process the Edit Form Submission (Update)
const processEditOrganizationForm = async (req, res) => {
    const organizationId = req.params.id;

    // Check for validation errors
    const results = validationResult(req);
    if (!results.isEmpty()) {
        // Validation failed - loop through errors
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        // Redirect back to the edit organization form
        return res.redirect('/edit-organization/' + organizationId);
    }

    try {
        // Extract data directly from the body matching the assignment's exact naming
        const { name, description, contactEmail, logoFilename } = req.body;

        // Pass all 5 parameters to the model function (fallback logo used if body is empty)
        await updateOrganization(organizationId, name, description, contactEmail, logoFilename || 'placeholder-logo.png');
        
        // Set a success flash message
        req.flash('success', 'Organization updated successfully!');

        // Redirect back to the organization details page (singular path per instructions)
        res.redirect(`/organization/${organizationId}`);
    } catch (error) {
        console.error("Error processing edit form:", error.message);
        req.flash('error', `Failed to update organization: ${error.message}`);
        res.redirect(`/edit-organization/${organizationId}`);
    }
};

// Unified Export Block
export {
    showOrganizationsPage,
    showNewOrganizationForm,
    showOrganizationDetailsPage,
    showEditOrganizationForm,
    organizationValidation,
    processNewOrganizationForm,
    processEditOrganizationForm
};