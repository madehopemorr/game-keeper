// Requiring path to so we can use relative routes to our HTML files
// const path = require("path");

// Requiring our custom middleware for checking if a user is logged in
const isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function(app) {
  app.get("/", (req, res) => {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/members");
    }
    // res.sendFile(path.join(__dirname, "../public/signup.html"));
    res.render("welcome");
  });

  app.get("/login", (req, res) => {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/members");
    }
    // res.sendFile(path.join(__dirname, "../public/login.html"));
    res.render("login");
  });

  app.get("/signup", (req, res) => {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/members");
    }
    // res.sendFile(path.join(__dirname, "../public/signup.html"));
    res.render("signup");
  });

  // Here we've add our isAuthenticated middleware to this route.
  // If a user who is not logged in tries to access this route they will be redirected to the signup page
  app.get("/members", isAuthenticated, (req, res) => {
    // res.sendFile(path.join(__dirname, "../public/members.html"));
    res.render("members");
  });
  app.get("/mywishlist", isAuthenticated, (req, res) => {
    // res.sendFile(path.join(__dirname, "../public/members.html"));
    res.render("wishlist");
  });
  app.get("/mygames", isAuthenticated, (req, res) => {
    // res.sendFile(path.join(__dirname, "../public/members.html"));
    res.render("mygames");
  });


  // Wishlist route
  app.get("/wishlist", (req, res) => {
  
    res.render("wishlist");
  });
};
