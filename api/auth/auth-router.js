const router = require("express").Router();
const { whereNotExists } = require("../../database/connection.js");
const users = require("../users/users-model.js");
const bcrypt = require("bcryptjs");

router.post("/register", async (req, res, next) => {
    let user = req.body;
    const hash = bcrypt.hashSync(user.password, 10);
    user.password = hash;
  try {
    const savedUser = await users.add(user);
    res.status(201).json(savedUser);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

module.exports = router;
