const express = require("express");
const {
  createArticle,
  getAllArticles,
  updateArticles,
  deleteArticle,
  getOneArticle,
} = require("../app/controllers/article");
const verifyToken = require("../app/middleware/verifyAuth");
const router = express.Router();

router.get("/articles", verifyToken, getAllArticles);
router.post("/articles/add", verifyToken, createArticle);
router.get("/articles/:id", verifyToken, getOneArticle);
router.put("/articles/:id", verifyToken, updateArticles);
router.delete("/articles/:id", verifyToken, deleteArticle);

module.exports = router;
