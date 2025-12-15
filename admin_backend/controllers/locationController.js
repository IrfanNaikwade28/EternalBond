const db = require("../db");

// ✅ Fetch all active countries
exports.getCountries = (req, res) => {
  const sql = "SELECT CNID, Country FROM mst_country WHERE status = 1";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching countries:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.json(results);
  });
};

// ✅ Fetch states by Country ID
exports.getStatesByCountry = (req, res) => {
  const { cnid } = req.params;
  const sql = "SELECT STID, State FROM mst_state WHERE CNID = ? AND status = 1";
  db.query(sql, [cnid], (err, results) => {
    if (err) {
      console.error("Error fetching states:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.json(results);
  });
};

// ✅ Fetch districts by State ID
exports.getDistrictsByState = (req, res) => {
  const { stid } = req.params;
  const sql = "SELECT DSID, District FROM mst_district WHERE STID = ? AND status = 1";
  db.query(sql, [stid], (err, results) => {
    if (err) {
      console.error("Error fetching districts:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.json(results);
  });
};
