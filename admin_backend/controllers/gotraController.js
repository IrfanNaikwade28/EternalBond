const db = require("../db");

// Get all casts
exports.getCasts = (req, res) => {
  const sql = "SELECT * FROM mst_cast";
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ message: "Database error", err });
    res.json(result);
  });
};

// Get gotras with search and pagination
exports.getGotras = (req, res) => {
  let { page = 1, limit = 5, search = "" } = req.query;
  page = parseInt(page);
  limit = parseInt(limit);
  const offset = (page - 1) * limit;

  const countSql = `SELECT COUNT(*) AS total FROM mst_gotra g
    JOIN mst_cast c ON g.CTID = c.CTID
    WHERE g.Gotra LIKE ?`;

  const dataSql = `SELECT g.GID, g.Gotra, c.Cast, g.CTID FROM mst_gotra g
    JOIN mst_cast c ON g.CTID = c.CTID
    WHERE g.Gotra LIKE ?
    ORDER BY g.GID DESC
    LIMIT ? OFFSET ?`;

  const searchTerm = `%${search}%`;

  db.query(countSql, [searchTerm], (err, countResult) => {
    if (err) return res.status(500).json({ message: "Database error", err });

    const total = countResult[0].total;

    db.query(dataSql, [searchTerm, limit, offset], (err, dataResult) => {
      if (err) return res.status(500).json({ message: "Database error", err });

      res.json({
        gotras: dataResult,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      });
    });
  });
};

// Add gotra with duplicate check
exports.addGotra = (req, res) => {
  const { gotraName, castId } = req.body;
  if (!gotraName || !castId)
    return res.status(400).json({ message: "Gotra name and cast required" });

  // Check for duplicate gotra in the same cast
  const checkSql = "SELECT * FROM mst_gotra WHERE Gotra = ? AND CTID = ?";
  db.query(checkSql, [gotraName.trim(), castId], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error", err });
    if (result.length > 0) {
      return res.status(409).json({ message: "Gotra already exists for this cast" });
    }

    const sql = "INSERT INTO mst_gotra (Gotra, CTID) VALUES (?, ?)";
    db.query(sql, [gotraName.trim(), castId], (err, result) => {
      if (err) return res.status(500).json({ message: "Database error", err });
      res.status(201).json({ message: "Gotra added successfully" });
    });
  });
};

// Update gotra with duplicate check
// Update gotra with proper duplicate check
exports.updateGotra = (req, res) => {
  const { id } = req.params;
  let { gotraName, castId } = req.body;

  if (!gotraName || !castId)
    return res.status(400).json({ message: "Gotra name and cast required" });

  gotraName = gotraName.trim();

  // Check for duplicate (case-insensitive)
  const checkSql = "SELECT * FROM mst_gotra WHERE LOWER(Gotra) = ? AND CTID = ? AND GID != ?";
  db.query(checkSql, [gotraName.toLowerCase(), castId, id], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error", err });

    if (result.length > 0) {
      return res.status(409).json({ message: "Gotra with this name already exists for this cast" });
    }

    const updateSql = "UPDATE mst_gotra SET Gotra = ?, CTID = ? WHERE GID = ?";
    db.query(updateSql, [gotraName, castId, id], (err, result) => {
      if (err) return res.status(500).json({ message: "Database error", err });
      res.json({ message: "Gotra updated successfully" });
    });
  });
};

// Delete gotra
exports.deleteGotra = (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM mst_gotra WHERE GID = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error", err });
    res.json({ message: "Gotra deleted successfully" });
  });
};
