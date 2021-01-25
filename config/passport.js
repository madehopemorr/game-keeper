const passport = require("passport");
// var LocalStrategy = require('passport-local').Strategy;
// var JwtStrategy = require('passport-jwt').Strategy;
// var ExtractJwt = require('passport-jwt').ExtractJwt;
const JWTstrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const LocalStrategy = require("passport-local").Strategy;

const db = require("../models");

// var options = {};
// options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
// options.secretOrKey = "TOP_SECRET";

// Tell passport we want to use a Local Strategy (login with a username/email and password)
passport.use(
  "local",
  new LocalStrategy(
    // User will sign in with email instead of username
    {
      usernameField: "email"
    },
    (email, password, done) => {
      // This code runs when a user tries to sign in
      db.User.findOne({
        where: {
          email: email
        }
      }).then(dbUser => {
        // If there's no user with the given email
        if (!dbUser) {
          return done(null, false, {
            message: "Incorrect email."
          });
        }
        // If there's a user with the given email, but the password the user enters in not correct
        else if (!dbUser.validPassword(password)) {
          return done(null, false, {
            message: "Incorrect password."
          });
        }
        // If none of the above, return the user
        return done(null, dbUser);
      });
    }
  )
);

// In order to help keep authentication state across HTTP requests,
// Sequelize needs to serialize and deserialize the user
passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((obj, cb) => {
  cb(null, obj);
});

// passport.use(
//     new JwtStrategy(options, async (token, done) => {
//         try {
//           return done(null, token.user);
//         } catch (error) {
//           done(error);
//         }
//       })
// );
passport.use(
  new JWTstrategy(
    {
      secretOrKey: "TOP_SECRET",
      jwtFromRequest: ExtractJWT.fromUrlQueryParameter("secret_token")
    },
    async (token, done) => {
      try {
        return done(null, token.user);
      } catch (error) {
        done(error);
      }
    }
  )
);

module.exports = passport;
