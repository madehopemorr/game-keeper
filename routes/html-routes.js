// Requiring our custom middleware for checking if a user is logged in
const isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function (app) {
  app.get("/", (req, res) => {
    // If the user already has an account send them to the members page
    if (req.user) {
      return res.redirect("/members");
    }
    res.render("welcome");
  });

  app.get("/login", (req, res) => {
    // If the user already has an account send them to the members page
    if (req.user) {
      return res.redirect("/members");
    }
    res.render("login");
  });

  app.get("/signup", (req, res) => {
    // If the user already has an account send them to the members page
    if (req.user) {
      return res.redirect("/members");
    }
    res.render("signup");
  });

  // Here we've add our isAuthenticated middleware to this route.
  // If a user who is not logged in tries to access this route they will be redirected to the signup page
  app.get("/members", isAuthenticated, (req, res) => {
    res.render("members");
  });
  app.get("/wishlist", isAuthenticated, (req, res) => {
    res.render("wishlist");
  });
  app.get("/mygames", isAuthenticated, (req, res) => {
    res.render("mygames");
  });
};
