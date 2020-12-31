const express = require("express");
const { createArticle, getAllArticles } = require("../app/controllers/article");
const router = express.Router();

router.get("/articles", getAllArticles);
router.post("/articles/add", createArticle);

module.exports = router;
