const db = require("../db");
// ✅ Get all Marriage Types (without limit or pagination)
exports.getAllMarriageTypes = (req, res) => {
  const query = "SELECT MRID, Marriage FROM mst_marriage WHERE status = 1 ORDER BY MRID DESC";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching marriage types:", err);
      return res.status(500).json({ success: false, message: "Database error" });
    }
    res.json(results);
  });
};
// ✅ Add Marriage Type (with duplicate check)
exports.addMarriage = (req, res) => {
  const { marriage } = req.body;

  if (!marriage || marriage.trim() === "") {
    return res.status(400).json({ success: false, message: "Marriage Type is required" });
  }

  const checkQuery = "SELECT * FROM mst_marriage WHERE Marriage = ?";
  db.query(checkQuery, [marriage], (err, result) => {
    if (err) {
      console.error("Error checking duplicate:", err);
      return res.status(500).json({ success: false, message: "Database error" });
    }

    if (result.length > 0) {
      return res.status(400).json({ success: false, message: "Marriage Type already exists" });
    }

    const insertQuery = "INSERT INTO mst_marriage (Marriage, status) VALUES (?, 1)";
    db.query(insertQuery, [marriage], (err2) => {
      if (err2) {
        console.error("Error inserting:", err2);
        return res.status(500).json({ success: false, message: "Failed to add Marriage Type" });
      }

      res.json({ success: true, message: "Marriage Type added successfully!" });
    });
  });
};

// ✅ Get all Marriage Types (with search + pagination)
exports.getAllMarriage = (req, res) => {
  const search = req.query.search || "";
  const page = parseInt(req.query.page) || 1;
  const limit = 5;
  const offset = (page - 1) * limit;

  const countQuery = "SELECT COUNT(*) AS count FROM mst_marriage WHERE Marriage LIKE ?";
  db.query(countQuery, [`%${search}%`], (err, countResult) => {
    if (err) {
      console.error("Count query error:", err);
      return res.status(500).json({ success: false, message: "Database error" });
    }

    const total = countResult[0].count;

    const fetchQuery = `
      SELECT * FROM mst_marriage
      WHERE Marriage LIKE ?
      ORDER BY MRID DESC
      LIMIT ? OFFSET ?
    `;
    db.query(fetchQuery, [`%${search}%`, limit, offset], (err2, results) => {
      if (err2) {
        console.error("Fetch query error:", err2);
        return res.status(500).json({ success: false, message: "Database error" });
      }

      res.json({ success: true, data: results, total, page, limit });
    });
  });
};

// ✅ Update Marriage Type (with duplicate check)
exports.updateMarriage = (req, res) => {
  const { MRID, marriage } = req.body;

  if (!MRID || !marriage || marriage.trim() === "") {
    return res.status(400).json({ success: false, message: "Invalid data" });
  }

  const checkQuery = "SELECT * FROM mst_marriage WHERE Marriage = ? AND MRID != ?";
  db.query(checkQuery, [marriage, MRID], (err, result) => {
    if (err) {
      console.error("Duplicate check error:", err);
      return res.status(500).json({ success: false, message: "Database error" });
    }

    if (result.length > 0) {
      return res.status(400).json({ success: false, message: "Duplicate Marriage Type" });
    }

    const updateQuery = "UPDATE mst_marriage SET Marriage = ? WHERE MRID = ?";
    db.query(updateQuery, [marriage, MRID], (err2) => {
      if (err2) {
        console.error("Update query error:", err2);
        return res.status(500).json({ success: false, message: "Failed to update Marriage Type" });
      }

      res.json({ success: true, message: "Marriage Type updated successfully!" });
    });
  });
};

// ✅ Delete Marriage Type
exports.deleteMarriage = (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ success: false, message: "Invalid ID" });
  }

  const deleteQuery = "DELETE FROM mst_marriage WHERE MRID = ?";
  db.query(deleteQuery, [id], (err) => {
    if (err) {
      console.error("Delete query error:", err);
      return res.status(500).json({ success: false, message: "Failed to delete Marriage Type" });
    }

    res.json({ success: true, message: "Marriage Type deleted successfully!" });
  });
};
