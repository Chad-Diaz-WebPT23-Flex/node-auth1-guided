const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const session = require("express-session");
const KnexSessionStore = require("connect-session-knex")(session);

const sessionConfig = {
  name: "monkey",
  secret: "keep it secret keep it dark",
  cookie: {
    maxAge: 60 * 60 * 1000,
    secure: false, // NOTE yes or no to using https - we have no cert
    httpOnly: true, // NOTE can only be viewed by sending and receiving by HTTP
  },
  resave: false, //
  saveUninitialized: false, // NOTE for EU regulations
  store: new KnexSessionStore({
    knex: require("../database/connection.js"), // NOTE put what ever config of knex you already have
    tablename: "sessions",
    sidfieldname: "sid",
    createtable: true,
    clearInterval: 60 * 60 * 1000,
  }),
};

const usersRouter = require("./users/users-router.js");
const authRouter = require("./auth/auth-router.js");

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig));

server.use("/api/users", usersRouter);
server.use("/api/auth", authRouter);

server.get("/", (req, res, next) => {
  res.status(200).json({ message: "api up" });
});

server.use((error, req, res, next) => {
  const errorStatus = error.status || 500;
  const errorMessage = error.message || "Server failed...";
  res.status(errorStatus).json({ message: errorMessage, stack: error.stack });
});

module.exports = server;
