import { body, validationResult } from 'express-validator';
import { getAllCategories, getCategoryDetails, createCategory, updateCategory } from '../models/categories.js';
// Make sure this matches your project model file name
import { getProjectsByCategoryId } from '../models/projects.js'; 

// 1. Render all categories page list view
const showCategoriesPage = async (req, res) => {
    try {
        const categories = await getAllCategories();
        res.render('categories', { title: 'Categories', categories });
    } catch (error) {
        res.status(500).render('error', { title: 'Error', message: 'Could not load categories.' });
    }
};

// 2. Render details page view with associated projects
const showCategoryDetailsPage = async (req, res) => {
    try {
        const categoryId = req.params.id;
        
        const category = await getCategoryDetails(categoryId);
        if (!category) {
            return res.status(404).render('error', { title: 'Not Found', message: 'Category not found' });
        }

        // Fetch projects associated with this category
        const projectList = await getProjectsByCategoryId(categoryId) || [];

        res.render('category-details', { 
            title: `${category.name} Overview`, 
            categoryDetails: category, 
            projects: projectList 
        });

    } catch (error) {
        console.error("Critical error in showCategoryDetailsPage:", error.message);
        res.status(500).render('error', { 
            title: 'Error', 
            message: 'Failed to load category details.' 
        });
    }
};

// 3. Render the "New Category" Form
const showNewCategoryForm = async (req, res) => {
    res.render('new-category', { title: 'Add New Category' });
};

// 4. Render the Edit Form
const showEditCategoryForm = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const category = await getCategoryDetails(categoryId);
        if (!category) {
            req.flash('error', 'Category not found.');
            return res.redirect('/categories');
        }
        res.render('edit-category', { title: `Edit Category: ${category.name}`, category });
    } catch (error) {
        req.flash('error', 'Failed to load the edit form.');
        res.redirect('/categories');
    }
};

// 5. Validation rules
const categoryValidation = [
    body('name')
        .trim()
        .escape()
        .notEmpty()
        .withMessage('Category name is required.')
        .isLength({ min: 3, max: 100 })
        .withMessage('Category name must be between 3 and 100 characters.')
];

// 6. Process New Category
const processNewCategoryForm = async (req, res) => {
    const results = validationResult(req);
    if (!results.isEmpty()) {
        results.array().forEach((error) => req.flash('error', error.msg));
        return res.redirect('/new-category');
    }

    try {
        await createCategory(req.body.name);
        req.flash('success', 'Category created successfully!');
        res.redirect('/categories');
    } catch (error) {
        req.flash('error', `Failed to create category: ${error.message}`);
        res.redirect('/new-category');
    }
};

// 7. Process Edit Category
const processEditCategoryForm = async (req, res) => {
    const categoryId = req.params.id;
    const results = validationResult(req);
    
    if (!results.isEmpty()) {
        results.array().forEach((error) => req.flash('error', error.msg));
        return res.redirect(`/edit-category/${categoryId}`);
    }

    try {
        await updateCategory(categoryId, req.body.name);
        req.flash('success', 'Category updated successfully!');
        res.redirect('/categories');
    } catch (error) {
        req.flash('error', `Failed to update category: ${error.message}`);
        res.redirect(`/edit-category/${categoryId}`);
    }
};

export {
    showCategoriesPage,
    showCategoryDetailsPage,
    showNewCategoryForm,
    showEditCategoryForm,
    categoryValidation,
    processNewCategoryForm,
    processEditCategoryForm
};