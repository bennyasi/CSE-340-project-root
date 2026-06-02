import { body, validationResult } from 'express-validator';
import {
    getAllProjects,
    getProjectDetails,
    createProject,
    updateProject
} from '../models/projects.js';
import { getAllOrganizations } from '../models/organizations.js';
import { getAllCategories } from '../models/categories.js';

// 1. Show all projects
const showProjectsPage = async (req, res, next) => {
    try {
        const projects = await getAllProjects();
        res.render('projects', { title: 'Service Projects', projects });
    } catch (error) {
        next(error);
    }
};

// 2. Show details
const showProjectDetailsPage = async (req, res, next) => {
    try {
        const project = await getProjectDetails(req.params.id);
        if (!project) {
            req.flash('error', 'Project not found.');
            return res.redirect('/projects');
        }
        res.render('project', { project });
    } catch (error) {
        next(error);
    }
};

// 3. Show create form
const showNewProjectForm = async (req, res, next) => {
    try {
        const [organizations, categories] = await Promise.all([getAllOrganizations(), getAllCategories()]);
        res.render('new-project', { title: 'New Project', organizations, categories });
    } catch (error) {
        next(error);
    }
};

// 4. Show edit form
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
        res.render('edit-project', { title: 'Edit Project', project, organizations, categories });
    } catch (error) {
        next(error);
    }
};

// 5. Validation Rules
const projectValidation = [
    body('title').trim().notEmpty().withMessage('Title is required.').isLength({ min: 3 }).withMessage('Title must be at least 3 characters.'),
    body('description').trim().notEmpty().withMessage('Description is required.'),
    body('organizationId').isInt().withMessage('Valid organization is required.')
];

// 6. Create
const processNewProjectForm = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('error', errors.array().map(e => e.msg).join(' '));
        return res.redirect('/new-project'); 
    }

    try {
        const { title, description, organizationId } = req.body;
        const projectId = await createProject(title, description, organizationId);
        req.flash('success', 'Project created successfully!');
        res.redirect(`/projects/${projectId}`);
    } catch (error) {
        next(error);
    }
};

// 7. Update
const processEditProjectForm = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('error', errors.array().map(e => e.msg).join(' '));
        return res.redirect(`/projects/edit/${req.params.id}`);
    }
    try {
        const { title, description, organizationId } = req.body;
        await updateProject(req.params.id, title, description, organizationId);
        req.flash('success', 'Project updated successfully!');
        res.redirect(`/projects/${req.params.id}`);
    } catch (error) {
        req.flash('error', 'Update failed: ' + error.message);
        res.redirect(`/projects/edit/${req.params.id}`);
    }
};

export {
    showProjectsPage,
    showProjectDetailsPage,
    showNewProjectForm,
    showEditProjectForm,
    projectValidation,
    processNewProjectForm,
    processEditProjectForm
};