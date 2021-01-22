const express = require("express");
const router = express.Router();
const db = require("../db");
const verifyToken = require("../middleware/verifyAuth");
const upload = require("../handler/multer");
const {
  getAllPosts,
  createArticle,
  getOnePost,
  deletePost,
  createGifPost,
  updatePost,
} = require("../controllers/posts");

router.post("/posts", verifyToken, createArticle);
router.post("/posts/gif", verifyToken, upload.single("gif"), createGifPost);
router.get("/posts", getAllPosts);
router.get("/posts/:id", getOnePost);
router.put("/posts/:id", verifyToken, upload.single("gif"), updatePost);
router.delete("/posts/:id", verifyToken, deletePost);

module.exports = router;
