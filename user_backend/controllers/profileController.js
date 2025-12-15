const db = require("../db");
const ADMIN_BASE_URL = "http://localhost:5000";

exports.getProfileByUID = (req, res) => {
  const uid = req.query.UID; // ✅ get UID from query

  if (!uid) {
    return res.status(400).json({ message: "UID is required" });
  }

  let sql = `
    SELECT 
      u.UID, u.Uname, u.Umobile, u.Email, u.alt_mobile, u.whatsappno,
      u.address, e.Education, u.education_details, u.birthplace, 
      u.DOB, u.dob_time, u.height, u.weight, u.age, u.varn, u.Gender,
      u.marriage_type, u.bloodgroup, u.fincome,
      u.current_work, u.specs, u.Drink, u.Diet, u.Smoking,
      u.Dieses, u.Disease_Details, u.otherinfo, u.Expectation,
      u.uprofile, u.INID,

      i.income,
      c.Country, s.State, d.District,
      cs.Cast, sc.Subcast,

      f.Mother, f.Father, f.Brother, f.Sister,
      f.father_occupation, f.mother_occupation, f.brother_occupation,
      f.property_details, f.other_details,

      r.Ras, n.Nakshtra, g.Gan, nd.Nadi, gt.Gotra,
      o.charan, o.managal

    FROM mst_users u
    LEFT JOIN mst_education e ON u.EDID = e.EDID
    LEFT JOIN mst_country c ON u.CNID = c.CNID
    LEFT JOIN mst_state s ON u.STID = s.STID
    LEFT JOIN mst_district d ON u.DSID = d.DSID
    LEFT JOIN mst_cast cs ON u.CTID = cs.CTID
    LEFT JOIN mst_subcast sc ON u.SCTID = sc.SCTID
    LEFT JOIN mst_family f ON u.UID = f.UID
    LEFT JOIN mst_income i ON u.INID = i.INID
    LEFT JOIN mst_otherinfo o ON u.UID = o.UID
    LEFT JOIN mst_rashi r ON o.RSID = r.RSID
    LEFT JOIN mst_nakshtra n ON o.NKID = n.NKID
    LEFT JOIN mst_gan g ON o.GNID = g.GNID
    LEFT JOIN mst_nadi nd ON o.NDID = nd.NDID
    LEFT JOIN mst_gotra gt ON o.GID = gt.GID

    WHERE u.UID = ?
  `;

  db.query(sql, [uid], (err, result) => {
    if (err) {
      console.log("Profile Error:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = result[0];

    user.uprofile = user.uprofile
      ? `${ADMIN_BASE_URL}/uploads/photos/${user.uprofile}`
      : "https://via.placeholder.com/150";

    res.json(user);
  });
};
