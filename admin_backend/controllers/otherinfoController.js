const db = require("../db");

// ✅ Get One Record By UID
exports.getOneByUser = (req, res) => {
  const { UID } = req.params;

  const sql = `
    SELECT 
      o.OID,
      o.UID,
      o.RSID,
      r.Ras AS RashiName,
      o.NKID,
      nk.Nakshtra AS NakshtraName,
      o.NDID,
      n.Nadi AS NadiName,
      o.managal,
      o.charan
    FROM mst_otherinfo o
    LEFT JOIN mst_rashi r ON o.RSID = r.RSID
    LEFT JOIN mst_nakshtra nk ON o.NKID = nk.NKID
    LEFT JOIN mst_nadi n ON o.NDID = n.NDID
    WHERE o.UID = ?
    LIMIT 1
  `;

  db.query(sql, [UID], (err, result) => {
    if (err)
      return res.status(500).json({
        message: "Error fetching record",
        error: err,
      });

    if (result.length === 0)
      return res.status(404).json({
        message: "No record found for this UID",
        data: null,
      });

    res.json({ data: result[0] });
  });
};


// ✅ Get all records with pagination + UID search
exports.getAllByUser = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  const search = req.query.search || "";

  // If UID provided, add filter
  let whereClause = "";
  let params = [];

  if (search) {
    whereClause = "WHERE o.UID = ?";
    params.push(search);
  }

  const countSql = `SELECT COUNT(*) AS total FROM mst_otherinfo o ${whereClause}`;

  db.query(countSql, params, (countErr, countResult) => {
    if (countErr)
      return res.status(500).json({ message: "Count fetch error", error: countErr });

    const total = countResult[0].total;

    const sql = `
      SELECT 
        o.OID,
        o.UID,
        o.RSID,
        r.Ras AS RashiName,
        o.NKID,
        nk.Nakshtra AS NakshtraName,
        o.NDID,
        n.Nadi AS NadiName,
        o.managal,
        o.charan
      FROM mst_otherinfo o
      LEFT JOIN mst_rashi r ON o.RSID = r.RSID
      LEFT JOIN mst_nakshtra nk ON o.NKID = nk.NKID
      LEFT JOIN mst_nadi n ON o.NDID = n.NDID
      ${whereClause}
      ORDER BY o.UID DESC
      LIMIT ? OFFSET ?
    `;

    db.query(sql, [...params, limit, offset], (err, result) => {
      if (err)
        return res.status(500).json({ message: "Error fetching user data", error: err });

      res.json({
        data: result,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      });
    });
  });
};

// ✅ Get all records with pagination (recent 10)
// exports.getAllByUser = (req, res) => {
//   const page = parseInt(req.query.page) || 1;
//   const limit = parseInt(req.query.limit) || 10;
//   const offset = (page - 1) * limit;

//   const countSql = `SELECT COUNT(*) AS total FROM mst_otherinfo`;

//   db.query(countSql, (countErr, countResult) => {
//     if (countErr)
//       return res.status(500).json({ message: "Count fetch error", error: countErr });

//     const total = countResult[0].total;

//     const sql = `
//       SELECT 
//         o.OID,
//         o.UID,
//         o.RSID,
//         r.Ras AS RashiName,
//         o.NKID,
//         nk.Nakshtra AS NakshtraName,
//         o.NDID,
//         n.Nadi AS NadiName,
//         o.managal,
//         o.charan
//       FROM mst_otherinfo o
//       LEFT JOIN mst_rashi r ON o.RSID = r.RSID
//       LEFT JOIN mst_nakshtra nk ON o.NKID = nk.NKID
//       LEFT JOIN mst_nadi n ON o.NDID = n.NDID
//       ORDER BY o.OID DESC
//       LIMIT ? OFFSET ?
//     `;

//     db.query(sql, [limit, offset], (err, result) => {
//       if (err)
//         return res.status(500).json({ message: "Error fetching user data", error: err });

//       res.json({
//         data: result,
//         total,
//         page,
//         totalPages: Math.ceil(total / limit),
//       });
//     });
//   });
// };




// ✅ Get all records by user
// ✅ Get all records with names joined
// exports.getAllByUser = (req, res) => {
//   //const { UID } = req.params;

//   const sql = `
//     SELECT 
//       o.OID,
//       o.UID,
//       o.RSID,
//       r.Ras AS RashiName,
//       o.NKID,
//       nk.Nakshtra AS NakshtraName,
//       o.NDID,
//       n.Nadi AS NadiName,
//       o.managal,
//       o.charan
//     FROM mst_otherinfo o
//     LEFT JOIN mst_rashi r ON o.RSID = r.RSID
//     LEFT JOIN mst_nakshtra nk ON o.NKID = nk.NKID
//     LEFT JOIN mst_nadi n ON o.NDID = n.NDID
    
//     ORDER BY o.OID DESC
//   `;

//   db.query(sql, (err, result) => {
//     if (err) return res.status(500).json({ message: "Error fetching user data", error: err });
//     res.json(result);
//   });
// };


// ✅ Insert (per user)
exports.insertOtherInfo = (req, res) => {
  const { UID, RSID, NKID, NDID, managal, charan } = req.body;

  // Validate required fields
  if (!UID || !RSID || !NKID || !NDID || !managal || !charan)
    return res.status(400).json({ message: "⚠️ All fields are required" });

  // Step 1: Check if record already exists for this UID
  const checkSql = "SELECT OID FROM mst_otherinfo WHERE UID = ?";
  db.query(checkSql, [UID], (err, rows) => {
    if (err)
      return res
        .status(500)
        .json({ message: "Error checking existing record", error: err });

    if (rows.length > 0) {
      return res.status(400).json({
        message: "Record already exists for this user. Only one record allowed.",
      });
    }

    // Step 2: If not found, insert new record
    const insertSql = `
      INSERT INTO mst_otherinfo (UID, RSID, NKID, NDID, managal, charan)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.query(insertSql, [UID, RSID, NKID, NDID, managal, charan], (err2) => {
      if (err2)
        return res
          .status(500)
          .json({ message: "Error inserting record", error: err2 });

      res.json({ message: "✅ Record inserted successfully" });
    });
  });
};



// ✅ Update record (belonging to user)
exports.updateOtherInfo = (req, res) => {
  const { OID } = req.params;
  const { UID, RSID, NKID, NDID, managal, charan } = req.body;

  const sql = `
    UPDATE mst_otherinfo
    SET RSID=?, NKID=?, NDID=?, managal=?, charan=?
    WHERE OID=? AND UID=?`;
  db.query(sql, [RSID, NKID, NDID, managal, charan, OID, UID], (err, result) => {
    if (err) return res.status(500).json({ message: "Error updating record", error: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Record not found or not yours" });
    res.json({ message: "✅ Record updated successfully" });
  });
};

// ✅ Delete (only if record belongs to user)
exports.deleteOtherInfo = (req, res) => {
  const { OID } = req.params;
  const sql = "DELETE FROM mst_otherinfo WHERE OID=?";
  db.query(sql, [OID], (err, result) => {
    if (err) return res.status(500).json({ message: "Error deleting record", error: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Record not found" });
    res.json({ message: "🗑️ Record deleted successfully" });
  });
};
