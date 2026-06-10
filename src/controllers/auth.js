const { createUser } = require('../models/userModel');

exports.processRegistration = async (req, res, next) => {
    try {
        const { name, email, password } = req.body || {};

        // 1. Prevent crash if body is missing
        if (!name || !email || !password) {
            return res.status(400).render('register', {
                title: 'Register',
                error: 'All fields are required'
            });
        }

        // 2. OPTIONAL (recommended): hash password
        // const bcrypt = require('bcryptjs');
        // const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Save user
        await createUser(name, email, password);

        // 4. Redirect
        res.redirect('/login');

    } catch (err) {
        next(err);
    }
};