const express = require("express");
const router = express.Router();
const multer = require("multer");

const {
  getAllGrooms,
  getAllBrides,
  addSuccessStory,
  getAllStories,
 getStoryById,
  updateStory,
  deleteStory
} = require("../controllers/successstoryController");

// ------- FILE UPLOAD STORAGE ------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/story");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  }
});
const upload = multer({ storage });

// ------- ROUTES -------
router.get("/grooms", getAllGrooms);
router.get("/brides", getAllBrides);

router.post("/add", upload.single("simg"), addSuccessStory);
router.get("/all", getAllStories);
router.get("/:id",getStoryById);

router.put("/update/:id", upload.single("simg"), updateStory);
router.delete("/delete/:id", deleteStory);

module.exports = router;
