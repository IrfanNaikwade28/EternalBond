const db = require("../db");

// ==========================
// GET EXPIRY PLAN USERS
// ==========================
exports.getExpiryPlanUsers = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const query = `
    SELECT 
      UID,
      Uname,
      Umobile,
      gender,
      jdate,
      extend_date,
      status
    FROM mst_users
    Where status=1
    ORDER BY UID DESC 
    LIMIT ? OFFSET ?
  `;


  db.query(query, [limit, offset], (err, users) => {
    if (err) return res.json({ success: false, error: err.message });

    const finalUsers = users.map(u => ({
      ...u,
      extend_date: u.extend_date ? u.extend_date : "0000-00-00",
      active_status: u.status === 1 ? "Active" : "Inactive"
    }));

    // Total count for frontend pagination
    db.query("SELECT COUNT(*) as total FROM mst_users", (err2, result2) => {
      if (err2) return res.json({ success: false, error: err2.message });

      const totalRecords = result2[0].total;
      const totalPages = Math.ceil(totalRecords / limit);

      res.json({ success: true, data: finalUsers, totalPages });
    });
  });
};


// ==========================
// EXTEND PLAN
// ==========================
exports.extendPlan = (req, res) => {
  const { uid } = req.params;

  const query = `
    UPDATE mst_users
    SET extend_date = DATE_ADD(jdate, INTERVAL 1 YEAR)
    WHERE UID = ?
  `;

  db.query(query, [uid], (err, result) => {
    if (err) return res.json({ success: false, error: err.message });

    res.json({
      success: true,
      message: "Extend date updated successfully!"
    });
  });
};
