// src/controllers/index.js

// Define controller functions
const showHomePage = async (req, res) => {
    const title = 'Home';
    // Ensure you have a 'home.ejs' file in your src/views folder
    res.render('home', { title });
};

// Export functions as an object
export { showHomePage };