const db = require("../db");

exports.loginUser = (req, res) => {
  const { Umobile, upass } = req.body;

  if (!Umobile || !upass) {
    return res.status(400).json({ message: "Mobile number and password required" });
  }

  const sql = "SELECT * FROM mst_users WHERE Umobile = ? AND upass = ? AND urole = 'admin'";
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
          Uname:user.Uname,
          uprofile:user.uprofile

        },
      });
    } else {
      return res.status(401).json({ message: "Invalid credentials or not an admin" });
    }
  });
};
