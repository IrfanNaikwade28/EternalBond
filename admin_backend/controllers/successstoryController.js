const db = require("../db");

// =================== Get all grooms ===================
exports.getAllGrooms = (req, res) => {
  const q = `SELECT UID, Uname FROM mst_users WHERE Gender='Male' ORDER BY UID DESC`;
  db.query(q, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

// =================== Get all brides ===================
exports.getAllBrides = (req, res) => {
  const q = `SELECT UID, Uname FROM mst_users WHERE Gender='Female' ORDER BY UID DESC`;
  db.query(q, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

// =================== Add a Success Story ===================
exports.addSuccessStory = (req, res) => {
  const { Bridename, Groomname, Feedback } = req.body;
  const simg = req.file ? req.file.filename : null;

  const q = `INSERT INTO mst_story (Bridename, groomname, Feedback, simg, status) VALUES (?, ?, ?, ?, 1)`;

  db.query(q, [Bridename, Groomname, Feedback, simg], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Story added successfully" });
  });
};

// =================== Get All Stories ===================
exports.getAllStories = (req, res) => {
  const q = `SELECT * FROM mst_story ORDER BY SID DESC`; // ✅ use SID
  db.query(q, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};



// =================== Update Story ===================
exports.updateStory = (req, res) => {
  const { Bridename, Groomname, Feedback } = req.body;
  const newImg = req.file ? req.file.filename : null;

  const q = newImg
    ? `UPDATE mst_story SET Bridename=?, groomname=?, Feedback=?, simg=? WHERE SID=?`
    : `UPDATE mst_story SET Bridename=?, groomname=?, Feedback=? WHERE SID=?`;

  const params = newImg
    ? [Bridename, Groomname, Feedback, newImg, req.params.id]
    : [Bridename, Groomname, Feedback, req.params.id];

  db.query(q, params, (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Story updated successfully" });
  });
};

// =================== Delete Story ===================
exports.deleteStory = (req, res) => {
  const q = `DELETE FROM mst_story WHERE SID=?`;
  db.query(q, [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Story deleted successfully" });
  });
};
// =================== Get Single Story ===================
exports.getStoryById = (req, res) => {
  const q = `SELECT * FROM mst_story WHERE SID=?`;

  db.query(q, [req.params.id], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.length === 0) {
      return res.status(404).json({ message: "Story not found" });
    }

    res.json(result[0]);   // return SINGLE RECORD
  });
};