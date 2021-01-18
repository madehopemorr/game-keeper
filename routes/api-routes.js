// Requiring our models and passport as we've configured it
const db = require("../models");
const passport = require("../config/passport");

module.exports = function(app) {
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
        id: req.user.id
      });
    }
  });
  // becca's new code
  //CRUD Routes for wishlist and owned lists
  app.post("/api/games", (req, res) => {
    db.Games.create(req.body)
      .then((saveGame) => {
        res.json(saveGame)
      })
      .catch(err => {
        res.status(401).json(err);
      });
  });

  app.get("/", (req, res)=>{
    db.Games.findAll({})
    .then((saveGame)=>{
      var gameObj = {
        games: saveGame
      };
      console.log(gameObj)
      res.render("members", gameObj)
    })
  })
  
  app.get("/api/games/", (req, res) => {
    db.Games.findAll({})
      .then((saveGame) => {
        res.json(saveGame);
      })
  });
  
  app.put("/api/games/", (req, res) => {
    db.Games.update({own: true},{
      where: {
        id: req.body.id
      }
    })
      .then((saveGame) => {
        res.json(saveGame)
      })
  });

  app.delete("/api/games/:id", (req, res)=>{
    db.Games.destroy({
      where: {
        id: req.params.id
      }
    })
    .then((saveGame)=>{
      res.json(saveGame)
    })
  })
  

  //   there was a conflict when merging here so I just left it and we can delete later
  //CRUD Routes
  /*
  app.post("/api/new-game", (req, res) => {
    db.Games.create({
      title: res.games.title,
      own: false

    })
      .then(() => {
        res.render("/members");
      })
      .catch(err => {
        res.status(401).json(err);
      });
  });

  app.get("/api/wishlist", (req, res) => {
    db.Games.findAll({
      where: {
        own: false
      }
      
    })
      .then(() => {
        res.render("/members");
      })
      .catch(err => {
        res.status(401).json(err);
      });
  });

  app.get("/api/owned", (req, res) => {
    db.Games.findAll({
      where: {
        own: true
      }
      
    })
      .then(() => {
        res.render("/members");
      })
      .catch(err => {
        res.status(401).json(err);
      });
  });

  app.put("/api/wishlist", (req, res) => {
    db.Games.update({
      where: {
        id: req.body.id
      }
    })
      .then(() => {
        res.render("/members");
      })
      .catch(err => {
        res.status(401).json(err);
      });
  });
  */
  //create app.delete to delete games
};

