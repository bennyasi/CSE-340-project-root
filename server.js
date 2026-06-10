import express from 'express';
import path from 'path';
import session from 'express-session';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import router from './src/routes/routes.js';
import { testConnection } from './src/models/db.js';
import flashMiddleware from './src/middleware/flash.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

/* =========================
   VIEW ENGINE
========================= */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

/* =========================
   STATIC FILES
========================= */
app.use(express.static(path.join(__dirname, 'public')));

/* =========================
   DEBUG: REQUEST (BEFORE BODY PARSING)
========================= */
app.use((req, res, next) => {
    console.log("\n--- REQUEST RECEIVED ---");
    console.log("URL:", req.url);
    console.log("METHOD:", req.method);
    console.log("BODY BEFORE PARSING:", req.body);
    next();
});

/* =========================
   BODY PARSING (CRITICAL - MUST BE BEFORE ROUTES)
========================= */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/* =========================
   DEBUG: REQUEST (AFTER BODY PARSING)
========================= */
app.use((req, res, next) => {
    console.log("BODY AFTER PARSING:", req.body);
    console.log("-------------------------\n");
    next();
});

/* =========================
   SESSION CONFIG
========================= */
app.use(session({
    secret: process.env.SESSION_SECRET || 'super-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 // 1 hour
    }
}));

/* =========================
   FLASH MESSAGES
========================= */
app.use(flashMiddleware);

/* =========================
   GLOBAL LOCALS
========================= */
app.use((req, res, next) => {
    res.locals.user = req.session?.user || null;
    res.locals.isLoggedIn = !!req.session?.user;
    res.locals.messages = req.flash ? req.flash() : {};
    next();
});

/* =========================
   REQUEST LOG (FINAL CLEAN LOG)
========================= */
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

/* =========================
   ROUTES
========================= */
app.use('/', router);

/* =========================
   ROUTE DEBUG LIST
========================= */
console.log('--- REGISTERED ROUTES ---');
router.stack.forEach((r) => {
    if (r.route && r.route.path) {
        const methods = Object.keys(r.route.methods)
            .join(',')
            .toUpperCase();

        console.log(`- ${methods} ${r.route.path}`);
    }
});
console.log('-------------------------');

/* =========================
   404 HANDLER
========================= */
app.use((req, res) => {
    console.log(`[404] ${req.url}`);

    res.status(404).render('errors/404', {
        title: '404 Not Found'
    });
});

/* =========================
   ERROR HANDLER
========================= */
app.use((err, req, res, next) => {
    console.error('[SERVER ERROR]:', err);

    res.status(500).render('errors/500', {
        title: 'Server Error',
        message:
            process.env.NODE_ENV === 'development'
                ? err.message
                : 'Something went wrong!',
        stack:
            process.env.NODE_ENV === 'development'
                ? err.stack
                : null
    });
});

/* =========================
   START SERVER
========================= */
app.listen(process.env.PORT || 3000, async () => {
    try {
        await testConnection();

        console.log(
            `Server running at http://localhost:${process.env.PORT || 3000}`
        );
    } catch (err) {
        console.error('Database connection failed:', err.message);
    }
});
