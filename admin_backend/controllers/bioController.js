// controllers/userController.js
const db = require("../db");
const ADMIN_BASE_URL = "http://localhost:5000";

exports.getUserByUID = (req, res) => {
  const uid = req.params.uid;
  if (!uid) return res.status(400).json({ success: false, error: "UID required" });

  // Query to fetch user and map referenced IDs to names via LEFT JOINs
  const sql = `
 SELECT 
  u.UID,
  u.Uname,
  u.Umobile,
  u.Email,
  u.address,
  u.CNID, c.Country,
  u.STID, s.State,
  u.DSID, d.District,
  u.EDID, ed.Education,
  u.education_details,
  u.CTID, cs.Cast AS CastName,
  u.SCTID, sc.Subcast AS SubcastName,
  u.birthplace,
  u.DOB,
  u.dob_time,
  u.height,
  u.weight,
  u.age,
  u.varn,
  u.Gender,
  u.marriage_type,
  u.bloodgroup,
  u.INID, i.income AS IncomeName,
  u.fincome,
  u.current_work,
  u.specs,
  u.Drink,
  u.Diet,
  u.Smoking,
  u.Dieses,
  u.Disease_Details,
  u.otherinfo,
  u.Expectation,
  u.familydetails,

  /* Family */
  f.Mother,
  f.Father,
  f.Brother,
  f.Sister,
  f.father_occupation,
  f.mother_occupation,
  f.brother_occupation,
  f.property_details,
  f.other_details,

  /* Other Info Joins */
  o.kuldaiwat,
  o.charan,
  o.managal,
  r.Ras AS Rashi,
  n.Nakshtra AS Nakshatra,
  g.Gan AS Gan,
  nd.Nadi AS Nadi,
  gt.Gotra AS Gotra,

  u.uprofile

FROM mst_users u
LEFT JOIN mst_cast cs ON u.CTID = cs.CTID
LEFT JOIN mst_subcast sc ON u.SCTID = sc.SCTID
LEFT JOIN mst_country c ON u.CNID = c.CNID
LEFT JOIN mst_state s ON u.STID = s.STID
LEFT JOIN mst_district d ON u.DSID = d.DSID
LEFT JOIN mst_education ed ON u.EDID = ed.EDID
LEFT JOIN mst_income i ON u.INID = i.INID
LEFT JOIN mst_family f ON u.UID = f.UID

/* New other info joins */
LEFT JOIN mst_otherinfo o ON u.UID = o.UID
LEFT JOIN mst_rashi r ON o.RSID = r.RSID
LEFT JOIN mst_nakshtra n ON o.NKID = n.NKID
LEFT JOIN mst_gan g ON o.GNID = g.GNID
LEFT JOIN mst_nadi nd ON o.NDID = nd.NDID
LEFT JOIN mst_gotra gt ON o.GID = gt.GID

WHERE u.UID = ?
LIMIT 1;

`;

  db.query(sql, [uid], (err, results) => {
    if (err) {
      console.error("DB error:", err);
      return res.status(500).json({ success: false, error: err.message });
    }

    if (!results || results.length === 0) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const row = results[0];

    // Build the response object - include fallback/defaults
   const user = {
  UID: row.UID,
  Uname: row.Uname,
  Umobile: row.Umobile,
  Email: row.Email,
  address: row.address,

  Country: row.Country,
  State: row.State,
  District: row.District,

  EducationID: row.EDID,
  Education: row.Education,
  education_details: row.education_details,

  CastID: row.CTID,
  Cast: row.CastName,
  SubcastID: row.SCTID,
  Subcast: row.SubcastName,

  birthplace: row.birthplace,
  DOB: row.DOB,
  dob_time: row.dob_time,
  height: row.height,
  weight: row.weight,
  age: row.age,
  varn: row.varn,
  Gender: row.Gender,
  marriage_type: row.marriage_type,
  bloodgroup: row.bloodgroup,

  IncomeID: row.INID,
  IncomeName: row.IncomeName,
  fincome: row.fincome,
  current_work: row.current_work,
  specs: row.specs,

  Drink: row.Drink,
  Diet: row.Diet,
  Smoking: row.Smoking,
  Dieses: row.Dieses,
  Disease_Details: row.Disease_Details,

  otherinfo: row.otherinfo,
  Expectation: row.Expectation,
  familydetails: row.familydetails,

  // Family table
  Mother: row.Mother,
  Father: row.Father,
  Brother: row.Brother,
  Sister: row.Sister,
  father_occupation: row.father_occupation,
  mother_occupation: row.mother_occupation,
  brother_occupation: row.brother_occupation,
  property_details: row.property_details,
  other_family_details: row.other_details,

  // NEW OTHERINFO DATA
  Rashi: row.Rashi,
  Nakshatra: row.Nakshatra,
  Gan: row.Gan,
  Nadi: row.Nadi,
  Gotra: row.Gotra,
  kuldaiwat: row.kuldaiwat,
  charan: row.charan,
  mangal: row.managal,

  // Photo
  uprofile: row.uprofile
    ? `${ADMIN_BASE_URL}/uploads/photos/${row.uprofile}`
    : `${ADMIN_BASE_URL}/uploads/photos/default-profile.png`
};



    return res.json({ success: true, data: user });
  });
};
