const express = require("express");
const router = express.Router();
const User = require("../models/user");
const ERROR_CODES = require("../utils/errors");
const { getUsers, getUser, createUser } = require("../controllers/users");

// GET all users
router.get("/", getUsers);

// GET a single user by _id
router.get("/:userId", getUser);

// POST a new user
router.post("/", createUser);

module.exports = router;
