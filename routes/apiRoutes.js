var express = require("express");
var router = express.Router();
var bcrypt = require("bcryptjs");


var db = require("../models");
// module.exports = function(app) {
// Get all examples
router.get("/api/coaches", function(req, res) {
  db.Coach.findAll({}).then(function(dbCoach) {
    res.json(dbCoach);
  });
});

// Create a new example
router.post("/coach", function(req, res) {
  var coach = req.body;
  db.Coach.create({
    name: coach.name,
    email: coach.email,
    teamName: coach.teamName
  });
});

// Delete an example by id
router.delete("/api/coaches/:id", function(req, res) {
  db.Coach.destroy({ where: { id: req.params.id } }).then(function(dbCoach) {
    res.json(dbCoach);
  });
});
// };

// Register Handle
router.post("/coach", (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];
  //check required fields
  if (!name || !email || !password || !password2) {
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
    res.render("coach", {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    //validation pass
    db.Coach.findOne({
      where: {
        email: email
      }
    }).then(coach => {
      if (coach) {
        // Coach exists
        errors.push({ msg: "Email is already registered." });
        res.render("coach", {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        const newCoach = new db.Coach({
          name,
          email,
          password
        });

        // hash password
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newCoach.password, salt, (err, hash) => {
            if (err) throw err;
            //set password to hash
            newCoach.password = hash;
            //Save user
            newCoach
              .save()
              .then(user => {
                res.redirect("/addSchedule");
              })
              .catch(console.log(err));
          });
        });
      }
    });
  }
});

module.exports = router;
