import { body, validationResult } from 'express-validator';
import { getAllProjects, getProjectDetails, createProject, updateProject, getProjectCategoryIds, updateProjectCategories } from '../models/projects.js';
import { getAllOrganizations } from '../models/organizations.js';
import { getAllCategories } from '../models/categories.js';

// 1. Render main listing page
const showProjectsPage = async (req, res) => {
    try {
        const projects = await getAllProjects();
        res.render('projects', { title: 'Service Projects', projects });
    } catch (error) {
        console.error("Error loading projects:", error.message);
        res.status(500).render('error', { title: 'Error', message: 'Could not load projects.' });
    }
};

// 2. Render target details view layout
const showProjectDetailsPage = async (req, res) => {
    try {
        const projectId = req.params.id;
        const project = await getProjectDetails(projectId);
        if (!project) {
            return res.status(404).render('error', { title: 'Not Found', message: 'Project not found' });
        }
        res.render('project-details', { title: project.title, project });
    } catch (error) {
        console.error("Error loading project details:", error.message);
        res.status(500).render('error', { title: 'Error', message: 'Could not load project details.' });
    }
};

// 3. Render "Add New" Form
const showNewProjectForm = async (req, res) => {
    try {
        const organizations = await getAllOrganizations();
        res.render('new-project', { title: 'Add New Service Project', organizations });
    } catch (error) {
        req.flash('error', 'Could not load the creation form.');
        res.redirect('/projects');
    }
};

// 4. Render Edit Form
const showEditProjectForm = async (req, res) => {
    try {
        const projectId = req.params.id;
        const project = await getProjectDetails(projectId);
        const organizations = await getAllOrganizations();

        if (!project) {
            req.flash('error', 'Project not found.');
            return res.redirect('/projects');
        }
        res.render('edit-project', { title: `Edit Project: ${project.title}`, project, organizations });
    } catch (error) {
        req.flash('error', 'Failed to load project details.');
        res.redirect('/projects');
    }
};

// 5. Validation Rules
const projectValidation = [
    body('title').trim().escape().notEmpty().withMessage('Title is required.').isLength({ min: 3, max: 150 }),
    body('description').trim().escape().notEmpty().withMessage('Description is required.').isLength({ max: 500 }),
    body('startDate').notEmpty().withMessage('Start date is required.').isDate(),
    body('status').notEmpty().withMessage('Status is required.'),
    body('organizationId').notEmpty().withMessage('Organization is required.')
];

// 6. Process New Project
const processNewProjectForm = async (req, res) => {
    const results = validationResult(req);
    if (!results.isEmpty()) {
        results.array().forEach(err => req.flash('error', err.msg));
        return res.redirect('/new-project');
    }
    try {
        const { title, description, startDate, status, organizationId } = req.body;
        const projectId = await createProject(title, description, startDate, status, organizationId);
        req.flash('success', 'Project created successfully!');
        res.redirect(`/projects/${projectId}`);
    } catch (error) {
        req.flash('error', `Failed: ${error.message}`);
        res.redirect('/new-project');
    }
};

// 7. Process Edit Project
const processEditProjectForm = async (req, res) => {
    const projectId = req.params.id;
    const results = validationResult(req);
    if (!results.isEmpty()) {
        results.array().forEach(err => req.flash('error', err.msg));
        return res.redirect(`/projects/edit/${projectId}`);
    }
    try {
        const { title, description, startDate, status, organizationId } = req.body;
        await updateProject(projectId, title, description, startDate, status, organizationId);
        req.flash('success', 'Project updated successfully!');
        res.redirect(`/projects/${projectId}`);
    } catch (error) {
        req.flash('error', `Failed: ${error.message}`);
        res.redirect(`/projects/edit/${projectId}`);
    }
};

// 8. Assign Categories (Criterion 3) - UPDATED
const showAssignCategoriesForm = async (req, res) => {
    try {
        const projectId = req.params.id;
        const project = await getProjectDetails(projectId);
        
        // Safety check to prevent null pointer error in EJS
        if (!project) {
            req.flash('error', 'Project not found.');
            return res.redirect('/projects');
        }

        const allCategories = await getAllCategories();
        const currentCategoryIds = await getProjectCategoryIds(projectId);
        
        res.render('projects/assign-categories', { 
            title: `Manage Categories`, 
            project, 
            allCategories, 
            currentCategoryIds 
        });
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { title: 'Error', message: 'Could not load management panel.' });
    }
};

const processAssignCategories = async (req, res) => {
    try {
        const projectId = req.params.id;
        let { categoryIds } = req.body;
        
        // Handle no selection or single selection
        if (!categoryIds) categoryIds = [];
        if (!Array.isArray(categoryIds)) categoryIds = [categoryIds];
        
        await updateProjectCategories(projectId, categoryIds);
        req.flash('success', 'Categories updated!');
        res.redirect(`/projects/${projectId}`);
    } catch (error) {
        req.flash('error', 'Failed to update categories.');
        res.redirect(`/projects/${req.params.id}/assign-categories`);
    }
};

export {
    showProjectsPage,
    showProjectDetailsPage,
    showNewProjectForm,
    showEditProjectForm,
    projectValidation,
    processNewProjectForm,
    processEditProjectForm,
    showAssignCategoriesForm,
    processAssignCategories
};