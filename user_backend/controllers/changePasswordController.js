const db = require("../db");

exports.changePassword = (req, res) => {
  const { userId, oldPassword, newPassword } = req.body;

  if (!userId || !oldPassword || !newPassword) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  // Step 1: Fetch stored password
  const sql = "SELECT upass FROM mst_users WHERE UID = ?";
  db.query(sql, [userId], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", err });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "User not found!" });
    }

    const savedPassword = result[0].upass;

    // Step 2: Validate old password
    if (savedPassword !== oldPassword) {
      return res.status(401).json({ message: "Old password is incorrect." });
    }

    // Step 3: Update password
    const updateSql = "UPDATE mst_users SET upass = ? WHERE UID = ?";
    db.query(updateSql, [newPassword, userId], (err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to update password", err });
      }

      return res.status(200).json({ message: "Password updated successfully!" });
    });
  });
};
