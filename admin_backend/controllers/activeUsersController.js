const db = require("../db");

exports.updateStatus = (req, res) => {
  const { UID } = req.body;

  if (!UID) {
    return res.json({ success: false, message: "UID missing" });
  }

  const query = `UPDATE mst_users SET status = '0' WHERE UID = ?`;

  db.query(query, [UID], (err, result) => {
    if (err) {
      return res.json({ success: false, error: err.message });
    }

    return res.json({
      success: true,
      message: "User deactivated (status = 0)",
    });
  });
};


// GET Active Users
exports.getActiveUsers = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const search = req.query.search || "";
  const offset = (page - 1) * limit;

  let query = `
      SELECT UID, Uname, Umobile, Gender
      FROM mst_users 
      WHERE urole != 'admin' AND status = '1'
  `;

  let params = [];

  if (search) {
    query += ` AND Uname LIKE ? `;
    params.push(`%${search}%`);
  }

  query += ` ORDER BY UID DESC LIMIT ?, ? `;
  params.push(offset, limit);

  db.query(query, params, (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: err.message,
      });
    }

    res.json({
      success: true,
      page,
      limit,
      data: result,
    });
  });
};
