const passport = require("passport");
const dotenv = require("dotenv");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const crypto = require("crypto");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const {  sanitizeUser, cookieExtractor } = require("../services/common");
// Configure local strategy for passport
const opts = {};
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = "SECRET_KEY";


// Passport Strategy
passport.use(
  "local",
  new LocalStrategy(
    {
      usernameField: "email", // Assuming email is used as the username
      passwordField: "password",
    },
    async function (email, password, done) {
      // bt dafault passport uses username
      try {
        const user = await User.findOne({ email: email });
        if (!user) {
          done(null, false, { message: "Invalid Credentials" }); // for safety
        }

        crypto.pbkdf2(
          password,
          user.salt,
          310000,
          32,
          "sha256",
          async function (err, hashedPassword) {
            if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
              return done(null, false, { message: "Invalid Credentials" });
            }
            const token = jwt.sign(sanitizeUser(user), "SECRET_KEY");
            done(null, { id: user.id, role: user.role, token }); // this line sends to serializer
          }
        );
      } catch (err) {
        done(err);
      }
    }
  )
);

// Jwt Strategy
passport.use(
  "jwt",
  new JwtStrategy(opts, async function (jwt_payload, done) {
    try {
      const user = await User.findById(jwt_payload.id);
      if (user) {
        return done(null, sanitizeUser(user)); // this calls serializer
      } else {
        return done(null, false);
        // or you could create a new account
      }
    } catch (err) {
      return done(err, false);
    }
  })
);
// this create session variable req.user on being called from callbacks
passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, { id: user.id, role: user.role });
  });
});
// this changes session variable req.user when called from authorized request
passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});


// Function to hash password using bcrypt
const hashPassword = (password) => {
  const saltRounds = 10;
  return bcrypt.hashSync(password, saltRounds);
};

module.exports = { passport, hashPassword };

// passport.use(
//   new LocalStrategy(
//     {
//       usernameField: "email", // Assuming email is used as the username
//       passwordField: "password",
//     },
//     async (email, password, done) => {
//       try {
//         // Find the user by username
//         const user = await User.findOne({ email });

//         // If user not found or password is incorrect
//         if (!user || !bcrypt.compareSync(password, user.password)) {
//           return done(null, false, { message: "Invalid email or password" });
//         }

//         // If user and password are correct
//         return done(null, user);
//       } catch (err) {
//         return done(err);
//       }
//     }
//   )
// );


// // Serialize user
// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// // Deserialize user
// passport.deserializeUser(async (id, done) => {
//   try {
//     const user = await User.findById(id);
//     done(null, user);
//   } catch (err) {
//     done(err, null);
//   }
// });