// controllers/storyController.js
const db = require("../db");

exports.getStories = (req, res) => {
  const query = `
    SELECT SID, Bridename, groomname, Feedback, simg, status
    FROM mst_story 
    WHERE status = 1
    ORDER BY SID DESC
  `;

  db.query(query, (err, rows) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Database Error",
      });
    }

    const formatted = rows.map((s) => ({
      id: s.SID,
      name: `${s.Bridename} & ${s.groomname}`,
      feedback: s.Feedback,
      image: s.simg,
     
    }));

    return res.json({
      success: true,
      stories: formatted,
    });
  });
};
