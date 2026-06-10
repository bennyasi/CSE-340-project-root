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

        req.session.user = {
            id: user.id,
            name: user.name,
            email: user.email,
            role_name: user.role_name
        };

        req.flash('success', 'Login successful');
        return res.redirect('/dashboard');

    } catch (err) {
        next(err);
    }
};