const db = require("../db");

//const db = require("../db");
exports.getUnlockedProfiles = (req, res) => {
  const loginUserUID = req.query.loginUserUID;

  const query = `SELECT PRID FROM mst_profile_view WHERE UID = ?`;
  db.query(query, [loginUserUID], (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: "DB Error" });

    const unlocked = rows.map(r => r.PRID);
    return res.json({ success: true, unlocked });
  });
};

exports.incrementViewCount = (req, res) => {
  const { loginUserUID, selectedUserUID } = req.body;

  if (!loginUserUID || !selectedUserUID) {
    return res.status(400).json({
      success: false,
      message: "loginUserUID and selectedUserUID are required",
    });
  }

  // 1️⃣ Check user plan limit first
  const userQuery = "SELECT viewcount, Profile_viewcount FROM mst_users WHERE UID = ?";
  db.query(userQuery, [loginUserUID], (err, userRows) => {
    if (err) return res.status(500).json({ success: false });

    if (!userRows.length) return res.status(404).json({ success: false, message: "User not found" });

    const currentCount = parseInt(userRows[0].viewcount || 0);
    const limit = parseInt(userRows[0].Profile_viewcount || 0);

    console.log("CHECK:", currentCount, limit);

    if (currentCount >= limit) {
      return res.json({
        success: false,
        allowView: false,
        canShowContact: false,
        message: "Your plan has expired! Please upgrade your plan.",
      });
    }

    // 2️⃣ Check if profile was already unlocked
    const checkViewQuery = `SELECT * FROM mst_profile_view WHERE UID = ? AND PRID = ?`;
    db.query(checkViewQuery, [loginUserUID, selectedUserUID], (err, viewRows) => {
      if (err) return res.status(500).json({ success: false });

      const mobileQuery = "SELECT Umobile, alt_mobile, whatsappno FROM mst_users WHERE UID = ?";
      db.query(mobileQuery, [selectedUserUID], (err, mobileRows) => {
        if (err) return res.status(500).json({ success: false });

       const mobile = {
    Umobile: mobileRows[0].Umobile,
    alt_mobile: mobileRows[0].alt_mobile || "",
    whatsappno: mobileRows[0].whatsappno || "",
  };

        if (viewRows.length > 0) {
          // Already unlocked
          return res.json({
            success: true,
            allowView: true,
            alreadyUnlocked: true,
            canShowContact: true,
            mobile,
          });
        }

        // 3️⃣ Increment viewcount
        const newCount = currentCount + 1;
        const updateQuery = "UPDATE mst_users SET viewcount = ? WHERE UID = ?";
        db.query(updateQuery, [newCount, loginUserUID], (err) => {
          if (err) return res.status(500).json({ success: false });

          // 4️⃣ Save unlocked profile
          const insertViewQuery = `INSERT INTO mst_profile_view (UID, PRID) VALUES (?, ?)`;
          db.query(insertViewQuery, [loginUserUID, selectedUserUID], (err) => {
            if (err) return res.status(500).json({ success: false });

            return res.json({
              success: true,
              allowView: true,
              alreadyUnlocked: false,
              canShowContact: true,
              mobile,
              used: newCount,
              remaining: limit - newCount,
            });
          });
        });
      });
    });
  });
};



