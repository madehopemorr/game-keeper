// Require necessary npm packages
const express = require("express");
// const passport = require("passport")
const passport = require("./config/passport");
const session = require("express-session");

// Setting up port and require models for syncing
const PORT = process.env.PORT || 8080;
const db = require("./models");

// Creating express app and configuring middleware needed for authentication
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Set handlebars
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.use(
    session({ secret: "keyboard cat", resave: true, saveUninitialized: true })
  );
app.use(passport.initialize());
app.use(passport.session())

// passport.authenticate();

// Require routes
require("./routes/html-routes.js")(app);
require("./routes/api-routes.js")(app);

// Syncing database and logging a message to the user upon success
db.sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(
            "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.", PORT, PORT);
    });
});
