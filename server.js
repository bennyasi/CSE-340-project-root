import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';

// --- 1. Configuration & Constants ---
const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || "production";
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

/**
 * --- 2. Configure View Engine ---
 * This tells Express to use EJS and look inside src/views for templates
 */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

/**
 * --- 3. Middleware ---
 * Serves files from the public folder (CSS, Images, JS)
 */
app.use(express.static(path.join(__dirname, 'public')));

/**
 * --- 4. Routes ---
 * These use res.render to look for .ejs files in your src/views folder
 */

// Home Route
app.get('/', (req, res) => {
    res.render('home', { title: 'Home' });
});

// Organizations Route
app.get('/organizations', (req, res) => {
    res.render('organizations', { title: 'Organizations' });
});

// Projects Route
app.get('/projects', (req, res) => {
    res.render('projects', { title: 'Projects' });
});

// Categories Route
app.get('/categories', (req, res) => {
    res.render('categories', {
        title: 'Service Project Categories'
    });
});

/**
 * --- 5. Server Listener ---
 */
app.listen(PORT, () => {
    console.log(`--------------------------------------------------`);
    console.log(` Server is active!`);
    console.log(` View it at: http://localhost:${PORT}`);
    console.log(` Environment: ${NODE_ENV}`);
    console.log(`--------------------------------------------------`);
});
