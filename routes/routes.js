import express from 'express';

import { showHomePage } from '../controllers/index.js';
import { showOrganizationsPage, showOrganizationDetailsPage } from '../controllers/organizations.js';
import { showProjectsPage } from '../controllers/projects.js';
import { showCategoriesPage } from '../controllers/categories.js';
import { testErrorPage } from '../controllers/errors.js';

const router = express.Router();

/* Pages */
router.get('/', showHomePage);
router.get('/organizations', showOrganizationsPage);
router.get('/projects', showProjectsPage);
router.get('/categories', showCategoriesPage);

/* Details */
router.get('/organization/:id', showOrganizationDetailsPage);

/* Test error */
router.get('/test-error', testErrorPage);

export default router;