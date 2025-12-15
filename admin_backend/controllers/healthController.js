const db = require("../db");

// 🟢 GET all records with optional search and pagination
exports.getAllHealth = (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;
  const offset = (page - 1) * limit;
  const searchUID = req.query.searchUID || "";

  let sql = `
    SELECT UID, specs, Diet, Drink, Smoking, Dieses 
    FROM mst_users 
  `;
  let countSql = "SELECT COUNT(*) AS total FROM mst_users";
  let params = [];

  if (searchUID) {
    sql += " WHERE UID LIKE ?";
    countSql += " WHERE UID LIKE ?";
    params.push(`%${searchUID}%`);
  }

  sql += " ORDER BY UID DESC LIMIT ? OFFSET ?";
  params.push(limit, offset);

  db.query(sql, params, (err, result) => {
    if (err) return res.status(500).json({ message: "Error fetching data", error: err });

    db.query(countSql, searchUID ? [`%${searchUID}%`] : [], (err2, countResult) => {
      if (err2) return res.status(500).json({ message: "Error counting records", error: err2 });

      const totalRecords = countResult[0].total;
      const totalPages = Math.ceil(totalRecords / limit);

      res.json({
        data: result,
        pagination: {
          totalRecords,
          totalPages,
          currentPage: page,
        },
      });
    });
  });
};






// exports.getAllHealth = (req, res) => {
//   const limit = parseInt(req.query.limit) || 10; // default 10 records per page
//   const page = parseInt(req.query.page) || 1;
//   const offset = (page - 1) * limit;

//   const sql = `
//     SELECT UID, specs, Diet, Drink, Smoking, Dieses 
//     FROM mst_users 
//     ORDER BY UID DESC 
//     LIMIT ? OFFSET ?;
//   `;

//   const countSql = "SELECT COUNT(*) AS total FROM mst_users";

//   db.query(sql, [limit, offset], (err, result) => {
//     if (err)
//       return res.status(500).json({ message: "Error fetching data", error: err });

//     // Get total count for frontend pagination
//     db.query(countSql, (err2, countResult) => {
//       if (err2)
//         return res.status(500).json({ message: "Error counting records", error: err2 });

//       const totalRecords = countResult[0].total;
//       const totalPages = Math.ceil(totalRecords / limit);

//       res.json({
//         data: result,
//         pagination: {
//           totalRecords,
//           totalPages,
//           currentPage: page,
//         },
//       });
//     });
//   });
// };


// 🟢 GET record by UID
exports.getHealthById = (req, res) => {
  const { UID } = req.params;
  const sql = "SELECT UID, specs, Diet, Drink, Smoking, Dieses FROM mst_users WHERE UID = ?";
  db.query(sql, [UID], (err, result) => {
    if (err)
      return res.status(500).json({ message: "Error fetching record", error: err });
    if (result.length === 0)
      return res.status(404).json({ message: "No record found" });
    res.json(result[0]);
  });
};

// 🟢 INSERT record based on UID (prevent duplicate)
exports.insertHealth = (req, res) => {
  const { UID, specs, Diet, Drink, Smoking, Dieses } = req.body;

  if (!UID) {
    return res.status(400).json({ message: "⚠️ UID (userId) is required." });
  }

  // 🧩 Step 1: Validate required fields
  if (!specs || !Diet || !Drink || !Smoking || !Dieses) {
    return res.status(400).json({
      success: false,
      message: "⚠️ Please fill all required fields before submitting.",
    });
  }

  // 🧩 Step 2: Check if record already exists for this UID and fields are already filled
  const checkQuery = `
    SELECT UID FROM mst_users
    WHERE UID = ?
      AND (specs <> '' AND Diet <> '' AND Drink <> '' AND Smoking <> '' AND Dieses <> '')
  `;

  db.query(checkQuery, [UID], (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Error checking UID",
        error: err,
      });
    }

    // 🧩 Step 3: Prevent duplicate insertion if valid record already exists
    if (result.length > 0) {
      return res.status(400).json({
        success: false,
        message:
          "⚠️ Record already exists with Health Info. Duplicate entry not allowed!",
      });
    }

    // 🧩 Step 4: Update user with new Health Info
    const updateQuery = `
      UPDATE mst_users
      SET specs=?, Diet=?, Drink=?, Smoking=?, Dieses=?
      WHERE UID=?;
    `;

    db.query(updateQuery, [specs, Diet, Drink, Smoking, Dieses, UID], (err2, result2) => {
      if (err2) {
        return res.status(500).json({
          success: false,
          message: "Error updating record",
          error: err2,
        });
      }

      if (result2.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "⚠️ User not found with this UID.",
        });
      }

      res.json({
        success: true,
        message: "✅ Health Info inserted successfully!",
      });
    });
  });
};


// 🟢 UPDATE record by UID
exports.updateHealth = (req, res) => {
  const { UID } = req.params;
  const { specs, Diet, Drink, Smoking, Dieses } = req.body;

  const sql = `
    UPDATE mst_users 
    SET specs=?, Diet=?, Drink=?, Smoking=?, Dieses=? 
    WHERE UID=?`;

  db.query(sql, [specs, Diet, Drink, Smoking, Dieses, UID], (err, result) => {
    if (err)
      return res.status(500).json({ message: "Error updating record", error: err });
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Record not found" });
    res.json({ message: "✅ Record updated successfully" });
  });
};

// 🟢 DELETE complete record by UID
exports.deleteHealth = (req, res) => {
  const { UID } = req.params;

  const sql = "DELETE FROM mst_users WHERE UID = ?";
  
  db.query(sql, [UID], (err, result) => {
    if (err)
      return res.status(500).json({ message: "Error deleting record", error: err });

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Record not found" });

    res.json({ message: "🗑️ Record deleted successfully" });
  });
};
