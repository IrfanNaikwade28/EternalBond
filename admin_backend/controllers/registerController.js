const db = require("../db"); // your database connection

exports.registerUser = (req, res) => {
  const { txtuser, txtmobile, txtgender } = req.body;

  if (!txtuser || !txtmobile || !txtgender) {
    return res.status(400).json({ message: "Required fields missing!" });
  }

  const query = `
    INSERT INTO mst_users (Uname, Umobile, Gender)
    VALUES (?, ?, ?)
  `;

  db.query(query, [txtuser, txtmobile, txtgender], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }

    // Send inserted UID
    res.json({ message: "User registered successfully", UID: result.insertId });
  });
};
