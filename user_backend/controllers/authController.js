const db = require("../db");
const ADMIN_BASE_URL = "http://localhost:5000";
exports.loginUser = (req, res) => {
  const { Umobile, upass } = req.body;

  if (!Umobile || !upass) {
    return res.status(400).json({ message: "Mobile number and password required" });
  }

  const sql =`
    SELECT u.*, e.Education 
    FROM mst_users u
    LEFT JOIN mst_education e ON u.EDID = e.EDID
    WHERE u.Umobile = ? 
      AND u.upass = ? 
      AND u.urole = 'user'
  `;
  db.query(sql, [Umobile, upass], (err, result) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ message: "Database query error" });
    }

    if (result.length > 0) {
      const user = result[0];
      return res.status(200).json({
        message: "Login successful",
        user: {
          UID: user.UID,
          Umobile: user.Umobile,
          urole: user.urole,
          Gender:user.Gender,
          Uname:user.Uname,
            Education: user.Education,  // ← Added
            uprofile:user.uprofile
      ? `${ADMIN_BASE_URL}/uploads/photos/${user.uprofile}`
      : "https://via.placeholder.com/150"
        },
      });
    } else {
      return res.status(401).json({ message: "Invalid credentials or not an User" });
    }
  });
};
