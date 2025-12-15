const db = require("../db");

// ==========================
// GET RENEW PLAN USERS
// ==========================
exports.getRenewPlanUsers = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;

  const query = `
    SELECT UID, Uname, Umobile, gender, jdate, extend_date
    FROM mst_users
    WHERE extend_date IS NOT NULL AND extend_date != '0000-00-00'
    ORDER BY UID DESC
    LIMIT ? OFFSET ?
  `;

  db.query(query, [limit, offset], (err, users) => {
    if (err) return res.json({ success: false, error: err.message });

    // Total count for pagination
    db.query(
      "SELECT COUNT(*) as total FROM mst_users WHERE extend_date IS NOT NULL AND extend_date != '0000-00-00'",
      (err2, result2) => {
        if (err2) return res.json({ success: false, error: err2.message });

        const totalRecords = result2[0].total;
        const totalPages = Math.ceil(totalRecords / limit);

        res.json({ success: true, data: users, totalPages });
      }
    );
  });
};
