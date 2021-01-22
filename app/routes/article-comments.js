const express = require("express");
const verifyToken = require("../middleware/verifyAuth");
const {
  createArticleComment,
  getAllComments,
  getOneArticleComments,
  updateComment,
  deleteComment,
} = require("../controllers/comment");
const router = express.Router();

router.get("/comments", verifyToken, getAllComments);
router.post("/comments", verifyToken, createArticleComment);
router.get("/comments/:article_id", verifyToken, getOneArticleComments);
router.put("/comments/:id", verifyToken, updateComment);
router.delete("/comments/:id", verifyToken, deleteComment);

module.exports = router;
