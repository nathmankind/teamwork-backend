const express = require("express");
const verifyToken = require("../app/middleware/verifyAuth");
const {
  createGifComment,
  getAllGifComments,
  getOneGifComments,
  updateGifComment,
  deleteGifComment,
} = require("../app/controllers/gifcomment");
const router = express.Router();

router.get("/gif-comments", verifyToken, getAllGifComments);
router.post("/gif-comments", verifyToken, createGifComment);
router.get("/gif-comments/:gif_id", verifyToken, getOneGifComments);
router.put("/gif-comments/:id", verifyToken, updateGifComment);
router.delete("/gif-comments/:id", verifyToken, deleteGifComment);

module.exports = router;
