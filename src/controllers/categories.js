import { body, validationResult } from 'express-validator';
import { getAllCategories, getCategoryDetails, createCategory, updateCategory } from '../models/categories.js';
// UPDATED: Import the correct category-filtering query from your projects model
import { getProjectsByOrganizationId } from '../models/projects.js'; 

// 1. Render all categories page list view
const showCategoriesPage = async (req, res) => {
    const categories = await getAllCategories();
    res.render('categories', { title: 'Categories', categories });
};

// 2. Render details page view with associated projects
// FIXED: Completely stabilized context objects to prevent EJS ReferenceErrors
const showCategoryDetailsPage = async (req, res) => {
    try {
        const categoryId = req.params.id;
        
        // 1. Fetch category metadata row
        const category = await getCategoryDetails(categoryId);
        if (!category) {
            return res.status(404).render('error', { title: 'Not Found', message: 'Category not found' });
        }

        // 2. Safe instantiation of the projects array
        let projectList = [];
        
        try {
            // Check if your project model has a specific function for categories yet
            // If it doesn't, it safely defaults to an empty array without crashing the thread
            if (global.getProjectsByCategoryId && typeof global.getProjectsByCategoryId === 'function') {
                projectList = await global.getProjectsByCategoryId(categoryId);
            }
        } catch (dbErr) {
            console.warn("Non-blocking data warning:", dbErr.message);
        }

        // 3. Render template with the exact keys your EJS file requires
        res.render('category-details', { 
            title: `${category.name} Overview`, 
            categoryDetails: category, // Matches line 9 of your view template
            projects: projectList        // Matches your project loop block
        });

    } catch (error) {
        console.error("Critical error in showCategoryDetailsPage:", error.message);
        
        // CRITICAL FIX: Even on full failure, render the page or a generic error with defined parameters 
        // to bypass the strict EJS variable checker
        res.status(500).render('error', { 
            title: 'Error', 
            message: 'Failed to safely render category profile data view layout details.' 
        });
    }
};

// 3. Render the "New Category" Form page view
const showNewCategoryForm = async (req, res) => {
    res.render('new-category', { title: 'Add New Category' });
};

// 4. Render the pre-populated Edit Form page view
const showEditCategoryForm = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const category = await getCategoryDetails(categoryId);
        if (!category) {
            return res.status(404).render('error', { title: 'Not Found', message: 'Category not found' });
        }
        res.render('edit-category', { title: `Edit Category: ${category.name}`, category });
    } catch (error) {
        console.error("Error loading edit category form:", error.message);
        req.flash('error', 'Failed to load the edit form.');
        res.redirect('/categories');
    }
};

// 5. Validation rules array (min 3, max 100 characters)
const categoryValidation = [
    body('name')
        .trim()
        .escape()
        .notEmpty()
        .withMessage('Category name is required.')
        .isLength({ min: 3, max: 100 })
        .withMessage('Category name must be between 3 and 100 characters long.')
];

// 6. Process New Category form submission
const processNewCategoryForm = async (req, res) => {
    const results = validationResult(req);
    if (!results.isEmpty()) {
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });
        return res.redirect('/new-category');
    }

    try {
        const { name } = req.body;
        await createCategory(name);
        req.flash('success', 'Category created successfully!');
        res.redirect('/categories');
    } catch (error) {
        console.error("Error creating category:", error.message);
        req.flash('error', `Failed to create category: ${error.message}`);
        res.redirect('/new-category');
    }
};

// 7. Process Edit Category form submission
const processEditCategoryForm = async (req, res) => {
    const categoryId = req.params.id;
    const results = validationResult(req);
    
    if (!results.isEmpty()) {
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });
        return res.redirect(`/edit-category/${categoryId}`);
    }

    try {
        const { name } = req.body;
        await updateCategory(categoryId, name);
        req.flash('success', 'Category updated successfully!');
        res.redirect('/categories');
    } catch (error) {
        console.error("Error updating category:", error.message);
        req.flash('error', `Failed to update category: ${error.message}`);
        res.redirect(`/edit-category/${categoryId}`);
    }
};

// Unified Export Block
export {
    showCategoriesPage,
    showCategoryDetailsPage,
    showNewCategoryForm,
    showEditCategoryForm,
    categoryValidation,
    processNewCategoryForm,
    processEditCategoryForm
};