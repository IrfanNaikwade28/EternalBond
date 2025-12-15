const db = require("../db");
// ✅ Get all Nakshtras (no pagination, no limit)
exports.getAllNakshtras = (req, res) => {
  const sql = `
    SELECT n.NKID, n.Nakshtra, c.Cast, c.CTID
    FROM mst_nakshtra n
    JOIN mst_cast c ON n.CTID = c.CTID
    ORDER BY n.NKID ASC
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching all Nakshtras:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.status(200).json(result);
  });
};

// Get Nakshtras with pagination & search
exports.getNakshtras = (req, res) => {
  const { page = 1, limit = 5, search = "" } = req.query;
  const offset = (page - 1) * limit;

  const countQuery = `
    SELECT COUNT(*) as total
    FROM mst_nakshtra n
    JOIN mst_cast c ON n.CTID = c.CTID
    WHERE n.Nakshtra LIKE ?
  `;

  const sql = `
    SELECT n.NKID, n.Nakshtra, c.Cast, c.CTID
    FROM mst_nakshtra n
    JOIN mst_cast c ON n.CTID = c.CTID
    WHERE n.Nakshtra LIKE ?
    ORDER BY n.NKID DESC
    LIMIT ? OFFSET ?
  `;

  db.query(countQuery, [`%${search}%`], (err, countResult) => {
    if (err) return res.status(500).json({ message: "Database error" });
    const total = countResult[0].total;

    db.query(sql, [`%${search}%`, parseInt(limit), parseInt(offset)], (err, result) => {
      if (err) return res.status(500).json({ message: "Database error" });

      res.status(200).json({
        data: result,
        total,
        page: parseInt(page),
        limit: parseInt(limit),
      });
    });
  });
};

// Get all casts
exports.getCasts = (req, res) => {
  const sql = "SELECT * FROM mst_cast";
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.status(200).json(result);
  });
};

// Add Nakshtra
// Add Nakshtra
exports.addNakshtra = (req, res) => {
  let { nakshtraName, castId } = req.body;
  nakshtraName = nakshtraName?.trim(); // remove extra spaces

  if (!nakshtraName || !castId)
    return res.status(400).json({ message: "All fields are required" });

  const checkSql = "SELECT * FROM mst_nakshtra WHERE Nakshtra=? AND CTID=?";
  db.query(checkSql, [nakshtraName, castId], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (result.length > 0)
      return res.status(409).json({ message: "Nakshtra already exists for this Cast" }); // use 409 for conflict

    const sql = "INSERT INTO mst_nakshtra (Nakshtra, CTID) VALUES (?, ?)";
    db.query(sql, [nakshtraName, castId], (err) => {
      if (err) return res.status(500).json({ message: "Database error" });
      res.status(200).json({ message: "Nakshtra added successfully" });
    });
  });
};
// Update Nakshtra
exports.updateNakshtra = (req, res) => {
  const { id } = req.params;
  let { nakshtraName, castId } = req.body;
  nakshtraName = nakshtraName?.trim();

  if (!nakshtraName || !castId)
    return res.status(400).json({ message: "All fields are required" });

  const checkSql = "SELECT * FROM mst_nakshtra WHERE Nakshtra=? AND CTID=? AND NKID<>?";
  db.query(checkSql, [nakshtraName, castId, id], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (result.length > 0)
      return res.status(409).json({ message: "Nakshtra already exists for this Cast" }); // 409

    const sql = "UPDATE mst_nakshtra SET Nakshtra=?, CTID=? WHERE NKID=?";
    db.query(sql, [nakshtraName, castId, id], (err) => {
      if (err) return res.status(500).json({ message: "Database error" });
      res.status(200).json({ message: "Nakshtra updated successfully" });
    });
  });
};
// Delete Nakshtra
exports.deleteNakshtra = (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM mst_nakshtra WHERE NKID=?";
  db.query(sql, [id], (err) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.status(200).json({ message: "Nakshtra deleted successfully" });
  });
};
