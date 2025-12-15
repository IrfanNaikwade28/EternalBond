const db = require("../db");

exports.getUsers = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const search = req.query.search || "";
  const offset = (page - 1) * limit;

  let query = `
      SELECT UID, Uname, Umobile, viewcount, Profile_viewcount 
      FROM mst_users 
      WHERE urole != 'admin'
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
        error: err.message
      });
    }

    res.json({
      success: true,
      page,
      limit,
      data: result
    });
  });
};
// ADD +50 TO PROFILE VIEW COUNT
exports.addProfileCount = (req, res) => {
  const UID = req.params.uid;

  const updateQuery = `
      UPDATE mst_users
      SET Profile_viewcount = Profile_viewcount + 50
      WHERE UID = ?
  `;

  db.query(updateQuery, [UID], (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: err.message
      });
    }

    return res.json({
      success: true,
      message: "Profile view count increased by 50!"
    });
  });
};