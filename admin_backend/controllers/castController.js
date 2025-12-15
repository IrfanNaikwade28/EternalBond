const db = require("../db");

// Get all casts
exports.getAllCasts = (req, res) => {
  const query = "SELECT * FROM mst_cast ";
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.json(results);
  });
};
// Get sub-casts based on cast ID
exports.getSubCasts = (req, res) => {
  const { castId } = req.params;

  if (!castId) {
    return res.status(400).json({ message: "Cast ID is required" });
  }

  const query = "SELECT SCTID, Subcast FROM mst_subcast WHERE CTID = ? AND status = 1 ORDER BY Subcast ASC";
  db.query(query, [castId], (err, results) => {
    if (err) {
      console.error("Error fetching sub-casts:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.json(results);
  });
};


// ✅ Get all Casts (with optional search)
// exports.getCasts = (req, res) => {
//   //const { search = "" } = req.query;

//   const sql = `
//     SELECT CTID, Cast 
//     FROM mst_cast 
//     WHERE status = 1 AND Cast LIKE ? 
//     ORDER BY CTID DESC
//   `;

//   db.query(sql,  (err, result) => {
//     if (err) {
//       console.error("Error fetching Casts:", err);
//       return res.status(500).json({ message: "Database error" });
//     }
//     res.status(200).json(result);
//   });
// };

// ✅ Add new Cast
exports.addCast = (req, res) => {
  const { Cast } = req.body;

  if (!Cast) {
    return res.status(400).json({ message: "Cast name is required" });
  }

  // Check duplicate
  const checkSql = "SELECT * FROM mst_cast WHERE Cast = ?";
  db.query(checkSql, [Cast], (err, result) => {
    if (err) {
      console.error("Error checking duplicate Cast:", err);
      return res.status(500).json({ message: "Database error" });
    }
    if (result.length > 0) {
      return res.status(409).json({ message: "Cast already exists" });
    }

    const insertSql = "INSERT INTO mst_cast (Cast, status) VALUES (?, 1)";
    db.query(insertSql, [Cast], (err) => {
      if (err) {
        console.error("Error inserting Cast:", err);
        return res.status(500).json({ message: "Database error" });
      }
      res.status(200).json({ message: "Cast added successfully" });
    });
  });
};

// ✅ Update Cast
exports.updateCast = (req, res) => {
  const { id } = req.params;
  const { Cast } = req.body;

  if (!Cast) {
    return res.status(400).json({ message: "Cast name is required" });
  }

  // Check duplicate (excluding current ID)
  const checkSql = "SELECT * FROM mst_cast WHERE Cast = ? AND CTID <> ?";
  db.query(checkSql, [Cast, id], (err, result) => {
    if (err) {
      console.error("Error checking duplicate Cast:", err);
      return res.status(500).json({ message: "Database error" });
    }
    if (result.length > 0) {
      return res.status(409).json({ message: "Cast already exists" });
    }

    const updateSql = "UPDATE mst_cast SET Cast = ? WHERE CTID = ?";
    db.query(updateSql, [Cast, id], (err) => {
      if (err) {
        console.error("Error updating Cast:", err);
        return res.status(500).json({ message: "Database error" });
      }
      res.status(200).json({ message: "Cast updated successfully" });
    });
  });
};

// ✅ Delete Cast
exports.deleteCast = (req, res) => {
  const { id } = req.params;

  const deleteSql = "DELETE FROM mst_cast WHERE CTID = ?";
  db.query(deleteSql, [id], (err) => {
    if (err) {
      console.error("Error deleting Cast:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.status(200).json({ message: "Cast deleted successfully" });
  });
};
