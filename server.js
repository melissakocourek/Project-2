require("dotenv").config();

var express = require("express");
const expressLayouts = require("express-ejs-layouts");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");

// Passport config
require("./config/passport")(passport);

var app = express();

// EJS
app.use(expressLayouts);
app.set("view engine", "ejs");



// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

// Express Session Middleware
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// connect flash
app.use(flash());

// Gloabl vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

// Import routes and give the server access to them.
// var routes = require("./public/controllers/firstController.js");

// app.use(routes);

// Routes
// app.use("/api", require("./routes/apiRoutes")(app));
app.use("/users", require("./routes/users"));
app.use("/", require("./routes/htmlRoutes"));
// require("./routes/apiRoutes")(app);
// require("./routes/htmlRoutes")(app);

var db = require("./models");
var PORT = process.env.PORT || 3000;

var syncOptions = { force: true };

// Starting the server, syncing our models ------------------------------------/
db.sequelize.sync(syncOptions).then(function() {
  app.listen(PORT, function() {
    console.log(
      "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
      PORT,
      PORT
    );
  });
});

module.exports = app;
