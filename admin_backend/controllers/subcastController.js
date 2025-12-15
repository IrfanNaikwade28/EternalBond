const db = require("../db"); // your mysql2 createPool export

// Add (or Update) SubCast - separate endpoints use this logic too
exports.addSubCast = (req, res) => {
  const { subCastName, castId } = req.body;
  if (!subCastName || !castId) {
    return res.status(400).json({ success: false, message: "All fields are required." });
  }

  const name = subCastName.trim();

  // Check duplicate for add
  const checkSql = "SELECT SCTID FROM mst_subcast WHERE Subcast = ? AND CTID = ?";
  db.query(checkSql, [name, castId], (err, rows) => {
    if (err) {
      console.error("Duplicate check error:", err);
      return res.status(500).json({ success: false, message: "Database error" });
    }
    if (rows.length > 0) {
      return res.status(409).json({ success: false, message: "SubCast already exists for this Cast." });
    }

    const insertSql = "INSERT INTO mst_subcast (Subcast, CTID, status) VALUES (?, ?, 1)";
    db.query(insertSql, [name, castId], (err2, result) => {
      if (err2) {
        console.error("Insert error:", err2);
        return res.status(500).json({ success: false, message: "Failed to add SubCast." });
      }
      return res.status(201).json({ success: true, message: "SubCast added successfully.", id: result.insertId });
    });
  });
};

exports.updateSubCast = (req, res) => {
  const { SCTID, subCastName, castId } = req.body;
  if (!SCTID || !subCastName || !castId) {
    return res.status(400).json({ success: false, message: "All fields are required." });
  }

  const name = subCastName.trim();

  // Check duplicate (excluding current)
  const checkSql = "SELECT SCTID FROM mst_subcast WHERE Subcast = ? AND CTID = ? AND SCTID <> ?";
  db.query(checkSql, [name, castId, SCTID], (err, rows) => {
    if (err) {
      console.error("Duplicate check error:", err);
      return res.status(500).json({ success: false, message: "Database error" });
    }
    if (rows.length > 0) {
      return res.status(409).json({ success: false, message: "SubCast already exists for this Cast." });
    }

    const updateSql = "UPDATE mst_subcast SET Subcast = ?, CTID = ? WHERE SCTID = ?";
    db.query(updateSql, [name, castId, SCTID], (err2, result) => {
      if (err2) {
        console.error("Update error:", err2);
        return res.status(500).json({ success: false, message: "Failed to update SubCast." });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: "SubCast not found." });
      }
      return res.json({ success: true, message: "SubCast updated successfully." });
    });
  });
};

exports.getSubCasts = (req, res) => {
  const search = (req.query.search || "").trim();
  const page = parseInt(req.query.page || "1", 10);
  const limit = parseInt(req.query.limit || "5", 10);
  const offset = (page - 1) * limit;

  const countSql = `
    SELECT COUNT(*) AS total
    FROM mst_subcast s
    JOIN mst_cast c ON s.CTID = c.CTID
    WHERE s.Subcast LIKE ? OR c.Cast LIKE ?
  `;
  const dataSql = `
    SELECT s.SCTID, s.Subcast, s.CTID, c.Cast AS CastName
    FROM mst_subcast s
    JOIN mst_cast c ON s.CTID = c.CTID
    WHERE s.Subcast LIKE ? OR c.Cast LIKE ?
    ORDER BY s.SCTID DESC
    LIMIT ? OFFSET ?
  `;

  const term = `%${search}%`;
  db.query(countSql, [term, term], (errC, countRows) => {
    if (errC) {
      console.error("Count query error:", errC);
      return res.status(500).json({ success: false, message: "Database error" });
    }
    const total = countRows[0].total || 0;
    db.query(dataSql, [term, term, limit, offset], (err, rows) => {
      if (err) {
        console.error("Fetch query error:", err);
        return res.status(500).json({ success: false, message: "Database error" });
      }
      return res.json({ success: true, data: rows, total, page, limit });
    });
  });
};

exports.getCasts = (req, res) => {
  const sql = "SELECT CTID, Cast FROM mst_cast WHERE status = 1 ORDER BY Cast ASC";
  db.query(sql, (err, rows) => {
    if (err) {
      console.error("Get casts error:", err);
      return res.status(500).json({ success: false, message: "Database error" });
    }
    return res.json({ success: true, data: rows });
  });
};

exports.deleteSubCast = (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ success: false, message: "Invalid ID." });

  const sql = "DELETE FROM mst_subcast WHERE SCTID = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Delete error:", err);
      return res.status(500).json({ success: false, message: "Database error" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "SubCast not found." });
    }
    return res.json({ success: true, message: "SubCast deleted successfully." });
  });
};
