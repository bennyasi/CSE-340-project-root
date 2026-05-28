import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import session from 'express-session';
import { testConnection } from './src/models/db.js';

// Routes
import router from './src/routes/routes.js';

// Custom Flash Middleware
import flash from './src/middleware/flash.js';

// Environment & Config
const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';
const SESSION_SECRET = process.env.SESSION_SECRET || 'fallback-secret-for-dev-only';
const PORT = process.env.PORT || 3000;

// Paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize App
const app = express();

/**
 * 1. Global Pre-Processing Middleware (Order Matters!)
 */

// Allow Express to receive and process common form/POST data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// EJS setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// Set up session management (MUST be before custom flash middleware)
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 } // Session expires after 1 hour
}));

// Set up your custom flash middleware
app.use(flash); 

// Inject session/flash data into res.locals so EJS can see it automatically
app.use((req, res, next) => {
    res.locals.NODE_ENV = NODE_ENV;
    
    // If your flash middleware attaches a function or object to req, map it here
    // This allows your templates to reliably read 'flashMessages'
    res.locals.flashMessages = req.flash ? (typeof req.flash === 'function' ? req.flash() : req.flash) : {};
    
    next();
});

// Dev logger
app.use((req, res, next) => {
    if (NODE_ENV === 'development') {
        console.log(`${req.method} ${req.url}`);
    }
    next();
});

/**
 * 2. Application Routes
 */
app.use(router);

/**
 * 3. Fallback Route Handlers (Must go AFTER routes)
 */

// 404 handler
app.use((req, res, next) => {
    const err = new Error('Page Not Found');
    err.status = 404;
    next(err);
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Error occurred:', err.message);
    console.error(err.stack);

    const status = err.status || 500;
    const template = status === 404 ? '404' : '500';

    res.status(status).render(`errors/${template}`, {
        title: status === 404 ? 'Page Not Found' : 'Server Error',
        error: err.message,
        stack: err.stack
    });
});

/**
 * 4. Start Server Execution
 */
app.listen(PORT, async () => {
    try {
        await testConnection();
        console.log(`Server running at http://127.0.0.1:${PORT}`);
        console.log(`Environment: ${NODE_ENV}`);
    } catch (error) {
        console.error('Database connection failed:', error);
    }
});
