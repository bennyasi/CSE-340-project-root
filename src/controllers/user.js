import bcrypt from 'bcryptjs';
import {
    authenticateUser,
    getAllUsers,
    createUser
} from '../models/users.js';

// =========================
// REGISTER
// =========================
export const showUserRegistrationForm = (req, res) => {
    res.render('register', {
        title: 'Register',
        messages: res.locals.messages || {}
    });
};

export const processUserRegistrationForm = async (req, res, next) => {
    try {
        const { name, email, password } = req.body || {};

        if (!name || !email || !password) {
            req.flash('error', 'All fields are required');
            return res.redirect('/register');
        }

        const passwordHash = await bcrypt.hash(password, 10);
        await createUser(name, email, passwordHash);

        req.flash('success', 'Account created successfully');
        return res.redirect('/login');

    } catch (err) {
        console.error('REGISTER ERROR:', err);
        next(err);
    }
};

// =========================
// LOGIN
// =========================
export const showLoginForm = (req, res) => {
    res.render('login', {
        title: 'Login',
        messages: res.locals.messages || {}
    });
};

export const processLoginForm = async (req, res, next) => {
    try {
        const { email, password } = req.body || {};

        if (!email || !password) {
            req.flash('error', 'Email and password are required');
            return res.redirect('/login');
        }

        const user = await authenticateUser(email, password);

        if (!user) {
            req.flash('error', 'Invalid email or password');
            return res.redirect('/login');
        }

        req.session.user = user;

        req.session.save((err) => {
            if (err) return next(err);
            req.flash('success', 'Login successful');
            return res.redirect('/dashboard');
        });

    } catch (err) {
        console.error('LOGIN ERROR:', err);
        next(err);
    }
};

// =========================
// LOGOUT
// =========================
export const processLogout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
};

// =========================
// DASHBOARD
// =========================
export const showDashboard = (req, res) => {
    res.render('dashboard', {
        title: 'Dashboard',
        user: req.session.user
    });
};

// =========================
// USERS PAGE
// =========================
export const showUsersPage = async (req, res, next) => {
    try {
        const users = await getAllUsers();

        res.render('users', {
            title: 'Users',
            users,
            user: req.session.user,
            messages: res.locals.messages || {}
        });

    } catch (err) {
        next(err);
    }
};

// =========================
// AUTH MIDDLEWARE
// =========================
export const requireLogin = (req, res, next) => {
    if (!req.session.user) {
        req.flash('error', 'You must be logged in');
        return res.redirect('/login');
    }
    next();
};

export const requireRole = (role) => {
    return (req, res, next) => {
        if (!req.session.user) {
            req.flash('error', 'You must be logged in');
            return res.redirect('/login');
        }

        if (req.session.user.role_name !== role) {
            req.flash('error', 'Access denied');
            return res.redirect('/dashboard');
        }

        next();
    };
};
