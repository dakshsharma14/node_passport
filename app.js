const express = require("express");

//initialize ejs
const expressLayouts = require("express-ejs-layouts");

const mongoose = require("mongoose");

const flash = require("connect-flash");
const session = require("express-session");
// const passport = require("./config/passport");
const passport = require("passport");

const app = express();

//passport config
require("./config/passport")(passport);

//DB config
const db = require("./config/keys").MongoURI;

//connect to mongoose
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("MongoDB Connected...."))
  .catch((err) => console.log(err));

//EJS
app.use(expressLayouts);
app.set("view engine", "ejs");

//Bodyparse
app.use(express.urlencoded({ extended: false }));

//middle ware for Expresss session
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  })
);
//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Connnect flash
app.use(flash());

//global vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});
//routes
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));

const PORT = process.env.PORT || 5001;

app.listen(PORT, console.log(`Server started on port ${PORT}`));
