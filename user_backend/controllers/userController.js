const db = require("../db");
const ADMIN_BASE_URL = "http://localhost:5000"; // admin_backend URL

exports.getUsers = (req, res) => {
  const { gender } = req.query; // ✅ Only gender filter
  console.log("Gender:", gender);

  let sql = `
    SELECT 
      u.UID, u.Uname, u.Umobile, u.alt_mobile, u.whatsappno, u.Email,
      u.address,e.Education, u.education_details, u.birthplace,  DATE_FORMAT(u.DOB, '%Y-%m-%d') AS DOB, u.height,
      u.weight, u.age, u.varn, u.Gender, u.dob_time, u.marriage_type,
      u.bloodgroup, u.fincome, u.current_work, u.specs, u.Drink,
      u.Diet, u.Smoking, u.Dieses, u.Disease_Details, u.otherinfo,
      u.Expectation, u.uprofile,u.INID,

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
    LEFT JOIN  mst_income i ON u.INID = i.INID
    LEFT JOIN mst_otherinfo o ON u.UID = o.UID
    LEFT JOIN mst_rashi r ON o.RSID = r.RSID
    LEFT JOIN mst_nakshtra n ON o.NKID = n.NKID
    LEFT JOIN mst_gan g ON o.GNID = g.GNID
    LEFT JOIN mst_nadi nd ON o.NDID = nd.NDID
    LEFT JOIN mst_gotra gt ON o.GID = gt.GID
   
  `;

  // ✅ Apply gender filter only if provided
  if (gender) {
    sql += ` WHERE  u.status = 1 AND u.Gender != '${gender}'`;
  }

  // ✅ Sort results (optional)
  sql += ` ORDER BY u.UID DESC`;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Error fetching users:", err);
      return res.status(500).json({ error: "Database query failed" });
    }

    // ✅ Add full image path or fallback placeholder
    const updatedResults = results.map(user => ({
      ...user,
      uprofile: user.uprofile
        ? `${ADMIN_BASE_URL}/uploads/photos/${user.uprofile}`
        : "https://via.placeholder.com/150"
    }));

    res.status(200).json(updatedResults);
  });
};
