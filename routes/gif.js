const express = require("express");
const fileUpload = require("express-fileupload");
const router = express.Router();
const app = express();
app.use(fileUpload());
const upload = require("../handler/multer");

const {
  createGif,
  getAllGifs,
  getOneGif,
  updateGif,
  deleteGif,
} = require("../app/controllers/gif");
const verifyToken = require("../app/middleware/verifyAuth");

router.post("/gif", verifyToken, upload.single("images"), createGif);
router.get("/gif", getAllGifs);
router.get("/gif/:id", getOneGif);
router.put("/gif/:id", verifyToken, updateGif);
router.delete("/gif/:id", verifyToken, deleteGif);

module.exports = router;
