const router = require("express").Router();
const logInCheck = require("../auth/logged-in-checked-middleware.js");

const Users = require("./users-model.js");

router.get("/", logInCheck, (req, res) => {
  Users.find()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => res.send(err));
});

module.exports = router;
