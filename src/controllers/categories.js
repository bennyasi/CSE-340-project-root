import { body, validationResult } from 'express-validator';
import {
  getAllCategories,
  getCategoryDetails,
  createCategory,
  updateCategory
} from '../models/categories.js';
import { getProjectsByCategoryId } from '../models/projects.js';

// 1. Categories list
const showCategoriesPage = async (req, res, next) => {
  try {
    const categories = await getAllCategories();
    res.render('categories', { title: 'Categories', categories });
  } catch (error) {
    next(error); // Uses global error handler
  }
};

// 2. Category details
const showCategoryDetailsPage = async (req, res, next) => {
  try {
    const category = await getCategoryDetails(req.params.id);
    if (!category) {
      req.flash('error', 'Category not found');
      return res.redirect('/categories');
    }
    const projects = await getProjectsByCategoryId(req.params.id);
    
    // Passing 'categoryDetails' to match your view expectation
    res.render('category', { 
      title: `${category.name} Details`, 
      categoryDetails: category, 
      projects 
    });
  } catch (error) {
    next(error);
  }
};

// 3. New category form
const showNewCategoryForm = (req, res) => {
  res.render('new-category', { title: 'Add New Category' });
};

// 4. Edit form (pre-filled)
const showEditCategoryForm = async (req, res, next) => {
  try {
    const category = await getCategoryDetails(req.params.id);
    if (!category) {
      req.flash('error', 'Category not found');
      return res.redirect('/categories');
    }
    res.render('edit-category', { title: `Edit ${category.name}`, categoryDetails: category });
  } catch (error) {
    next(error);
  }
};

// 5. Validation rules
const categoryValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Category name is required')
    .isLength({ min: 3, max: 100 }).withMessage('Name must be between 3 and 100 characters')
];

// 6. Create category
const processNewCategoryForm = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash('error', errors.array().map(e => e.msg).join(' '));
    return res.redirect('/new-category');
  }
  try {
    await createCategory(req.body.name);
    req.flash('success', 'Category created successfully');
    res.redirect('/categories');
  } catch (error) {
    next(error);
  }
};

// 7. Update category
const processEditCategoryForm = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash('error', errors.array().map(e => e.msg).join(' '));
    return res.redirect(`/edit-category/${req.params.id}`);
  }
  try {
    await updateCategory(req.params.id, req.body.name);
    req.flash('success', 'Category updated successfully');
    res.redirect(`/category/${req.params.id}`);
  } catch (error) {
    req.flash('error', 'Update failed: ' + error.message);
    res.redirect(`/edit-category/${req.params.id}`);
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