import { body, validationResult } from 'express-validator';
import {
  getAllOrganizations,
  getOrganizationDetails,
  createOrganization,
  updateOrganization
} from '../models/organizations.js';
import { getProjectsByOrganizationId } from '../models/projects.js';

// 1. List
const showOrganizationsPage = async (req, res, next) => {
  try {
    const organizations = await getAllOrganizations();
    res.render('organizations', { title: 'Our Partner Organizations', organizations });
  } catch (err) { next(err); }
};

// 2. New Form
const showNewOrganizationForm = (req, res) => {
  res.render('new-organization', { title: 'Add New Organization' });
};

// 3. Details
const showOrganizationDetailsPage = async (req, res, next) => {
  try {
    const organizationDetails = await getOrganizationDetails(req.params.id);
    if (!organizationDetails) return res.status(404).render('errors/404', { title: 'Not Found' });
    
    const projects = await getProjectsByOrganizationId(req.params.id);
    res.render('organization', { title: 'Organization Details', organizationDetails, projects });
  } catch (err) { next(err); }
};

// 4. Edit Form
const showEditOrganizationForm = async (req, res, next) => {
  try {
    const organizationDetails = await getOrganizationDetails(req.params.id);
    if (!organizationDetails) {
      req.flash('error', 'Organization not found');
      return res.redirect('/organizations');
    }
    res.render('edit-organization', { title: `Edit ${organizationDetails.name}`, organization: organizationDetails });
  } catch (err) { next(err); }
};

// 5. Validation
const organizationValidation = [
  body('name').trim().notEmpty().isLength({ min: 3, max: 150 }),
  body('description').trim().notEmpty().isLength({ max: 500 }),
  body('contactEmail').trim().notEmpty().isEmail()
];

// 6. Process New
const processNewOrganizationForm = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    errors.array().forEach(err => req.flash('error', err.msg));
    return res.redirect('/new-organization');
  }
  try {
    const { name, description, contactEmail } = req.body;
    const id = await createOrganization(name, description, contactEmail, 'placeholder-logo.png');
    req.flash('success', 'Organization created successfully');
    res.redirect(`/organizations/${id}`); // Matches routes.js
  } catch (err) { next(err); }
};

// 7. Process Update
const processEditOrganizationForm = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    errors.array().forEach(err => req.flash('error', err.msg));
    return res.redirect(`/organizations/edit/${req.params.id}`); // Matches routes.js
  }
  try {
    await updateOrganization(req.params.id, req.body.name, req.body.description, req.body.contactEmail, req.body.logoFilename || 'placeholder-logo.png');
    req.flash('success', 'Organization updated successfully');
    res.redirect(`/organizations/${req.params.id}`); // PRG Redirect
  } catch (err) { next(err); }
};

export {
  showOrganizationsPage, showNewOrganizationForm, showOrganizationDetailsPage,
  showEditOrganizationForm, organizationValidation, processNewOrganizationForm, processEditOrganizationForm
};