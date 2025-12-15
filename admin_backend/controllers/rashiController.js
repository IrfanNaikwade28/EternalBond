const db = require("../db");

// 📌 Get all Rashis with pagination & search
exports.getAllRashi = (req, res) => {
  const { page = 1, limit = 5, search = "" } = req.query;
  const offset = (page - 1) * limit;

  const countQuery = `SELECT COUNT(*) AS total FROM mst_rashi WHERE LOWER(Ras) LIKE LOWER(?)`;
  db.query(countQuery, [`%${search.trim()}%`], (countErr, countResult) => {
    if (countErr) return res.status(500).json({ error: countErr.message });

    const total = countResult[0].total;

    const query = `
      SELECT RSID, Ras
      FROM mst_rashi
      WHERE LOWER(Ras) LIKE LOWER(?)
      ORDER BY RSID DESC
      LIMIT ? OFFSET ?
    `;

    db.query(query, [`%${search.trim()}%`, parseInt(limit), parseInt(offset)], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      res.json({
        data: result,
        total: total,
        page: parseInt(page),
        limit: parseInt(limit),
      });
    });
  });
};
// 📌 Get ALL Rashis without limit or pagination
exports.getAllRashiList = (req, res) => {
  const query = "SELECT RSID, Ras FROM mst_rashi ORDER BY RSID DESC";

  db.query(query, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
};
// 📌 Add new Rashi (with duplicate check)
exports.addRashi = (req, res) => {
  const { Rashi } = req.body;
  if (!Rashi || !Rashi.trim()) {
    return res.status(400).json({ message: "Rashi name is required" });
  }

  const name = Rashi.trim();

  const checkQuery = "SELECT * FROM mst_rashi WHERE LOWER(Ras) = LOWER(?)";
  db.query(checkQuery, [name], (checkErr, checkResult) => {
    if (checkErr) return res.status(500).json({ error: checkErr.message });

    if (checkResult.length > 0) {
      return res.status(409).json({ message: "Rashi already exists" });
    }

    const insertQuery = "INSERT INTO mst_rashi (Ras) VALUES (?)";
    db.query(insertQuery, [name], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      res.json({ message: "Rashi added successfully", RSID: result.insertId });
    });
  });
};

// 📌 Update Rashi (with duplicate check)
exports.updateRashi = (req, res) => {
  const { id } = req.params;
  const { Rashi } = req.body;

  if (!Rashi || !Rashi.trim()) {
    return res.status(400).json({ message: "Rashi name is required" });
  }

  const idInt = parseInt(id);       // Ensure numeric comparison
  const name = Rashi.trim();

  // ✅ Check for duplicate excluding current RSID
  const checkQuery = "SELECT * FROM mst_rashi WHERE LOWER(Ras) = LOWER(?) AND RSID != ?";
  db.query(checkQuery, [name, idInt], (checkErr, checkResult) => {
    if (checkErr) return res.status(500).json({ error: checkErr.message });

    if (checkResult.length > 0) {
      return res.status(409).json({ message: "Rashi with this name already exists" });
    }

    const updateQuery = "UPDATE mst_rashi SET Ras = ? WHERE RSID = ?";
    db.query(updateQuery, [name, idInt], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Rashi not found" });
      }

      res.json({ message: "Rashi updated successfully" });
    });
  });
};

// 📌 Delete Rashi
exports.deleteRashi = (req, res) => {
  const { id } = req.params;
  const idInt = parseInt(id);

  const deleteQuery = "DELETE FROM mst_rashi WHERE RSID = ?";
  db.query(deleteQuery, [idInt], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Rashi not found" });
    }

    res.json({ message: "Rashi deleted successfully" });
  });
};
