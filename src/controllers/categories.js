import { getAllCategories, getCategoryDetails } from '../models/categories.js';
import { getProjectsByCategoryId } from '../models/projects.js';

// Categories list page
const showCategoriesPage = async (req, res) => {
    const categories = await getAllCategories();
    const title = 'Service Project Categories';

    res.render('categories', { title, categories });
};

// Category details page (MISSING BEFORE — THIS FIXES YOUR ERROR)
const showCategoryDetailsPage = async (req, res) => {
    const categoryId = req.params.id;

    const categoryDetails = await getCategoryDetails(categoryId);
    const projects = await getProjectsByCategoryId(categoryId);

    const title = 'Category Details';

    res.render('category-details', {
        title,
        categoryDetails,
        projects
    });
};

export {
    showCategoriesPage,
    showCategoryDetailsPage
};