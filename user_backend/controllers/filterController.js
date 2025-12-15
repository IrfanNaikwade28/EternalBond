const db = require('../db'); // your MySQL connection
const ADMIN_BASE_URL = "http://localhost:5000";
// Fetch all income
exports.getIncome = (req, res) => {
  db.query("SELECT INID, Income FROM mst_income ORDER BY Income ASC", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

// Fetch all education
exports.getEducation = (req, res) => {
  db.query("SELECT EDID, Education FROM mst_education ORDER BY Education ASC", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

// Fetch all height
exports.getHeight = (req, res) => {
  db.query("SELECT HID, height_between, sheight, lheight FROM mst_height_between ORDER BY HID ASC", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

// Fetch all caste
exports.getCaste = (req, res) => {
  db.query("SELECT CTID, Cast FROM mst_cast ORDER BY Cast ASC", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

// Fetch all subcaste
exports.getSubcast = (req, res) => {
  db.query("SELECT SCTID, Subcast FROM mst_subcast ORDER BY Subcast ASC", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

// Fetch all marriage types
exports.getMarriageType = (req, res) => {
  db.query("SELECT MRID, Marriage FROM mst_marriage ORDER BY Marriage ASC", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

// Fetch all countries
exports.getCountry = (req, res) => {
  db.query("SELECT CNID, Country FROM mst_country ORDER BY Country ASC", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};


exports.getFilteredProfiles = (req, res) => {

  // Clean Input Values
  const clean = (val) => val && val !== "" ? val : null;
 // 🌟 UNIVERSAL SEARCH FIX (UID / Uname / Umobile)
  if (req.body.search) {
    req.body.UID = req.body.search;
    req.body.Uname = req.body.search;
    req.body.Umobile = req.body.search;
  }
  const {
    fromYear,
    toYear,
    EDID,
    CTID,
    SCTID,
    height,
    INID,
    CNID,
    marriage_type,
     UID,
  Uname,
  Umobile
  } = Object.fromEntries(
    Object.entries(req.body).map(([k, v]) => [k, clean(v)])
  );

console.log("user height="+height)
  let query = `
    SELECT 
    u.UID, u.Uname, u.Umobile, u.Email, u.alt_mobile, u.whatsappno,
    u.address, e.Education, u.education_details, u.birthplace, 
    u.DOB, u.dob_time, u.height, u.weight, u.age, u.varn, u.Gender,
    u.marriage_type, u.bloodgroup, u.fincome,
    u.current_work, u.specs, u.Drink, u.Diet, u.Smoking,
    u.Dieses, u.Disease_Details, u.otherinfo, u.Expectation,
    u.uprofile, u.INID,
    i.income, c.Country, s.State, d.District,
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
    WHERE 1=1
  `;

  let conditions = [];
//if (UID) conditions.push(`u.UID = ${UID}`);
// UID / Name / Mobile - OR Search System
let searchOR = [];
if (UID) searchOR.push(`u.UID = '${UID}'`);
if (Uname) searchOR.push(`u.Uname LIKE '%${Uname}%'`);
if (Umobile) searchOR.push(`u.Umobile LIKE '%${Umobile}%'`);

if (searchOR.length > 0) {
    conditions.push("(" + searchOR.join(" OR ") + ")");
}
  if (fromYear) conditions.push(`YEAR(u.DOB) >= ${fromYear}`);
  if (toYear) conditions.push(`YEAR(u.DOB) <= ${toYear}`);
  if (EDID) conditions.push(`u.EDID = ${EDID}`);
  if (CTID) conditions.push(`u.CTID = ${CTID}`);
  if (SCTID) conditions.push(`u.SCTID = ${SCTID}`);
  if (INID) conditions.push(`u.INID = ${INID}`);
  if (CNID) conditions.push(`u.CNID = ${CNID}`);
  if (marriage_type) conditions.push(`u.marriage_type = '${marriage_type}'`);

  // Height Filter
    // Height Filter
 // Height Filter
  // Height Filter
// if (height && height.includes("to")) {
//   const nums = height.match(/\d+(\.\d+)?/g);

//   if (nums?.length >= 2) {

//     // Convert feet.inches to total inches
//     const convertToInches = (v) => {
//       const [ft, inch = "0"] = v.split(".");
//       return parseInt(ft) * 12 + parseInt(inch);
//     };

//     const min = convertToInches(nums[0]); // e.g., 5.8 → 68 inches
//     const max = convertToInches(nums[1]); // e.g., 5.10 → 70 inches

//     // SQL: total inches comparison
//     conditions.push(`
//       (
//         CAST(SUBSTRING_INDEX(TRIM(u.height),'.',1) AS UNSIGNED) * 12
//         + CAST(SUBSTRING_INDEX(TRIM(u.height),'.',-1) AS UNSIGNED)
//       ) BETWEEN ${min} AND ${max}
//     `);
//   }
// }



// Height Filter
if (height && height.includes("to")) {

  const extractFeetInch = (str) => {
    const cleaned = str.trim().replace("Height Between", "").replace("to", "").trim();

    const [ft, inch] = cleaned.split(".").map(v => v.trim());
    return {
      feet: parseInt(ft) || 0,
      inch: parseInt(inch) || 0
    };
  };

  // split "Height Between 4.5 to 5.10"
  const parts = height.replace("Height Between", "").trim().split("to");

  const start = extractFeetInch(parts[0]);
  const end = extractFeetInch(parts[1]);

  const min = (start.feet * 12) + start.inch;
  const max = (end.feet * 12) + end.inch;

  conditions.push(`
    (
      CAST(SUBSTRING_INDEX(TRIM(u.height),'.',1) AS UNSIGNED) * 12
      + CAST(SUBSTRING_INDEX(TRIM(u.height),'.',-1) AS UNSIGNED)
    ) BETWEEN ${min} AND ${max}
  `);
}



  if (conditions.length > 0) query += " AND " + conditions.join(" AND ");

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err });
// Add full profile image URL
    const updatedResults = results.map(user => {
      return {
        ...user,
        uprofile: user.uprofile
          ? `${ADMIN_BASE_URL}/uploads/photos/${user.uprofile}`
          : "https://via.placeholder.com/150"
      };
    });



    res.json(updatedResults);
  });
};
