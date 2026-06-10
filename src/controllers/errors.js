// Import any needed model functions (none are needed for the error pages, so this is empty)
    
// Define any controller functions

// Test route for 500 errors
const testErrorPage = (req, res, next) => {
    const err = new Error('This is a test error');
    err.status = 500;
    next(err);
};
export const show404Page = (req, res) => {
    res.status(404).render('404', {
        title: 'Page Not Found',
        user: req.user || null
    });
};
// Export any controller functions
export { testErrorPage };