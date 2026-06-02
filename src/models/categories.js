import db from './db.js'; 

// 1. Get all categories
const getAllCategories = async () => {
  try {
    const query = `
      SELECT category_id, name 
      FROM public.category 
      ORDER BY name ASC;
    `;
    const result = await db.query(query);
    return result.rows || [];
  } catch (error) {
    console.error("DB ERROR (getAllCategories):", error.message);
    return [];
  }
};

// 2. Get details for a single category
const getCategoryDetails = async (categoryId) => {
  try {
    const query = `
      SELECT category_id, name 
      FROM public.category 
      WHERE category_id = $1;
    `;
    const result = await db.query(query, [categoryId]);
    return result.rows[0] || null;
  } catch (error) {
    console.error(`DB ERROR (getCategoryDetails for ID ${categoryId}):`, error.message);
    return null;
  }
};

// 3. Create a new category
const createCategory = async (name) => {
  try {
    const query = `
      INSERT INTO public.category (name) 
      VALUES ($1) 
      RETURNING category_id;
    `;
    const result = await db.query(query, [name]);
    return result.rows[0].category_id;
  } catch (error) {
    console.error("DB ERROR (createCategory):", error.message);
    throw error;
  }
};

// 4. Update an existing category record
const updateCategory = async (categoryId, name) => {
  try {
    const query = `
      UPDATE public.category 
      SET name = $1 
      WHERE category_id = $2
      RETURNING category_id;
    `;
    const result = await db.query(query, [name, categoryId]);
    
    if (result.rows.length === 0) {
      throw new Error('Category not found');
    }
    return result.rows[0].category_id;
  } catch (error) {
    console.error("DB ERROR (updateCategory):", error.message);
    throw error;
  }
};

// Unified Export Block
export {
  getAllCategories,
  getCategoryDetails,
  createCategory,
  updateCategory
};