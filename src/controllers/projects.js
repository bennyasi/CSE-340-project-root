import { body, validationResult } from 'express-validator';

import {
    getAllProjects,
    getProjectDetails,
    createProject,
    updateProject
} from '../models/projects.js';

import { getAllOrganizations } from '../models/organizations.js';
import { getAllCategories } from '../models/categories.js';

/* =========================
   ALL PROJECTS PAGE
========================= */
const showProjectsPage = async (req, res, next) => {
    try {
        const projects = await getAllProjects();
        const organizations = await getAllOrganizations();
        const categories = await getAllCategories();

        res.render('projects', {
            title: 'Service Projects',
            projects,
            organizations,
            categories,
            user: res.locals.user
        });
    } catch (error) {
        next(error);
    }
};

/* =========================
   PROJECT DETAILS PAGE
========================= */
const showProjectDetailsPage = async (req, res, next) => {
    try {
        const project = await getProjectDetails(req.params.id);

        if (!project) {
            req.flash('error', 'Project not found.');
            return res.redirect('/projects');
        }

        res.render('project', {
            title: project.title,
            project,
            user: res.locals.user
        });

    } catch (error) {
        next(error);
    }
};

/* =========================
   NEW PROJECT FORM
========================= */
const showNewProjectForm = async (req, res, next) => {
    try {
        const [organizations, categories] = await Promise.all([
            getAllOrganizations(),
            getAllCategories()
        ]);

        res.render('new-project', {
            title: 'New Project',
            organizations,
            categories,
            user: res.locals.user
        });

    } catch (error) {
        next(error);
    }
};

/* =========================
   EDIT PROJECT FORM
========================= */
const showEditProjectForm = async (req, res, next) => {
    try {
        const [project, organizations, categories] = await Promise.all([
            getProjectDetails(req.params.id),
            getAllOrganizations(),
            getAllCategories()
        ]);

        if (!project) {
            req.flash('error', 'Project not found.');
            return res.redirect('/projects');
        }

        res.render('edit-project', {
            title: 'Edit Project',
            project,
            organizations,
            categories,
            user: res.locals.user
        });

    } catch (error) {
        next(error);
    }
};

/* =========================
   VALIDATION
========================= */
const projectValidation = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required.')
        .isLength({ min: 3 }).withMessage('Title must be at least 3 characters.'),

    body('description')
        .trim()
        .notEmpty().withMessage('Description is required.'),

    body('organizationId')
        .notEmpty().withMessage('Organization is required.'),

    body('categoryId')
        .notEmpty().withMessage('Category is required.')
];

/* =========================
   CREATE PROJECT
========================= */
const processNewProjectForm = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        req.flash('error', errors.array().map(e => e.msg).join(' '));
        return res.redirect('/new-project');
    }

    try {
        const { title, description, organizationId, categoryId } = req.body;

        const projectId = await createProject(
            title,
            description,
            organizationId,
            categoryId
        );

        req.flash('success', 'Project created successfully!');
        res.redirect(`/project/${projectId}`);

    } catch (error) {
        next(error);
    }
};

/* =========================
   UPDATE PROJECT
========================= */
const processEditProjectForm = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        req.flash('error', errors.array().map(e => e.msg).join(' '));
        return res.redirect(`/edit-project/${req.params.id}`);
    }

    try {
        const { title, description, organizationId, categoryId } = req.body;

        await updateProject(
            req.params.id,
            title,
            description,
            organizationId,
            categoryId
        );

        req.flash('success', 'Project updated successfully!');
        res.redirect(`/project/${req.params.id}`);

    } catch (error) {
        next(error);
    }
};

/* =========================
   EXPORTS
========================= */
export {
    showProjectsPage,
    showProjectDetailsPage,
    showNewProjectForm,
    showEditProjectForm,
    projectValidation,
    processNewProjectForm,
    processEditProjectForm
};