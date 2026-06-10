import express from 'express';

// =======================
// CONTROLLERS
// =======================
import { showHomePage } from '../controllers/index.js';

import {
    showOrganizationsPage,
    showOrganizationDetailsPage,
    showNewOrganizationForm,
    processNewOrganizationForm,
    organizationValidation,
    showEditOrganizationForm,
    processEditOrganizationForm
} from '../controllers/organizations.js';

import {
    showProjectsPage,
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    projectValidation,
    showEditProjectForm,
    processEditProjectForm
} from '../controllers/projects.js';

import {
    showCategoriesPage,
    showCategoryDetailsPage,
    showNewCategoryForm,
    processNewCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm,
    categoryValidation,
    showAssignCategoriesForm,
    processAssignCategoriesForm
} from '../controllers/categories.js';

import { testErrorPage } from '../controllers/errors.js';

import {
    showUserRegistrationForm,
    processUserRegistrationForm,
    showLoginForm,
    processLoginForm,
    processLogout,
    requireLogin,
    requireRole,
    showDashboard,
    showUsersPage
} from '../controllers/user.js';

// =======================
// ROUTER
// =======================
const router = express.Router();

// =======================
// PUBLIC ROUTES
// =======================
router.get('/', showHomePage);

// 🔥 LOGIN (ONLY ONE SOURCE OF TRUTH)
router.get('/login', showLoginForm);
router.post('/login', processLoginForm);

// 🔥 REGISTER
router.get('/register', showUserRegistrationForm);
router.post('/register', processUserRegistrationForm);

// LOGOUT
router.get('/logout', processLogout);

// TEST ERROR
router.get('/test-error', testErrorPage);

// =======================
// AUTH ROUTES
// =======================
router.get('/dashboard', requireLogin, showDashboard);

// =======================
// ADMIN USERS PAGE
// =======================
router.get('/users', requireRole('admin'), showUsersPage);

// =======================
// PROTECTED LIST PAGES
// =======================
router.get('/organizations', requireLogin, showOrganizationsPage);
router.get('/projects', requireLogin, showProjectsPage);
router.get('/categories', requireLogin, showCategoriesPage);

// =======================
// ADMIN CREATE
// =======================
router.get('/new-organization', requireRole('admin'), showNewOrganizationForm);
router.get('/new-project', requireRole('admin'), showNewProjectForm);
router.get('/new-category', requireRole('admin'), showNewCategoryForm);

// =======================
// ADMIN EDIT
// =======================
router.get('/edit-organization/:id', requireRole('admin'), showEditOrganizationForm);
router.get('/edit-project/:id', requireRole('admin'), showEditProjectForm);
router.get('/edit-category/:id', requireRole('admin'), showEditCategoryForm);

// =======================
// ASSIGN CATEGORIES
// =======================
router.get('/assign-categories/:projectId', requireRole('admin'), showAssignCategoriesForm);

// =======================
// POST ROUTES (ADMIN)
// =======================
router.post('/new-organization', requireRole('admin'), organizationValidation, processNewOrganizationForm);
router.post('/new-project', requireRole('admin'), projectValidation, processNewProjectForm);
router.post('/new-category', requireRole('admin'), categoryValidation, processNewCategoryForm);

router.post('/edit-organization/:id', requireRole('admin'), organizationValidation, processEditOrganizationForm);
router.post('/edit-project/:id', requireRole('admin'), processEditProjectForm);
router.post('/edit-category/:id', requireRole('admin'), categoryValidation, processEditCategoryForm);

router.post('/assign-categories/:projectId', requireRole('admin'), processAssignCategoriesForm);

// =======================
// DETAIL ROUTES
// =======================
router.get('/organization/:id', showOrganizationDetailsPage);
router.get('/project/:id', showProjectDetailsPage);
router.get('/category/:id', showCategoryDetailsPage);

export default router;