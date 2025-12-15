const db = require("../db");

// Add Country
exports.addCountry = (req, res) => {
  const { countryName } = req.body;
  if (!countryName) return res.status(400).json({ success: false, message: "Country name is required." });

  const name = countryName.trim();

  // Check duplicate
  const checkSql = "SELECT CNID FROM mst_country WHERE Country = ?";
  db.query(checkSql, [name], (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: "Database error" });
    if (rows.length > 0) return res.status(409).json({ success: false, message: "Country already exists." });

    const insertSql = "INSERT INTO mst_country (Country, status) VALUES (?, 1)";
    db.query(insertSql, [name], (err2, result) => {
      if (err2) return res.status(500).json({ success: false, message: "Failed to add country." });
      return res.status(201).json({ success: true, message: "Country added successfully.", id: result.insertId });
    });
  });
};

// Update Country
exports.updateCountry = (req, res) => {
  const { CNID, countryName } = req.body;
  if (!CNID || !countryName) return res.status(400).json({ success: false, message: "All fields are required." });

  const name = countryName.trim();

  const checkSql = "SELECT CNID FROM mst_country WHERE Country = ? AND CNID <> ?";
  db.query(checkSql, [name, CNID], (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: "Database error" });
    if (rows.length > 0) return res.status(409).json({ success: false, message: "Country already exists." });

    const updateSql = "UPDATE mst_country SET Country = ? WHERE CNID = ?";
    db.query(updateSql, [name, CNID], (err2, result) => {
      if (err2) return res.status(500).json({ success: false, message: "Failed to update country." });
      if (result.affectedRows === 0) return res.status(404).json({ success: false, message: "Country not found." });
      return res.json({ success: true, message: "Country updated successfully." });
    });
  });
};

// Get Country list (search + pagination)
exports.getCountries = (req, res) => {
  const search = (req.query.search || "").trim();
  const page = parseInt(req.query.page || "1", 10);
  const limit = parseInt(req.query.limit || "5", 10);
  const offset = (page - 1) * limit;

  const countSql = "SELECT COUNT(*) AS total FROM mst_country WHERE Country LIKE ?";
  const dataSql = "SELECT CNID, Country FROM mst_country WHERE Country LIKE ? ORDER BY CNID DESC LIMIT ? OFFSET ?";

  const term = `%${search}%`;
  db.query(countSql, [term], (errC, countRows) => {
    if (errC) return res.status(500).json({ success: false, message: "Database error" });
    const total = countRows[0].total || 0;
    db.query(dataSql, [term, limit, offset], (err, rows) => {
      if (err) return res.status(500).json({ success: false, message: "Database error" });
      return res.json({ success: true, data: rows, total, page, limit });
    });
  });
};

// Delete Country
exports.deleteCountry = (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ success: false, message: "Invalid ID." });

  const sql = "DELETE FROM mst_country WHERE CNID = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: "Database error" });
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: "Country not found." });
    return res.json({ success: true, message: "Country deleted successfully." });
  });
};
