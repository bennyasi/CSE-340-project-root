// middleware/auth.js
function requireLogin(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  }
  res.redirect('/login');
}

function requireRole(role) {
  return (req, res, next) => {
    if (req.session && req.session.userRole === role) {
      return next();
    }
    // Optionally, add flash message
    res.redirect('/dashboard');
  };
}

module.exports = { requireLogin, requireRole };