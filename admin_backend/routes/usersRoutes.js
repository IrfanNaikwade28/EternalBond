const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
//const usersController = require("../controllers/usersController");
const usersController = require("../controllers/usersController");
const uploadRoot = path.join(__dirname, "..", "uploads");
const photosDir = path.join(uploadRoot, "photos");
const aadharDir = path.join(uploadRoot, "aadhar");
[uploadRoot, photosDir, aadharDir].forEach((d) => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});


router.get("/:UID", usersController.getUserById);




const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "uprofile") cb(null, photosDir);
    else cb(null, aadharDir);
  },
  filename: (req, file, cb) => {
    const safeName = Date.now() + "-" + file.originalname.replace(/\s+/g, "-");
    cb(null, safeName);
  },
});

const upload = multer({ storage });

router.get("/", usersController.getUsers);
// router.post("/check-duplicates", async (req, res) => {
//   const { mobile, alternate, whatsapp, UID } = req.body;
//   try {
//     // Example using MySQL
//     const [existing] = await db.query(
//       "SELECT UID, Umobile, alt_mobile, whatsappno FROM mst_users WHERE UID != ? AND (Umobile = ? OR alt_mobile = ? OR whatsappno = ?)",
//       [UID || 0, mobile, alternate, whatsapp]
//     );

//     if (existing.length) {
//       if (existing[0].Umobile === mobile) return res.status(400).json({ field: "mobile" });
//       if (existing[0].alt_mobile === alternate) return res.status(400).json({ field: "alternate" });
//       if (existing[0].whatsappno === whatsapp) return res.status(400).json({ field: "whatsapp" });
//     }

//     res.json({ success: true });
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

router.post(
  "/",
  upload.fields([
    { name: "uprofile", maxCount: 1 },
    { name: "aadhar_front_photo", maxCount: 1 },
    { name: "aadhar_back_photo", maxCount: 1 },
  ]),
   // ✅ middleware
  usersController.addUser
);
router.post("/check-duplicates", usersController.checkDuplicates);
router.put(
  "/:id",
  upload.fields([
    { name: "uprofile", maxCount: 1 },
    { name: "aadhar_front_photo", maxCount: 1 },
    { name: "aadhar_back_photo", maxCount: 1 },
  ]),
  
  usersController.updateUser
);
router.delete("/:id", usersController.deleteUser);
//router.post("/", usersController.checkDuplicateNumbers);
module.exports = router;
