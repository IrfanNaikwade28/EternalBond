const db = require("../db");

// ✅ GET Education & Work info by UID
exports.getEducationWorkByUserId = (req, res) => {
  const userId = req.params.userId;

  const query = `
    SELECT 
      u.UID,
      u.EDID,
      e.Education AS education_name,
      u.CNID,
      c.Country AS country_name,
      u.STID,
      s.State AS state_name,
      u.DSID,
      d.District AS district_name,
      u.INID,
      u.fincome,
      u.current_work,
      u.education_details
    FROM mst_users u
    LEFT JOIN mst_education e ON u.EDID = e.EDID
    LEFT JOIN mst_country c ON u.CNID = c.CNID
    LEFT JOIN mst_state s ON u.STID = s.STID
    LEFT JOIN mst_district d ON u.DSID = d.DSID
    WHERE u.UID = ?
    LIMIT 1
  `;

  db.query(query, [userId], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No education & work record found for this UID",
      });
    }

    res.json({
      success: true,
      data: result[0],
    });
  });
};


// ✅ GET all users' Education & Work info (Paginated + Search by UID)
exports.getAllEducationWork = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  const searchUID = req.query.uid || ""; // 👈 if UID search provided

  let filter = "";
  const params = [];

  // If UID provided → filter
  if (searchUID) {
    filter = "WHERE u.UID = ?";
    params.push(searchUID);
  }

  const query = `
    SELECT 
      u.UID,
      u.EDID,
      e.Education AS education_name,
      u.CNID,
      c.Country AS country_name,
      u.STID,
      s.State AS state_name,
      u.DSID,
      d.District AS district_name,
      u.INID,
      u.fincome,
      u.current_work,
      u.education_details
    FROM mst_users u
    LEFT JOIN mst_education e ON u.EDID = e.EDID
    LEFT JOIN mst_country c ON u.CNID = c.CNID
    LEFT JOIN mst_state s ON u.STID = s.STID
    LEFT JOIN mst_district d ON u.DSID = d.DSID
    ${filter}
    ORDER BY u.UID DESC
    LIMIT ? OFFSET ?;
  `;

  // Add pagination params
  params.push(limit, offset);

  // Count query for pagination
  const countQuery = `
    SELECT COUNT(*) AS total FROM mst_users u 
    ${filter ? filter : ""}
  `;

  db.query(countQuery, searchUID ? [searchUID] : [], (err, countResult) => {
    if (err) return res.status(500).json({ message: err.message });

    const total = countResult[0].total;

    db.query(query, params, (err2, results) => {
      if (err2) return res.status(500).json({ message: err2.message });

      const totalPages = Math.ceil(total / limit);
      res.json({
        success: true,
        currentPage: page,
        totalPages,
        totalRecords: total,
        perPage: limit,
        data: results,
      });
    });
  });
};





// ✅ GET all users' Education & Work info (Descending by UID)
// exports.getAllEducationWork = (req, res) => {
//   // 📦 Step 1: Get query params or set defaults
//   const page = parseInt(req.query.page) || 1; // current page number
//   const limit = parseInt(req.query.limit) || 10; // records per page (default 10)
//   const offset = (page - 1) * limit;

//   // 📦 Step 2: Main query with JOINs
//   const query = `
//     SELECT 
//       u.UID,
//       u.EDID,
//       e.Education AS education_name,
//       u.CNID,
//       c.Country AS country_name,
//       u.STID,
//       s.State AS state_name,
//       u.DSID,
//       d.District AS district_name,
//       u.INID,
//       u.fincome,
//       u.current_work,
//       u.education_details
//     FROM mst_users u
//     LEFT JOIN mst_education e ON u.EDID = e.EDID
//     LEFT JOIN mst_country c ON u.CNID = c.CNID
//     LEFT JOIN mst_state s ON u.STID = s.STID
//     LEFT JOIN mst_district d ON u.DSID = d.DSID
//     ORDER BY u.UID DESC
//     LIMIT ? OFFSET ?;
//   `;

//   // 📦 Step 3: Count total records for pagination info
//   const countQuery = `
//     SELECT COUNT(*) AS total FROM mst_users 
//     WHERE EDID IS NOT NULL OR CNID IS NOT NULL OR fincome IS NOT NULL;
//   `;

//   db.query(countQuery, (err, countResult) => {
//     if (err) return res.status(500).json({ message: err.message });

//     const total = countResult[0].total;

//     // Fetch paginated data
//     db.query(query, [limit, offset], (err2, results) => {
//       if (err2) return res.status(500).json({ message: err2.message });

//       const totalPages = Math.ceil(total / limit);
//       res.json({
//         success: true,
//         currentPage: page,
//         totalPages,
//         totalRecords: total,
//         perPage: limit,
//         data: results,
//       });
//     });
//   });
// };




// ✅ POST – Insert Education & Work data into existing UID record
exports.createEducationWork = (req, res) => {
  const userId = req.params.userId;
  const {
    EDID,
    CNID,
    STID,
    DSID,
    INID,
    fincome,
    current_work,
    education_details,
  } = req.body;

  // 🧩 Step 1: Validate required fields
  if (!EDID || !CNID || !STID || !DSID || !INID || !fincome) {
    return res.status(400).json({
      success: false,
      message: "⚠️ Please fill all required fields before submission.",
    });
  }

  // 🧩 Step 2: Check if user exists
  const checkQuery = "SELECT UID, EDID, CNID, STID, DSID, INID, fincome FROM mst_users WHERE UID = ?";
  db.query(checkQuery, [userId], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });

    // 🟠 If no user found → cannot insert
    if (result.length === 0) {
      return res.status(404).json({ success: false, message: "❌ User not found for given UID!" });
    }

    const user = result[0];

    // 🟡 Check if all education fields are already filled
    const hasExistingData =
      user.EDID && user.CNID && user.STID && user.DSID && user.INID && user.fincome;

    if (hasExistingData) {
      // Stop duplicate update
      return res.status(400).json({
        success: false,
        message: "⚠️ Record for this UID already exists with Education & Work Info!",
      });
    }

    // 🟢 Otherwise → Update the record
    const updateQuery = `
      UPDATE mst_users 
      SET EDID=?, CNID=?, STID=?, DSID=?, INID=?, fincome=?, current_work=?, education_details=? 
      WHERE UID=?;
    `;
    const values = [EDID, CNID, STID, DSID, INID, fincome, current_work, education_details, userId];

    db.query(updateQuery, values, (err2, result2) => {
      if (err2) return res.status(500).json({ message: err2.message });

      if (result2.affectedRows === 0)
        return res.status(404).json({ success: false, message: "User not found for update." });

      res.json({ success: true, message: "✅ Education & Work Info saved successfully!" });
    });
  });
};



// ✅ PUT – Update existing record (same as POST, just semantic difference)
// ✅ UPDATE Education & Work Info by UID
exports.updateEducationWork = (req, res) => {
  const UID = req.params.uid; // rename param
  console.log("UPDATE UID Received:", UID);
console.log("UPDATE Body:", req.body);
  const {
    EDID, education_details, CNID, STID, DSID,
    INID, fincome, current_work
  } = req.body;

  const query = `
    UPDATE mst_users 
    SET EDID=?, education_details=?, CNID=?, STID=?, DSID=?, 
        INID=?, fincome=?, current_work=? 
    WHERE UID=?`;

  db.query(query, [
    EDID, education_details, CNID, STID, DSID,
    INID, fincome, current_work, UID
  ], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: err.message });

    if (result.affectedRows === 0)
      return res.status(404).json({ success: false, message: "Record not found" });

    res.json({ success: true, message: "Record updated successfully" });
  });
};


// ✅ DELETE – Clear Education & Work info (don’t delete user)
exports.deleteEducationWork = (req, res) => {
  const userId = req.params.userId;
  console.log("DELETE UID Received:", userId);

  const query = "DELETE FROM mst_users WHERE UID=?";
  db.query(query, [userId], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "⚠️ User not found for given UID" });

    res.json({ success: true, message: "🗑️ Record deleted successfully" });
  });
};

