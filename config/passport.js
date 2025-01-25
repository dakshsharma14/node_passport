const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Load user model
const User = require("../models/User");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: "email" }, // Use 'email' as the username field
      async (email, password, done) => {
        try {
          // Match user
          const user = await User.findOne({ email: email });
          if (!user) {
            return done(null, false, {
              message: "That email is not registered",
            });
          }

          // Match password
          const isMatch = await bcrypt.compare(password, user.password);
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: "Password Incorrect" });
          }
        } catch (err) {
          console.error(err);
          return done(err); // Pass the error to Passport
        }
      }
    )
  );

  // Serialize the user ID into the session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserialize the user ID from the session
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id); // Use async/await with findById
      done(null, user); // Pass the user object to the next middleware
    } catch (err) {
      done(err); // Handle errors during deserialization
    }
  });
};
