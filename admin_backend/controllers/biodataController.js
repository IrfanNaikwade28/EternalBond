const db = require("../db"); // your MySQL connection

//const ADMIN_BASE_URL = "http://localhost:5000"; // optional if you want to use images

exports.getUsers = (req, res) => {
  let { page, search } = req.query;

  page = parseInt(page) || 1;
  const limit = 10; // items per page
  const offset = (page - 1) * limit;

  // Clean search input
  search = search ? search.trim() : "";

  let baseQuery = `
    SELECT UID, Uname, Umobile, Gender
    FROM mst_users
    WHERE status=1
  `;

  // Search by UID, Uname, or Umobile
  if (search) {
    baseQuery += ` AND (UID = ? OR Uname LIKE ? OR Umobile LIKE ?)`;
  }

  // Pagination
  baseQuery += ` ORDER BY UID DESC LIMIT ? OFFSET ?`;

  const params = search ? [search, `%${search}%`, `%${search}%`, limit, offset] : [limit, offset];

  db.query(baseQuery, params, (err, results) => {
    if (err) return res.status(500).json({ error: err });

    // Get total count for pagination
    let countQuery = "SELECT COUNT(*) AS total FROM mst_users WHERE 1=1";
    const countParams = [];
    if (search) {
      countQuery += " AND (UID = ? OR Uname LIKE ? OR Umobile LIKE ?)";
      countParams.push(search, `%${search}%`, `%${search}%`);
    }

    db.query(countQuery, countParams, (err2, countRes) => {
      if (err2) return res.status(500).json({ error: err2 });

      res.json({
        page,
        total: countRes[0].total,
        data: results
      });
    });
  });
};
