export async function createOrganization(req, res) {
  try {
    const { name, description, contact_email } = req.body;

    // 1. SERVER-SIDE VALIDATION
    if (!name || name.trim().length < 3) {
      req.flash("error", "Organization name must be at least 3 characters.");
      return res.render("organization-form", { 
        title: "New Organization", 
        organization: req.body 
      });
    }

    if (!contact_email || !contact_email.includes("@")) {
      req.flash("error", "A valid email address is required.");
      return res.render("organization-form", { 
        title: "New Organization", 
        organization: req.body 
      });
    }

    // 2. MODEL INTERACTION (Only if validation passes)
    await OrganizationModel.insertOrganization({ name, description, contact_email });

    req.flash("success", "Organization created successfully!");
    res.redirect("/organizations");

  } catch (error) {
    console.error(error);
    req.flash("error", "Server error, please try again.");
    res.redirect("/new-organization");
  }
}