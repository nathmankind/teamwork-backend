const express = require("express");
const verifyToken = require("../app/middleware/verifyAuth");
const {
  createPostComment,
  getAllComments,
  updateComment,
  deleteComment,
  getOnePostComments,
} = require("../app/controllers/comment");
const router = express.Router();

router.get("/comments", verifyToken, getAllComments);
router.get("/comments/:post_id", verifyToken, getOnePostComments);
router.post("/posts/:post_id/comment", verifyToken, createPostComment);
router.put("/comments/:id", verifyToken, updateComment);
router.delete("comments/:id", verifyToken, deleteComment);
module.exports = router;
