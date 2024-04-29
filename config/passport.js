const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const User = require("../models/User");

// Configure local strategy for passport

passport.use(
  new LocalStrategy(
    {
      usernameField: "email", // Assuming email is used as the username
      passwordField: "password",
   
    },
    async (email, password, done) => {
     
      try {
        // Find the user by username
        const user = await User.findOne({ email });

        // If user not found or password is incorrect
        if (!user || !bcrypt.compareSync(password, user.password)) {
          return done(null, false, { message: "Invalid email or password" });
        }

        // If user and password are correct
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Serialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Function to hash password using bcrypt
const hashPassword = (password) => {
  const saltRounds = 10;
  return bcrypt.hashSync(password, saltRounds);
};

module.exports = { passport, hashPassword };
