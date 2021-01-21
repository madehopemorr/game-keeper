// Requiring our models and passport as we've configured it
const db = require("../models");
const passport = require("../config/passport");

const bodyParser = require('body-parser');
const isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function (app) {
  app.use(bodyParser.json());
  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    // Sending back a password, even a hashed password, isn't a good idea
    res.json({
      email: req.user.email,
      id: req.user.id
    });
  });

  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post("/api/signup", (req, res) => {
    db.User.create({
      email: req.body.email,
      password: req.body.password,
      firstName: req.body.firstName,
      lastName: req.body.lastName
    })
      .then(() => {
        res.redirect(307, "/api/login");
      })
      .catch(err => {
        res.status(401).json(err);
      });
  });

  // Route for logging user out
  app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });

  // Route for getting some data about our user to be used client side
  app.get("/api/user_data", (req, res) => {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      // Otherwise send back the user's first name and id
      // Sending back a password, even a hashed password, isn't a good idea
      res.json({
        firstName: req.user.firstName,
        id: req.user.id,
      });
    }

  });

  // Route for wishlist to be saved in database
  
  app.post("/api/members", (req, res) => {
    console.log(req.body)
    db.Games.create(req.body).then((dbGames) => {
      res.json(dbGames);
    }).catch(err => {
      console.log(err)
      res.status(401).json(err);
    });

  });

  // GET route for getting all of the games for wishlist
  app.get("/api/wishlist", function (req, res) {
    // this works but make sure you are logged in before going to http://localhost:8080/api/wishlist
    db.Games.findAll({
      where: {
        own: false,
        UserId: req.user.id,
      }
    }).then(function (dbGames) {
      res.json(dbGames);
    }).catch(err => {
      res.status(401).json(err);
    });
  });

  app.get("/api/owned", function (req, res) {
    // this works but make sure you are logged in before going to http://localhost:8080/api/owned
    db.Games.findAll({
      where: {
        own: true,
        UserId: req.user.id
      }
    }).then(function (dbGames) {
      res.json(dbGames);
    }).catch(err => {
      res.status(401).json(err);
    });
  });

  app.put("/api/wishlist/:id", (req, res) => {
    db.Games.update({ own: true }, {
      where: {
        id: req.params.id
      }
    })
      .then((saveGame) => {
        res.json(saveGame)
      })
  });

  app.delete("/api/wishlist/:id", function (req, res) {
    db.Post.destroy({
      where: {
        id: req.params.id
      }
    }).then(function (dbGame) {
      res.json(dbGame);
    });
  });

  app.delete("/api/owned/:id", function (req, res) {
    db.Post.destroy({
      where: {
        id: req.params.id
      }
    }).then(function (dbGame) {
      res.json(dbGame);
    });
  });


};

