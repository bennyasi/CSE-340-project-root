import express from 'express';
import { showHomePage } from '../controllers/index.js';
import { 
    showOrganizationsPage, 
    showOrganizationDetailsPage, 
    showNewOrganizationForm, 
    showEditOrganizationForm, 
    organizationValidation, 
    processNewOrganizationForm, 
    processEditOrganizationForm 
} from '../controllers/organizations.js';
import { 
    showProjectsPage, 
    showProjectDetailsPage, 
    showNewProjectForm, 
    showEditProjectForm, 
    projectValidation, 
    processNewProjectForm, 
    processEditProjectForm 
} from '../controllers/projects.js';
import { 
    showCategoriesPage, 
    showCategoryDetailsPage, 
    showNewCategoryForm, 
    showEditCategoryForm, 
    categoryValidation, 
    processNewCategoryForm, 
    processEditCategoryForm 
} from '../controllers/categories.js';
import { testErrorPage } from '../controllers/errors.js';

const router = express.Router();

// Debugging Middleware
router.use((req, res, next) => {
    console.log(`DEBUG: Route hit for ${req.method} ${req.url}`);
    next();
});

/* --- 1. Core Top-Level Routes --- */
router.get('/', showHomePage);
router.get('/organizations', showOrganizationsPage);
router.get('/projects', showProjectsPage);
router.get('/categories', showCategoriesPage);

/* --- 2. Organization Workflows --- */
router.get('/new-organization', showNewOrganizationForm);
router.post('/new-organization', organizationValidation, processNewOrganizationForm);
router.get('/organizations/:id', showOrganizationDetailsPage);
router.get('/organizations/edit/:id', showEditOrganizationForm);
router.post('/organizations/update/:id', organizationValidation, processEditOrganizationForm);

/* --- 3. Project Workflows --- */
router.get('/new-project', showNewProjectForm);
router.post('/new-project', projectValidation, processNewProjectForm);
router.get('/projects/:id', showProjectDetailsPage);
router.get('/projects/edit/:id', showEditProjectForm);
router.post('/projects/update/:id', projectValidation, processEditProjectForm);

/* --- 4. Category Workflows --- */
router.get('/new-category', showNewCategoryForm);
router.post('/new-category', categoryValidation, processNewCategoryForm);
router.get('/categories/:id', showCategoryDetailsPage);
router.get('/categories/edit/:id', showEditCategoryForm);
router.post('/categories/update/:id', categoryValidation, processEditCategoryForm);

/* --- 5. Debugging --- */
router.get('/test-error', testErrorPage);

export default router;