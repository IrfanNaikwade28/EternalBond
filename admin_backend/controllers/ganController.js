const db = require("../db");

// Get all casts for dropdown
exports.getCasts = (req, res) => {
  db.query("SELECT * FROM mst_cast WHERE status = 1", (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database query error" });
    }
    res.json(results);
  });
};

// Get all Gans with cast name
exports.getGans = (req, res) => {
  const query = `
    SELECT g.GNID, g.Gan, c.Cast, g.CTID
    FROM mst_gan g
    JOIN mst_cast c ON g.CTID = c.CTID
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database query error" });
    }
    res.json(results);
  });
};

// Add new Gan with duplicate check
exports.addGan = (req, res) => {
  let { ganName, castId } = req.body;

  if (!ganName || !castId) {
    return res.status(400).json({ message: "Gan name and Cast are required" });
  }

  ganName = ganName.trim();

  // Duplicate check (case-insensitive)
  const checkSql = "SELECT * FROM mst_gan WHERE LOWER(Gan) = ? AND CTID = ?";
  db.query(checkSql, [ganName.toLowerCase(), castId], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error", err });

    if (result.length > 0) {
      return res.status(409).json({ message: "Gan already exists for this Cast" });
    }

    const insertSql = "INSERT INTO mst_gan (Gan, CTID) VALUES (?, ?)";
    db.query(insertSql, [ganName, castId], (err, result) => {
      if (err) return res.status(500).json({ message: "Database insert error", err });
      res.status(201).json({ message: "Gan added successfully", id: result.insertId });
    });
  });
};

// Update Gan with duplicate check
exports.updateGan = (req, res) => {
  const { id } = req.params;
  let { ganName, castId } = req.body;

  if (!ganName || !castId) {
    return res.status(400).json({ message: "Gan name and Cast are required" });
  }

  ganName = ganName.trim();

  // Duplicate check (excluding current Gan)
  const checkSql = "SELECT * FROM mst_gan WHERE LOWER(Gan) = ? AND CTID = ? AND GNID != ?";
  db.query(checkSql, [ganName.toLowerCase(), castId, id], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error", err });

    if (result.length > 0) {
      return res.status(409).json({ message: "Gan already exists for this Cast" });
    }

    const updateSql = "UPDATE mst_gan SET Gan = ?, CTID = ? WHERE GNID = ?";
    db.query(updateSql, [ganName, castId, id], (err) => {
      if (err) return res.status(500).json({ message: "Database update error", err });
      res.json({ message: "Gan updated successfully" });
    });
  });
};

// Delete Gan
exports.deleteGan = (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM mst_gan WHERE GNID = ?", [id], (err) => {
    if (err) return res.status(500).json({ message: "Database delete error", err });
    res.json({ message: "Gan deleted successfully" });
  });
};
