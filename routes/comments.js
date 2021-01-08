const express = require("express");
const verifyToken = require("../app/middleware/verifyAuth");
const { createPostComment } = require("../app/controllers/comment");
const router = express.Router();

router.post("/posts/:post_id/comment", verifyToken, createPostComment);

module.exports = router;
