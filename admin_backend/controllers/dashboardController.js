const db = require("../db"); // your MySQL connection

// Get total registration stats
exports.getUserStats = (req, res) => {
  const q = `
    SELECT 
      COUNT(*) AS total,
      SUM(CASE WHEN Gender='Female' THEN 1 ELSE 0 END) AS totalGirls,
      SUM(CASE WHEN Gender='Male' THEN 1 ELSE 0 END) AS totalBoys
    FROM mst_users
  `;

  db.query(q, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result[0]);
  });
};

// Get total success story count
exports.getSuccessStoryCount = (req, res) => {
  const q = `SELECT COUNT(*) AS totalStories FROM mst_story`;

  db.query(q, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result[0]);
  });
};
