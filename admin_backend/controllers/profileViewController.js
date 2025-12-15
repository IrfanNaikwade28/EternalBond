const db = require("../db");
const ADMIN_BASE_URL = "http://localhost:5000"; 
exports.getProfileViews = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const search = req.query.search || "";
  const offset = (page - 1) * limit;

  let query = `
    SELECT 
      UID,
      Uname ,
      Umobile 
     
    FROM 
    mst_users 
    WHERE 1 
  `;

  let params = [];

  // Search filter
  if (search) {
    query += " AND Uname LIKE ? ";
    params.push(`%${search}%`);
  }

  query += " ORDER BY UID DESC LIMIT ?, ? ";
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
// ✅ Controller to get viewers of a particular profile
exports.getProfileViewers = (req, res) => {
  const profileId = req.params.profileId; // PRID = ज्याचा profile पाहिला

  const query = `
    SELECT 
        u.UID AS viewer_id,          -- ज्याने profile पाहिला
        u.Uname AS viewer_name,
        u.Umobile AS viewer_mobile,
        u.uprofile AS viewer_profile
        
    FROM mst_profile_view pv
    LEFT JOIN mst_users u ON pv.UID = u.UID   -- pv.UID = viewer
    WHERE pv.PRID = ? 
    ORDER BY pv.PVID DESC    -- सर्वात नवीन view वर
  `;

  db.query(query, [profileId], (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }

    const finalData = result.map(row => ({
      viewer_id: row.viewer_id,
      viewer_name: row.viewer_name,
      viewer_mobile: row.viewer_mobile,
       viewer_profile: row.viewer_profile
        ? `${ADMIN_BASE_URL}/uploads/photos/${row.viewer_profile}`
        : "https://via.placeholder.com/80"
    }));

    res.json({
      success: true,
      data: finalData
    });
  });
};


