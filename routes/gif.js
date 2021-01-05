const express = require("express");
const router = express.Router();
const {
  createGif,
  getAllGifs,
  getOneGif,
  updateGif,
  deleteGif,
} = require("../app/controllers/gif");
const verifyToken = require("../app/middleware/verifyAuth");

router.post("/gif", verifyToken, createGif);
router.get("/gif", getAllGifs);
router.get("/gif/:id", getOneGif);
router.put("/gif/:id", verifyToken, updateGif);
router.delete("/gif/:id", verifyToken, deleteGif);

module.exports = router;
