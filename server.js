import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import 'dotenv/config'; import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');


import { testConnection } from './src/models/db.js';
import { getAllOrganizations } from './src/models/organizations.js'; 
import { getAllProjects } from './src/models/projects.js';
import { getAllCategories } from './src/models/categories.js';

const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || "development";
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * --- Routes ---
 */

app.get('/', (req, res) => {
    res.render('home', { title: 'Home' });
});

/**
 * Organizations Route
 */
app.get('/organizations', async (req, res) => {
  try {
    const organizations = await getAllOrganizations();
    const title = 'Our Partner Organizations';

    console.log("=========================================");
    console.log("Route /organizations accessed successfully.");
    console.log("Number of organizations found:", organizations ? organizations.length : 0);
    console.log("=========================================");

    res.render('organizations', { title, organizations });
  } catch (error) {
    console.error('Organizations route error:', error.message);
    res.render('organizations', {
      title: 'Our Partner Organizations',
      organizations: [],
      errorMessage: 'Failed to load organizations. Please try again later.'
    });
  }
});

/**
 * Projects Route
 */
app.get('/projects', async (req, res) => {
  try {
    const projects = await getAllProjects();
    const title = 'Projects';

    console.log("=========================================");
    console.log("Route /projects accessed successfully.");
    console.log("Number of projects found:", projects ? projects.length : 0);
    console.log("=========================================");

    res.render('projects', { title, projects });
  } catch (error) {
    console.error('Projects route error:', error.message);
    res.render('projects', {
      title: 'Projects',
      projects: [],
      errorMessage: 'Failed to load projects. Please try again later.'
    });
  }
});

/**
 * Categories Route
 */
app.get('/categories', async (req, res) => {
  try {
    const categories = await getAllCategories();
    const title = 'Service Project Categories';

    console.log("=========================================");
    console.log("Route /categories accessed successfully.");
    console.log("Number of categories found:", categories ? categories.length : 0);
    console.log("=========================================");

    res.render('categories', { title, categories });
  } catch (error) {
    console.error('Categories route error:', error.message);
    res.render('categories', {
      title: 'Service Project Categories',
      categories: [],
      errorMessage: 'Failed to load categories. Please try again later.'
    });
  }
});

/**
 * --- Server Listener ---
 */
app.listen(PORT, () => {
    console.log(`Server is running at http://127.0.0.1:${PORT}`);
    console.log(`Environment: ${NODE_ENV}`);

    // Invoking your instructor's testConnection function cleanly
    testConnection()
        .then(() => {
            console.log('Database connection successful');
        })
        .catch((error) => {
            console.log(
                'Database connection failed (server still runs):',
                error.message
            );
        });
});
