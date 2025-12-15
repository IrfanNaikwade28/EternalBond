const db = require("../db");

// Get all Nadi (with optional search)
exports.getNadis = (req, res) => {
  //const { search = "" } = req.query;
  const sql = `SELECT * FROM mst_nadi `;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.json(result);
  });
};

// Add new Nadi with duplicate check
exports.addNadi = (req, res) => {
  const { Nadi } = req.body;
  if (!Nadi) return res.status(400).json({ message: "Nadi name is required" });

  // Check duplicate
  const checkSql = "SELECT * FROM mst_nadi WHERE Nadi=?";
  db.query(checkSql, [Nadi.trim()], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (result.length > 0) {
      return res.status(409).json({ message: "Nadi already exists" });
    }

    const sql = "INSERT INTO mst_nadi (Nadi) VALUES (?)";
    db.query(sql, [Nadi.trim()], (err, result) => {
      if (err) return res.status(500).json({ message: "Database error" });
      res.status(201).json({ message: "Nadi added successfully", id: result.insertId });
    });
  });
};

// Update Nadi with duplicate check
exports.updateNadi = (req, res) => {
  const { id } = req.params;
  const { Nadi } = req.body;
  if (!Nadi) return res.status(400).json({ message: "Nadi name is required" });

  // Check duplicate excluding current
  const checkSql = "SELECT * FROM mst_nadi WHERE Nadi=? AND NDID!=?";
  db.query(checkSql, [Nadi.trim(), id], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (result.length > 0) {
      return res.status(409).json({ message: "Nadi already exists" });
    }

    const sql = "UPDATE mst_nadi SET Nadi=? WHERE NDID=?";
    db.query(sql, [Nadi.trim(), id], (err) => {
      if (err) return res.status(500).json({ message: "Database error" });
      res.json({ message: "Nadi updated successfully" });
    });
  });
};

// Delete Nadi
exports.deleteNadi = (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM mst_nadi WHERE NDID=?";
  db.query(sql, [id], (err) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.json({ message: "Nadi deleted successfully" });
  });
};
