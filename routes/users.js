const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

//User model
const User = require("../models/User");

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/register", (req, res) => {
  res.render("register");
});

//refister handle
router.post("/register", (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  //check require fields
  if (!name || !email || !password || !password2) {
    errors.push({ msg: "Please fill all the fields" });
  }

  if (password !== password2) {
    errors.push({ msg: "Password do not match" });
  }

  //check the password length
  if (password.length < 6) {
    errors.push({ msg: "Password should be atleast 6 characters" });
  }

  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      email,
      password,
      password2,
    });
  } else {
    //Validation pass
    User.findOne({
      email: email,
    }).then((user) => {
      if (user) {
        //User exists
        errors.push({ msg: "Email is already registered" });
        res.render("register", {
          errors,
          name,
          email,
          password,
          password2,
        });
      } else {
        const newUser = new User({
          name,
          email,
          password,
        });

        //HAsh password
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            // set passsword to hash
            newUser.password = hash;

            //save theuser
            newUser
              .save()
              .then((user) => {
                req.flash(
                  "success_msg",
                  "You are now registered and can Log in"
                );
                res.redirect("/users/login");
              })
              .catch((err) => console.log(err));
          });
        });
        // console.log(newUser);
        // res.send("Hello");
      }
    });
  }
});

module.exports = router;

//Hello
