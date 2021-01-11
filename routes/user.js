const express = require("express");
const router = express.Router();
const db = require("../app/db");
const {
  createUser,
  signinUser,
  getAllUsers,
} = require("../app/controllers/user");
const verifyToken = require("../app/middleware/verifyAuth");
const { getAllArticles } = require("../app/controllers/article");

router.post("/auth/signup", verifyToken, createUser);
router.post("/auth/login", signinUser);
router.get("/auth/users", getAllUsers);

module.exports = router;
