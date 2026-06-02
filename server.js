
import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import session from 'express-session';
import { testConnection } from './src/models/db.js';
import router from './src/routes/routes.js';
import flash from './src/middleware/flash.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'development';
const SESSION_SECRET = process.env.SESSION_SECRET || 'dev-secret-key';
const PORT = process.env.PORT || 3000;

// 1. View Engine Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// 2. Core Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 3. Session & Flash Middleware
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false, 
    cookie: { maxAge: 60 * 60 * 1000 }
}));
app.use(flash); 

// Global locals for EJS templates
app.use((req, res, next) => {
    res.locals.NODE_ENV = NODE_ENV;
    res.locals.messages = req.flash ? req.flash() : {};
    next();
});

// 4. Debugging Middleware (Logs every request)
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} request to: ${req.url}`);
    next();
});

// 5. Routes (Mounting the router here)
app.use(router);

// 6. Error Handling (404 and 500)
app.use((req, res, next) => {
    const err = new Error('Page Not Found');
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    const status = err.status || 500;
    res.status(status);
    const template = (status === 404) ? 'errors/404' : 'errors/500';
    res.render(template, {
        title: status === 404 ? '404 - Not Found' : '500 - Server Error',
        message: err.message,
        stack: NODE_ENV === 'development' ? err.stack : null
    });
});

// 7. Start Server
app.listen(PORT, async () => {
    try {
        await testConnection();
        console.log(`Server running at http://127.0.0.1:${PORT}`);
    } catch (error) {
        console.error('Database connection failed:', error.message);
    }
});
import fs from 'fs';
const viewsPath = path.join(__dirname, 'src/views');
try {
    console.log("👉 Actual files inside src/views:", fs.readdirSync(viewsPath));
} catch (err) {
    console.log("👉 Error reading directory:", err.message);
}
