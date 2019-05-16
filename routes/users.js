var express = require("express");
var router = express.Router();
var bcrypt = require("bcryptjs");
var passport = require("passport");
var flash = require("connect-flash");

var db = require("../models");

//Login page
router.get("/login", (req, res) => {
  res.render("login");
});

//Register page
router.get("/register", (req, res) => {
  res.render("register");
});

// Register Handle
router.post("/register", (req, res) => {
  var { name, teamName, email, password, password2, type } = req.body;
  let errors = [];
  //check required fields
  if (!name || !teamName || !email || !password || !password2 || !type ) {
    if(!teamName) {
      errors.push({ msg: "lastname did not store" });
    }
    errors.push({ msg: "Please fill all fields." });
  }
  // check passwords match
  if (password !== password2) {
    errors.push({ msg: "Passwords do not match." });
  }
  // check password length
  if (password.length < 6) {
    errors.push({ msg: "Password must be at least 6 characters." });
  }

  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      teamName,
      email,
      password,
      password2,
      type
    });
  } else {
    //validation pass
    db.User.findOne({
      where: {
        email: email
      }
    }).then(user => {
      if (user) {
        // User exists
        errors.push({ msg: "Email is already registered." });
        res.render("register", {
          errors,
          name,
          teamName,
          email,
          password,
          password2,
          type
        });
      } else {
        var newUser = new db.User({
          name,
          teamName,
          email,
          password,
          type
        });

        // hash password
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            //set password to hash
            newUser.password = hash;
            //Save user
            newUser
              .save()
              .then(user => {
                res.flash(
                  "success_msg",
                  "You are now registered and can log in."
                );
                res.redirect("/users/login");
              })
              .catch(console.log("HERE IS THE ERROR", err));
          });
        });
      }
    });
  }
  
});

// Login Handle
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    // if(type === 'coach') {

    // }
    successRedirect: "/coach_dashboard",
    failureRedirect: "/users/login",
    failureFlash: true
  })(req, res, next);
});

// Logout Handle
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/users/login");
});

module.exports = router;
