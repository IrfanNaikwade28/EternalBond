const db = require("../db");
// 🟡 GET user details by UID
exports.getUserDetailsByUID = (req, res) => {
  const userId = req.params.userId;

  const query = `
    SELECT 
      u.UID,
      u.CTID,
      u.SCTID,
      c.Cast AS cast_name,
      s.Subcast AS subcast_name,
      u.height,
      u.weight,
      u.varn,
      u.birthplace,
      u.DOB,
      u.dob_time,
      u.marriage_type,
      u.bloodgroup,
      u.Expectation
    FROM mst_users u
    LEFT JOIN mst_cast c ON u.CTID = c.CTID
    LEFT JOIN mst_subcast s ON u.SCTID = s.SCTID
    WHERE u.UID = ?
  `;

  db.query(query, [userId], (err, rows) => {
    if (err) return res.status(500).json({ message: "DB error", error: err });

    if (rows.length === 0) {
      return res.status(404).json({ message: "❌ User not found" });
    }

    res.json(rows[0]);
  });
};


// exports.createUserDetails = (req, res) => {
//   const userId = req.params.userId;
//   const {
//     CTID,
//     SCTID,
//     weight,
//     height,
//     varn,
//     birthplace,
//     DOB,
//     dob_time,
//     marriage_type,
//     bloodgroup,
//     Expectation,
//   } = req.body;

//   // ✅ Basic validation (only check if all are missing in request)
//   if (!CTID && !SCTID && !birthplace && !dob_time) {
//     return res.status(400).json({ message: "❌ Required fields missing in request" });
//   }

//   // 🔍 Step 1: Check if user already exists
//   db.query("SELECT * FROM mst_users WHERE UID = ?", [userId], (err, rows) => {
//     if (err) return res.status(500).json({ message: "DB error", error: err });

//     if (rows.length > 0) {
//       const existing = rows[0];

//       // ✅ Step 2: Check if required fields are already filled (not null, not empty, not 0)
//       const hasRequiredData =
//         (existing.CTID && existing.CTID !== "0") &&
//         (existing.SCTID && existing.SCTID !== "0") &&
//         (existing.birthplace && existing.birthplace.trim() !== "") &&
//         (existing.dob_time && existing.dob_time.trim() !== "");

//       if (hasRequiredData) {
//         return res
//           .status(400)
//           .json({ message: "⚠️ User details for this user already exist" });
//       }
//     }

//     // 🟢 Step 3: Insert data if record is new or fields are blank/null/0
//     const insertQuery = `
//       INSERT INTO mst_users 
//       (UID, CTID, SCTID, weight, height, varn, birthplace, DOB, dob_time, marriage_type, bloodgroup, Expectation)
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//     `;

//     const values = [
//       userId,
//       CTID || null,
//       SCTID || null,
//       weight || null,
//       height || null,
//       varn || null,
//       birthplace || null,
//       DOB || null,
//       dob_time || null,
//       marriage_type || null,
//       bloodgroup || null,
//       Expectation || null,
//     ];

//     db.query(insertQuery, values, (err2) => {
//       if (err2) {
//         // ⚠️ Handle duplicate UID issue gracefully
//         if (err2.code === "ER_DUP_ENTRY") {
//           return res
//             .status(400)
//             .json({ message: "⚠️ Duplicate UID — record already exists" });
//         }
//         return res.status(500).json({ message: "Insert failed", error: err2 });
//       }

//       res.json({ success: true, message: "✅ User details added successfully" });
//     });
//   });
// };


// 🟢 CREATE or UPDATE user details by userId
exports.createUserDetails = (req, res) => {
  const userId = req.params.userId;
  const {
    CTID,
    SCTID,
    weight,
    height,
    varn,
    birthplace,
    DOB,
    dob_time,
    marriage_type,
    bloodgroup,
    Expectation,
  } = req.body;

  // ✅ Required field validation
  if (!CTID || !SCTID || !birthplace || !dob_time) {
    return res.status(400).json({ message: "❌ Required fields missing" });
  }

  // 🔍 Check if user exists
  db.query("SELECT * FROM mst_users WHERE UID = ?", [userId], (err, rows) => {
    if (err) return res.status(500).json({ message: "DB error", error: err });

    // If user record exists
    if (rows.length > 0) {
      const existing = rows[0];

      const hasRequiredData =
        (existing.CTID && existing.CTID !== 0) &&
        (existing.SCTID && existing.SCTID !== 0) &&
        (existing.birthplace && existing.birthplace.trim() !== "") &&
        (existing.dob_time && existing.dob_time.trim() !== "");

      if (hasRequiredData) {
        return res.status(400).json({
          message: "⚠️ User Details for this user already exist",
        });
      }

      // 🟢 User exists but fields are blank → UPDATE instead of insert
      const updateQuery = `
        UPDATE mst_users
        SET CTID=?, SCTID=?, weight=?, height=?, varn=?, birthplace=?, DOB=?, dob_time=?, marriage_type=?, bloodgroup=?, Expectation=?
        WHERE UID=?
      `;

      const updateValues = [
        CTID,
        SCTID,
        weight,
        height,
        varn,
        birthplace,
        DOB,
        dob_time,
        marriage_type,
        bloodgroup,
        Expectation,
        userId,
      ];

      db.query(updateQuery, updateValues, (err2) => {
        if (err2)
          return res.status(500).json({ message: "Update failed", error: err2 });

        return res.json({
          success: true,
          message: "✅ User details inserted successfully",
        });
      });
    } 
    // else {
    //   // 🟢 User does not exist → Insert new record
    //   const insertQuery = `
    //     INSERT INTO mst_users 
    //     (UID, CTID, SCTID, weight, height, varn, birthplace, DOB, dob_time, marriage_type, bloodgroup, Expectation)
    //     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    //   `;

    //   const values = [
    //     userId,
    //     CTID,
    //     SCTID,
    //     weight,
    //     height,
    //     varn,
    //     birthplace,
    //     DOB,
    //     dob_time,
    //     marriage_type,
    //     bloodgroup,
    //     Expectation,
    //   ];

    //   db.query(insertQuery, values, (err3) => {
    //     if (err3)
    //       return res.status(500).json({ message: "Insert failed", error: err3 });

    //     res.json({
    //       success: true,
    //       message: "✅ User details added successfully",
    //     });
    //   });
    // }
  });
};

// 🟡 UPDATE user details
exports.updateUserDetails = (req, res) => {
  const userId = req.params.userId;

  const data = req.body;

  // Validate required fields
  if (!data.CTID || !data.SCTID || !data.birthplace || !data.dob_time) {
    return res.status(400).json({ message: "Required fields missing" });
  }

  db.query("SELECT UID FROM mst_users WHERE UID = ?", [userId], (err, rows) => {
    if (err) return res.status(500).json({ message: "DB error", error: err });

    if (rows.length === 0) {
      return res.status(404).json({ message: "❌ User not found" });
    }

    db.query("UPDATE mst_users SET ? WHERE UID = ?", [data, userId], (err2) => {
      if (err2)
        return res.status(500).json({ message: "Update failed", error: err2 });
      res.json({ success: true, message: "✅ User details updated successfully" });
    });
  });
};

// 🟡 READ user details
// exports.getUserDetails = (req, res) => {
//   const userId = req.params.userId;
//   db.query(
//     `
//     SELECT 
//       u.*, 
//       c.Cast AS cast_name,
//       s.Subcast AS subcast_name
//     FROM mst_users u
//     LEFT JOIN mst_cast c ON u.CTID = c.CTID
//     LEFT JOIN mst_subcast s ON u.SCTID = s.SCTID
//     WHERE u.UID = ?
//   `,
//     [userId],
//     (err, rows) => {
//       if (err) return res.status(500).json({ message: "DB error" });
//       res.json(rows[0] || {});
//     }
//   );
// };

// 🔴 DELETE user details
exports.deleteUserDetails = (req, res) => {
  const userId = req.params.userId;
  db.query("DELETE FROM mst_users WHERE UID = ?", [userId], (err) => {
    if (err) return res.status(500).json({ message: "Delete failed" });
    res.json({ success: true, message: "✅ User deleted successfully" });
  });
};

// 🟣 GET ALL users (Paginated)
exports.getAllUsers = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  const search = req.query.search ? req.query.search.trim() : "";

  let whereClause = "";
  let params = [limit, offset];

  if (search) {
    whereClause = "WHERE u.UID LIKE ?";
    params = [`${search}`, limit, offset];
  }

  const query = `
    SELECT 
      u.UID,
      u.CTID,
      u.SCTID,
      c.Cast AS cast_name,
      s.Subcast AS subcast_name,
      u.height,
      u.weight,
      u.varn,
      u.birthplace,
      u.DOB,
      u.dob_time,
      u.marriage_type,
      u.bloodgroup,
      u.Expectation
    FROM mst_users u
    LEFT JOIN mst_cast c ON u.CTID = c.CTID
    LEFT JOIN mst_subcast s ON u.SCTID = s.SCTID
    ${whereClause}
    ORDER BY u.UID DESC
    LIMIT ? OFFSET ?
  `;

  const countQuery = `
    SELECT COUNT(*) AS total FROM mst_users u ${whereClause}
  `;

  db.query(countQuery, search ? [`%${search}%`] : [], (err, countResult) => {
    if (err) return res.status(500).json({ message: "Count fetch failed", error: err });
    const total = countResult[0].total;

    db.query(query, params, (err2, rows) => {
      if (err2) return res.status(500).json({ message: "Fetch failed", error: err2 });

      res.json({
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        users: rows,
      });
    });
  });
};

// 🟣 SEARCH users by UID (and optionally mobile)
exports.searchUsers = (req, res) => {
  const search = req.query.q || "";
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const likeQuery = `%${search}%`;

  const query = `
    SELECT 
      u.UID,
      u.CTID,
      u.SCTID,
      c.Cast AS cast_name,
      s.Subcast AS subcast_name,
      u.height,
      u.weight,
      u.varn,
      u.birthplace,
      u.DOB,
      u.dob_time,
      u.marriage_type,
      u.bloodgroup,
      u.Expectation
    FROM mst_users u
    LEFT JOIN mst_cast c ON u.CTID = c.CTID
    LEFT JOIN mst_subcast s ON u.SCTID = s.SCTID
    WHERE u.UID LIKE ? OR u.mobile LIKE ?
    ORDER BY u.UID DESC
    LIMIT ? OFFSET ?
  `;

  const countQuery = `
    SELECT COUNT(*) AS total FROM mst_users
    WHERE UID LIKE ? OR mobile LIKE ?
  `;

  db.query(countQuery, [likeQuery, likeQuery], (err, countResult) => {
    if (err) return res.status(500).json({ message: "Count fetch failed", error: err });
    const total = countResult[0].total;

    db.query(query, [likeQuery, likeQuery, limit, offset], (err2, rows) => {
      if (err2) return res.status(500).json({ message: "Fetch failed", error: err2 });

      res.json({
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        users: rows,
      });
    });
  });
};
