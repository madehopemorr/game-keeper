// Require models and passport as we've configured it
const db = require("../models");
const passport = require("../config/passport");
// const passport= require("passport");
const jwt = require("jsonwebtoken");

// Local storage from node-localstorage npm package
// This is for server side (back end), not client side (front end)
if (typeof localStorage === "undefined" || localStorage === null) {
    const LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}

module.exports = function (app) {
    app.post("/api/login", async (req, res, next) => {

        passport.authenticate(
            "local",
            async (err, user, info) => {
                try {
                    if (err || !user) {
                        const error = new Error('An error occurred.');
                        
                        return next(error);
                    }

                    req.login(
                        user,
                        { session: true },
                        async (error) => {
                            if (error) {
                                return next(error);
                            }
                            const payload = {
                                id: user.id,
                                email: user.email,
                                firstName: user.firstName,
                                lastName: user.lastName
                            }
                            const options = {
                                subject: `${user.id}`,
                                expiresIn: 3600
                            }
                            const token = jwt.sign({ user: payload }, 'TOP_SECRET', options);
                            return res.json({ token });
                        }
                    );
                } catch (err) {
                    return err;
                }
            }
        )(req, res, next);
    });

    // If the user is created successfully, proceed to log the user in
    // Otherwise send back an error
    app.post("/api/signup", function (req, res) {
        db.User.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password
        })
            .then(() => {
                res.redirect(307, "/api/login");
            })
            .catch(err => {
                res.status(401).json(err);
            });
    });

    // Route for logging the user out
    app.get("/logout", (req, res) => {
        localStorage.removeItem("myToken");
        req.logout();
        res.redirect("/");
    });

    // Route for getting some data about our user to be used client side
    app.get("/api/user_data", passport.authenticate('jwt', { session: true }), (req, res) => {
        if (!req.user) {
            // If the user is not logged in, send back an empty object
            res.json({});
        } else {
            // Otherwise send back the user's first name and id
            // NOT sending back a password or even a hashed password
            res.json({
                id: req.user.id,
                email: req.user.email,
                firstName: req.user.firstName,
                lastName: req.user.lastName
            });
        };
    });

    // Route for saving games to database after buttons clicked
    app.post("/api/members", passport.authenticate('jwt', { session: true }), function (req, res) {

        db.Games.create({
            game_ID: req.body.game_ID,
            own: req.body.own,
        })
            .then(game => {
                db.User.findOne({
                    where: {
                        id: req.body.UserId
                    },
                })
                    .then(user => {
                        game.addUser(user, { through: { game_ID: req.body.game_ID, own: req.body.own } })
                    })
            })
    });

    // Route for displaying wishlist
    app.get("/api/wishlist", passport.authenticate('jwt', { session: false }), (req, res) => {
        db.User_Games.findAll({
            where: {
                own: false,
                UserId: req.user.id
            }
        }).then(function (dbGames) {
            res.json(dbGames);
        });

    });

    // Route for updating wishlist
    app.put("/api/wishlist/:id", passport.authenticate('jwt', { session: true }), (req, res) => {

        db.User_Games.update(
            { own: true },
            {
                where: {
                    game_ID: req.params.id
                }
            }).then(function (dbGames) {
                res.json(dbGames);
            });
    });

    // Route for displaying my games
    app.get("/api/mygames", passport.authenticate('jwt', { session: true }), (req, res) => {
        db.User_Games.findAll({
            where: {
                own: true,
                UserId: req.user.id
            }
        }).then(function (dbGames) {
            res.json(dbGames);
        });
    });

    // Route for deleting a game in wishlist
    app.delete("/api/wishlist/:id", function (req, res) {
        db.Games.destroy({
            where: {
                game_ID: req.params.id
            }
        }).then(function (dbGames) {
            res.json(dbGames);
        });
    });

    // Route for deleting a game from my games
    app.delete("/api/mygames/:id", function (req, res) {
        db.Games.destroy({
            where: {
                game_ID: req.params.id
            }
        }).then(function (dbGames) {
            res.json(dbGames);
        });
    });
};
