const express = require("express");
const router = express.Router();
const db = require("../db");
const { createUser, signinUser, getAllUsers } = require("../controllers/user");
const verifyToken = require("../middleware/verifyAuth");

router.post("/auth/signup", createUser);
router.post("/auth/login", signinUser);
router.get("/auth/users", getAllUsers);

module.exports = router;
