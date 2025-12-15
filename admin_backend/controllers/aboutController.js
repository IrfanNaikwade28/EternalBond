const db = require("../db");

// ===================== GET ALL CAST ==========================
exports.getAllCast = (req, res) => {
  const q = "SELECT CTID, `Cast` FROM mst_cast WHERE status = 1 ORDER BY CTID DESC";
  db.query(q, (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(result);
  });
};

// ===================== GET ALL ABOUT ==========================
exports.getAllAbout = (req, res) => {
  const q = `
    SELECT ABID, ABOUT, Cast 
    FROM mst_about
    WHERE status = 1
    ORDER BY ABID DESC
  `;
  db.query(q, (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(result);
  });
};

// ===================== ADD NEW ABOUT ==========================
exports.addAbout = (req, res) => {
  const { cast, testimonial } = req.body;

  if (!cast || !testimonial)
    return res.status(400).json({ error: "All fields required" });

  const q = `INSERT INTO mst_about (ABOUT, Cast, status) VALUES (?, ?, 1)`;

  db.query(q, [testimonial, cast], (err, result) => {
    if (err) return res.status(500).json({ error: "Insert error" });
    res.json({ message: "Inserted successfully", id: result.insertId });
  });
};

// ===================== UPDATE ABOUT ==========================
exports.updateAbout = (req, res) => {
  const ABID = req.params.id;
  const { cast, testimonial } = req.body;

  if (!cast || !testimonial)
    return res.status(400).json({ error: "All fields required" });

  const q = `UPDATE mst_about SET ABOUT = ?, Cast = ? WHERE ABID = ?`;

  db.query(q, [testimonial, cast, ABID], (err) => {
    if (err) return res.status(500).json({ error: "Update error" });
    res.json({ message: "Updated successfully" });
  });
};

// ===================== DELETE ABOUT ==========================
exports.deleteAbout = (req, res) => {
  const ABID = req.params.id;

  const q = `DELETE FROM mst_about WHERE ABID = ?`;

  db.query(q, [ABID], (err) => {
    if (err) return res.status(500).json({ error: "Delete error" });
    res.json({ message: "Deleted successfully" });
  });
};
