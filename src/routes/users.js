// src/routes/users.js

import express from 'express';

import {
    showDashboard,
    showUsersPage,
    requireLogin,
    requireRole
} from '../controllers/user.js';

const router = express.Router();

// Dashboard
router.get(
    '/dashboard',
    requireLogin,
    showDashboard
);

// Admin Users List
router.get(
    '/',
    requireLogin,
    requireRole('admin'),
    showUsersPage
);

export default router;