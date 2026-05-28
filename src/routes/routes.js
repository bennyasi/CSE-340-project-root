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
    processEditProjectForm,
    showAssignCategoriesForm,
    processAssignCategories
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

/* --- 1. Core Top-Level Routes --- */
router.get('/', showHomePage);
router.get('/organizations', showOrganizationsPage);
router.get('/projects', showProjectsPage);
router.get('/categories', showCategoriesPage);

/* --- 2. Organization Workflows --- */
router.get('/new-organization', showNewOrganizationForm);
router.post('/new-organization', organizationValidation, processNewOrganizationForm);
router.get('/organizations/:id', showOrganizationDetailsPage);
// These now match the "/organizations/edit/:id" pattern used in your views
router.get('/organizations/edit/:id', showEditOrganizationForm);
router.post('/organizations/edit/:id', organizationValidation, processEditOrganizationForm);

/* --- 3. Project Workflows --- */
router.get('/new-project', showNewProjectForm);
router.post('/new-project', projectValidation, processNewProjectForm);
router.get('/projects/:id', showProjectDetailsPage);
router.get('/projects/edit/:id', showEditProjectForm);
router.post('/projects/edit/:id', projectValidation, processEditProjectForm);

// CRITERION 3: Category assignment routes
router.get('/projects/:id/assign-categories', showAssignCategoriesForm);
router.post('/projects/:id/assign-categories', processAssignCategories);

/* --- 4. Category Workflows --- */
router.get('/new-category', showNewCategoryForm);
router.post('/new-category', categoryValidation, processNewCategoryForm);
router.get('/categories/:id', showCategoryDetailsPage);
router.get('/categories/edit/:id', showEditCategoryForm);
router.post('/categories/edit/:id', categoryValidation, processEditCategoryForm);

/* --- 5. Debugging / Error Generation --- */
router.get('/test-error', testErrorPage);

export default router;