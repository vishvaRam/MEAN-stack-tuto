const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const User = require("../../Models/User");
const gravator = require("gravator");

// @route   api/user/test
// @access  Public
router.get("/test", (req, res) => {
  res.send("User page");
});

// @route   api/user/register
// @access  Public
router.post("/register", (req, res) => {
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      // Gravator
      //   const avatar = gravator.url(req.body.email);

      // Creating new User
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        // avatar,
        password: req.body.password
      });

      // Hashing Password
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) console.log(err);
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route   api/user/login
// @access  Public
router.post("/login", (req, res) => {
  // Const for body elements
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email }).then(user => {
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    bcrypt.compare(password, user.password).then(isMatch => {
      if (!isMatch) {
        return res.status(404).json({ password: "Password is incorrect" });
      } else {
        res.status(200).json({ message: "you are logged in " });
      }
    });
  });
});

module.exports = router;
