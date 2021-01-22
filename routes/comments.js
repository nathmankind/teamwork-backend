const express = require("express");
const verifyToken = require("../app/middleware/verifyAuth");
const {
  createPostComment,
  getAllComments,
  getOnePostComments,
  updateComment,
  deleteComment,
} = require("../app/controllers/comment");
const router = express.Router();

router.get("/comments", getAllComments);
router.get("/comments/:post_id", getOnePostComments);
router.post("/posts/:post_id/comment", verifyToken, createPostComment);
router.put("/comments/:id", verifyToken, updateComment);
router.delete("/comments/:id", verifyToken, deleteComment);
module.exports = router;
