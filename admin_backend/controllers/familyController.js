// backend/controllers/familyController.js
const db = require("../db");

// Helper: accept both "txtFather" or "Father" etc.
const value = (body, keys, fallback = "") => {
  for (const k of keys) if (body[k] !== undefined) return body[k];
  return fallback;
};

const alphaOnly = /^[A-Za-z\s]+$/;
exports.getUserById = (req, res) => {
  const UID = req.params.UID;
  db.query("SELECT UID, uname FROM mst_users WHERE UID = ?", [UID], (err, rows) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (!rows || rows.length === 0) return res.status(404).json({ message: "User not found" });
    res.json(rows[0]);
  });
};
exports.createFamily = (req, res) => {
  const body = req.body;

  const UID = value(body, ["UID", "uid", "txtuser"]);
  const Father = value(body, ["txtFather", "Father"]);
  const Mother = value(body, ["txtMother", "Mother"]);
  const Brother = value(body, ["txtBrother", "Brother"]);
  const Sister = value(body, ["txtSitser", "Sister"]);
  const father_occupation = value(body, ["txtFOccupation", "father_occupation"]);
  const mother_occupation = value(body, ["txtMOccupation", "mother_occupation"]);
  const brother_occupation = value(body, ["txtBOccupation", "brother_occupation"]);
  const property_details = value(body, ["txtProperty", "property_details"]);
  const other_details = value(body, ["txtOtherDetails", "other_details"]);

  if (!UID) {
    return res.status(400).json({ message: "UID missing — please fill basic user info first." });
  }

  // Step 1: Verify UID exists in mst_users
  db.query("SELECT UID, uname FROM mst_users WHERE UID = ?", [UID], (err, users) => {
    if (err) return res.status(500).json({ message: "Database error (check UID)" });
    if (!users || users.length === 0) {
      return res.status(400).json({ message: "User not found. Fill basic user info first." });
    }

    // Step 2: Check if family info already exists for this UID
    db.query("SELECT FID FROM mst_family WHERE UID = ?", [UID], (err, existing) => {
      if (err) return res.status(500).json({ message: "Database error while checking existing family" });
      if (existing && existing.length > 0) {
        return res.status(400).json({ message: "Family info for this user already exists." });
      }

      // Step 3: Validate input
      if (!alphaOnly.test(Father || "") || !alphaOnly.test(Mother || "") || !alphaOnly.test(father_occupation || "")) {
        return res.status(400).json({
          message: "Father, Mother and Father Occupation must contain only letters and spaces.",
        });
      }

      // Step 4: Insert new record
      const sql = `INSERT INTO mst_family
        (UID, Father, Mother, Brother, Sister, father_occupation, mother_occupation, brother_occupation, property_details, other_details)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      const params = [
        UID,
        Father,
        Mother,
        Brother,
        Sister,
        father_occupation,
        mother_occupation,
        brother_occupation,
        property_details,
        other_details,
      ];

      db.query(sql, params, (err, result) => {
        if (err) {
          console.error("Insert error:", err);
          return res.status(500).json({ message: "Database insert error" });
        }
        res.json({ message: "Family info added successfully", insertedId: result.insertId });
      });
    });
  });
};


// ✅ backend/controllers/familyController.js


exports.getAllFamilies = (req, res) => {
  let page = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 10;
  let offset = (page - 1) * limit;
  const search = req.query.search ? req.query.search.trim() : "";

  // ✅ Dynamic WHERE clause for UID search
  let whereClause = "";
  let params = [];

   if (search) {
    whereClause = "WHERE f.UID = ?";
    params.push(search);
  }

  // Count total records for pagination info
  const countSql = `SELECT COUNT(*) AS total FROM mst_family f ${whereClause}`;

  db.query(countSql, params, (err, countResult) => {
    if (err) return res.status(500).json({ message: "Database error (count)" });

    const totalRecords = countResult[0].total;
    const totalPages = Math.ceil(totalRecords / limit);

    // Fetch only paginated records with JOIN
    const sql = `
      SELECT f.*, u.uname, u.UID
      FROM mst_family f
      LEFT JOIN mst_users u ON f.UID = u.UID
      ${whereClause}
      ORDER BY f.FID DESC
      LIMIT ? OFFSET ?
    `;

    db.query(sql, [...params, limit, offset], (err, rows) => {
      if (err) return res.status(500).json({ message: "Database error (fetch)" });
      res.json({
        data: rows,
        pagination: {
          currentPage: page,
          totalPages,
          totalRecords,
          perPage: limit,
        },
      });
    });
  });
};



// exports.getAllFamilies = (req, res) => {
//   let page = parseInt(req.query.page) || 1;
//   let limit = parseInt(req.query.limit) || 10;
//   let offset = (page - 1) * limit;

//   // Count total records for pagination info
//   const countSql = "SELECT COUNT(*) AS total FROM mst_family";

//   db.query(countSql, (err, countResult) => {
//     if (err) return res.status(500).json({ message: "Database error (count)" });

//     const totalRecords = countResult[0].total;
//     const totalPages = Math.ceil(totalRecords / limit);

//     // Fetch only paginated records with JOIN
//     const sql = `
//       SELECT f.*, u.uname, u.UID
//       FROM mst_family f
//       LEFT JOIN mst_users u ON f.UID = u.UID
//       ORDER BY f.FID DESC
//       LIMIT ? OFFSET ?
//     `;

//     db.query(sql, [limit, offset], (err, rows) => {
//       if (err) return res.status(500).json({ message: "Database error (fetch)" });
//       res.json({
//         data: rows,
//         pagination: {
//           currentPage: page,
//           totalPages,
//           totalRecords,
//           perPage: limit,
//         },
//       });
//     });
//   });
// };

exports.getFamilyByUID = (req, res) => {
  const UID = req.params.UID;
  const sql = `SELECT f.*, u.uname,u.UID
               FROM mst_family f
               LEFT JOIN mst_users u ON f.UID = u.UID
               WHERE f.UID = ?`;
  db.query(sql, [UID], (err, rows) => {
    if (err) return res.status(500).json({ message: "Database error" });
    // If more than one record exists, return array; if single, return single object
    if (!rows || rows.length === 0) return res.json({});
    res.json(rows[0]);
  });
};

exports.getFamilyByFID = (req, res) => {
  const FID = req.params.FID;
  const sql = `SELECT f.*, u.uname
               FROM mst_family f
               LEFT JOIN mst_users u ON f.UID = u.UID
               WHERE f.FID = ?`;
  db.query(sql, [FID], (err, rows) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (!rows || rows.length === 0) return res.status(404).json({ message: "Not found" });
    res.json(rows[0]);
  });
};

exports.updateFamily = (req, res) => {
  const FID = req.params.FID || req.body.FID;
  const body = req.body;

  const Father = value(body, ["txtFather", "Father"]);
  const Mother = value(body, ["txtMother", "Mother"]);
  const Brother = value(body, ["txtBrother", "Brother"]);
  const Sister = value(body, ["txtSitser", "Sister"]);
  const father_occupation = value(body, ["txtFOccupation", "father_occupation"]);
  const mother_occupation = value(body, ["txtMOccupation", "mother_occupation"]);
  const brother_occupation = value(body, ["txtBOccupation", "brother_occupation"]);
  const property_details = value(body, ["txtProperty", "property_details"]);
  const other_details = value(body, ["txtOtherDetails", "other_details"]);

  if (!FID) return res.status(400).json({ message: "FID required for update" });

  if (!alphaOnly.test(Father || "") || !alphaOnly.test(Mother || "") || !alphaOnly.test(father_occupation || "")) {
    return res.status(400).json({ message: "Father, Mother and Father Occupation must contain only letters and spaces." });
  }

  const sql = `UPDATE mst_family SET Father=?, Mother=?, Brother=?, Sister=?, father_occupation=?, mother_occupation=?, brother_occupation=?, property_details=?, other_details=? WHERE FID=?`;
  const params = [Father, Mother, Brother, Sister, father_occupation, mother_occupation, brother_occupation, property_details, other_details, FID];

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error("Update error:", err);
      return res.status(500).json({ message: "Database update error" });
    }
    res.json({ message: "Family info updated successfully" });
  });
};

exports.deleteFamily = (req, res) => {
  const FID = req.params.FID;
  if (!FID) return res.status(400).json({ message: "FID required" });

  db.query("DELETE FROM mst_family WHERE FID = ?", [FID], (err, result) => {
    if (err) return res.status(500).json({ message: "Database delete error" });
    res.json({ message: "Family record deleted" });
  });
};
