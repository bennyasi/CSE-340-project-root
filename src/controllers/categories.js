import { body, validationResult } from 'express-validator';

import {
  getAllCategories,
  getCategoryDetails,
  createCategory,
  updateCategory
} from '../models/categories.js';

import {
  getProjectsByCategoryId,
  updateProjectCategory
} from '../models/projects.js';


/* =========================
   ALL CATEGORIES PAGE
========================= */
export const showCategoriesPage = async (req, res, next) => {
  try {
    const categories = await getAllCategories();

    res.render('categories', {
      title: 'Categories',
      categories,
      user: res.locals.user
    });
  } catch (err) {
    next(err);
  }
};


/* =========================
   CATEGORY DETAILS PAGE
========================= */
export const showCategoryDetailsPage = async (req, res, next) => {
  try {
    const category = await getCategoryDetails(req.params.id);

    if (!category) {
      req.flash('error', 'Category not found');
      return res.redirect('/categories');
    }

    const projects = await getProjectsByCategoryId(req.params.id);

    res.render('category', {
      title: `${category.name} Details`,
      categoryDetails: category,
      projects,
      user: res.locals.user
    });

  } catch (err) {
    next(err);
  }
};


/* =========================
   NEW CATEGORY FORM
========================= */
export const showNewCategoryForm = (req, res) => {
  res.render('new-category', {
    title: 'Add New Category',
    user: res.locals.user
  });
};


/* =========================
   EDIT CATEGORY FORM
========================= */
export const showEditCategoryForm = async (req, res, next) => {
  try {
    const category = await getCategoryDetails(req.params.id);

    if (!category) {
      req.flash('error', 'Category not found');
      return res.redirect('/categories');
    }

    res.render('edit-category', {
      title: `Edit ${category.name}`,
      categoryDetails: category,
      user: res.locals.user
    });

  } catch (err) {
    next(err);
  }
};


/* =========================
   VALIDATION
========================= */
export const categoryValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Category name is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Category name must be 3–100 characters')
];


/* =========================
   CREATE CATEGORY
========================= */
export const processNewCategoryForm = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    req.flash('error', errors.array().map(e => e.msg).join(' '));
    return res.redirect('/new-category');
  }

  try {
    await createCategory(req.body.name);

    req.flash('success', 'Category created successfully');
    res.redirect('/categories');

  } catch (err) {
    next(err);
  }
};


/* =========================
   UPDATE CATEGORY
========================= */
export const processEditCategoryForm = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    req.flash('error', errors.array().map(e => e.msg).join(' '));
    return res.redirect(`/edit-category/${req.params.id}`);
  }

  try {
    await updateCategory(req.params.id, req.body.name);

    req.flash('success', 'Category updated successfully');
    res.redirect(`/category/${req.params.id}`);

  } catch (err) {
    next(err);
  }
};


/* =========================
   ASSIGN CATEGORY FORM
========================= */
export const showAssignCategoriesForm = async (req, res, next) => {
  try {
    res.render('assign-categories', {
      title: 'Assign Categories',
      projectId: req.params.projectId,
      user: res.locals.user
    });
  } catch (err) {
    next(err);
  }
};


/* =========================
   PROCESS ASSIGN CATEGORY
========================= */
export const processAssignCategoriesForm = async (req, res, next) => {
  try {
    const { categoryId } = req.body;
    const projectId = req.params.projectId;

    if (!categoryId) {
      req.flash('error', 'Please select a category');
      return res.redirect(`/assign-categories/${projectId}`);
    }

    await updateProjectCategory(projectId, categoryId);

    req.flash('success', 'Category assigned successfully');
    res.redirect(`/project/${projectId}`);

  } catch (err) {
    next(err);
  }
};