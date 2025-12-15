const db = require("../db");
  // l.LKID,
  //           l.UID,
  //           l.PRID,
// GET liked profiles by UID
// exports.getLikedProfiles = (req, res) => {
//     const { prid } = req.params;

//     const sql = `
//         SELECT 
          
//             u.*
//         FROM 
//             mst_user_profile_like l
//         INNER JOIN 
//             mst_users u ON l.UID = u.UID
//         WHERE 
//             l.PRID = ?
//         ORDER BY l.LKID DESC
//     `;

//     db.query(sql, [prid], (err, result) => {
//         if (err) {
//             return res.status(500).json({ error: "Database Error", details: err });
//         }

//         res.json({
//             status: "success",
//             total: result.length,
//             data: result
//         });
//     });
// };


exports.getLikedProfiles = (req, res) => {
    const { prid } = req.params;

    const sql = `
        SELECT 
            l.LKID, l.PRID, l.UID as LikedUID,

            u.UID, u.Uname, u.Umobile, u.alt_mobile, u.whatsappno, u.Email,
            u.address, e.Education, u.education_details, u.birthplace,  
            DATE_FORMAT(u.DOB, '%Y-%m-%d') AS DOB, u.height,
            u.weight, u.age, u.varn, u.Gender, u.dob_time, u.marriage_type,
            u.bloodgroup, u.fincome, u.current_work, u.specs, u.Drink,
            u.Diet, u.Smoking, u.Dieses, u.Disease_Details, u.otherinfo,
            u.Expectation, u.uprofile, u.INID,

            i.income,
            c.Country, s.State, d.District, 
            cs.Cast, sc.Subcast,

            f.Mother, f.Father, f.Brother, f.Sister,
            f.father_occupation, f.mother_occupation, f.brother_occupation,
            f.property_details, f.other_details,

            r.Ras, n.Nakshtra, g.Gan, nd.Nadi, gt.Gotra,
            o.charan, o.managal

        FROM mst_user_profile_like l
        INNER JOIN mst_users u ON l.UID = u.UID

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

        WHERE 
            l.PRID = ?
        ORDER BY 
            l.UID DESC
    `;

    db.query(sql, [prid], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Database Error", details: err });
        }

        res.json({
            status: "success",
            total: result.length,
            data: result
        });
    });
};




// =======================================
// NEW: FETCH ALL LIKED USER IDs
// =======================================
exports.getUserLikes = (req, res) => {
  const { PRID } = req.query;

  const query = `
    SELECT UID FROM mst_user_profile_like
    WHERE PRID = ?
  `;

  db.query(query, [PRID], (err, results) => {
    if (err) return res.json({ status: false, error: err });

    const likedUIDs = results.map(row => row.UID);

    res.json({
      status: true,
      likedUIDs
    });
  });
};

// LIKE / UNLIKE API
exports.toggleLike = (req, res) => {
  const { UID, PRID, action } = req.body;

  if (!UID || !PRID || !action) {
    return res.json({ status: false, message: "Invalid input" });
  }

  if (action === "like") {

    const checkQuery = `
      SELECT * FROM mst_user_profile_like 
      WHERE UID = ? AND PRID = ?
    `;

    db.query(checkQuery, [UID, PRID], (err, result) => {
      if (err) return res.json({ status: false, error: err });

      if (result.length > 0) {
        return res.json({ status: true, message: "Already Liked" });
      }

      const insertQuery = `
        INSERT INTO mst_user_profile_like (UID, PRID) 
        VALUES (?, ?)
      `;

      db.query(insertQuery, [UID, PRID], (err2) => {
        if (err2) return res.json({ status: false, error: err2 });

        return res.json({ status: true, message: "Liked" });
      });
    });

  } else if (action === "unlike") {

    const deleteQuery = `
      DELETE FROM mst_user_profile_like 
      WHERE UID = ? AND PRID = ?
    `;

    db.query(deleteQuery, [UID, PRID], (err) => {
      if (err) return res.json({ status: false, error: err });

      return res.json({ status: true, message: "Unliked" });
    });

  } else {
    res.json({ status: false, message: "Invalid action" });
  }
};
