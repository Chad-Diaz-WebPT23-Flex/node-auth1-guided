const router = require("express").Router();
const { whereNotExists } = require("../../database/connection.js");
const users = require("../users/users-model.js");
const bcrypt = require("bcryptjs");

router.post("/register", async (req, res, next) => {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 16);
  user.password = hash;
  try {
    const savedUser = await users.add(user);
    res.status(201).json(savedUser);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  let { username, password } = req.body;
  try {
    const user = await users.findBy({ username }).first();
    if (user && bcrypt.compareSync(password, user.password)) {
      req.session.user = user;
      res.status(200).json({ message: `welcome ${user.username}` });
    } else {
      const err = new Error();
      err.statusCode = 401;
      err.message = "invalid creds.";
      next(err);
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
});

router.get("/logout", (req, res, next) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        res.send("you can checkout anytime you like...");
      } else {
        res.send("so long and thanks for all the fish...");
      }
    });
  } else {
    res.end();
  }
});

module.exports = router;
