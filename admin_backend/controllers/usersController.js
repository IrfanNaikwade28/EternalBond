const db = require("../db");
const path = require("path");
const fs = require("fs");
//const ADMIN_BASE_URL = "http://localhost:5000";

const removeFile = (filePath) => {
  if (!filePath) return;
  const full = path.join(__dirname, "..", filePath);
  if (fs.existsSync(full)) fs.unlinkSync(full);
};
exports.getUserById = (req, res) => {
  const UID = req.params.UID;
  db.query("SELECT * FROM mst_users WHERE UID = ?", [UID], (err, rows) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (!rows || rows.length === 0) return res.status(404).json({ message: "User not found" });
    res.json(rows[0]);
  });
};

// === GET ALL OR SEARCH ===
exports.getUsers = (req, res) => {
  const search = req.query.search || "";
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  let sql = "SELECT * FROM mst_users";
  let countSql = "SELECT COUNT(*) as total FROM mst_users";
  let params = [];

  // ✅ Search only if UID or full mobile number matches exactly
  if (search) {
    sql += " WHERE UID = ? OR Umobile = ?";
    countSql += " WHERE UID = ? OR Umobile = ?";
    params = [search, search];
  }

  sql += " ORDER BY UID DESC LIMIT ? OFFSET ?";
  params.push(limit, offset);

  db.query(sql, params, (err, result) => {
    if (err)
      return res.status(500).json({ message: "Database error", error: err });

    db.query(
      countSql,
      search ? [search, search] : [],
      (err2, countResult) => {
        if (err2)
          return res.status(500).json({ message: "Count error", error: err2 });

        const total = countResult[0].total;
        const totalPages = Math.ceil(total / limit);

        res.json({
          data: result,
          total,
          page,
          totalPages,
          limit,
        });
      }
    );
  });
};



// Check duplicates before insert
exports.checkDuplicates = (req, res) => {
  const { mobile, alternate, whatsapp, UID } = req.body;

  let query = `SELECT * FROM mst_users WHERE (Umobile=? OR alt_mobile=? OR whatsappno=?)`;
  const params = [mobile, alternate, whatsapp];

  if (UID) {
    // Exclude current UID if editing
    query += ` AND UID != ?`;
    params.push(UID);
  }

  db.query(query, params, (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });

    if (results.length) {
      const existing = results[0];
      if (existing.Umobile === mobile) return res.status(400).json({ field: "mobile", message: "duplicate_mobile" });
      if (existing.alt_mobile === alternate) return res.status(400).json({ field: "alternate", message: "duplicate_alt" });
      if (existing.whatsappno === whatsapp) return res.status(400).json({ field: "whatsapp", message: "duplicate_whatsapp" });
    }

    return res.json({ success: true });
  });
};


exports.addUser = (req, res) => {
  console.log("POST /api/users/ body:", req.body);
  console.log("Files received:", req.files);

  const {
    txtuser,
    txtmobile,
    txtaltno,
    txtwhatsapp,
    txtemail,
    txtgender,
    txtaddress,
    upass,
    role,
  } = req.body;

  const uprofile = req.files?.uprofile?.[0]?.filename || "";
  const aadhar_front_photo = req.files?.aadhar_front_photo?.[0]?.filename || "";
  const aadhar_back_photo = req.files?.aadhar_back_photo?.[0]?.filename || "";

  // ✅ Directly insert user (no duplicate validation)


  // In your user controller (e.g., users.js)

//const db = require('../db'); // your MySQL connection

// Function to check duplicates

  const insertSql = `
    INSERT INTO mst_users 
    (Uname, Umobile, alt_mobile, whatsappno, Email, Gender, address, 
     uprofile, aadhar_front_photo, aadhar_back_photo, upass, urole, jdate)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
  `;

  const values = [
    txtuser,
    txtmobile,
    txtaltno,
    txtwhatsapp,
    txtemail,
    txtgender,
    txtaddress,
    uprofile,
    aadhar_front_photo,
    aadhar_back_photo,
    upass,
    role,
  ];

  db.query(insertSql, values, (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Database error" });
    }

    res.json({
      success: true,
      message: "✅ User added successfully!",
      userId: result.insertId,
    });
  });
};




exports.updateUser = (req, res) => {
  const id = req.params.id;
  console.log("PUT /api/users/:id body:", req.body);
  console.log("Files received:", req.files);

  const {
    txtuser,
    txtmobile,
    txtaltno,
    txtwhatsapp,
    txtemail,
    txtgender,
    txtaddress,
    upass,
    role,
  } = req.body;

  const newUprofile = req.files?.uprofile?.[0]?.filename || null;
  const newFront = req.files?.aadhar_front_photo?.[0]?.filename || null;
  const newBack = req.files?.aadhar_back_photo?.[0]?.filename || null;

  // Step 1: Fetch old data first
  db.query(
    "SELECT Umobile, alt_mobile, whatsappno, uprofile, aadhar_front_photo, aadhar_back_photo FROM mst_users WHERE UID = ?",
    [id],
    (err, rows) => {
      if (err) {
        console.error("DB error while fetching old user:", err);
        return res.status(500).json({ message: "Database error" });
      }
      if (rows.length === 0)
        return res.status(404).json({ message: "User not found" });

      const old = rows[0];

      // Prepare updated fields
      const updatedFields = {
        Uname: txtuser,
        Umobile: txtmobile,
        alt_mobile: txtaltno,
        whatsappno: txtwhatsapp,
        Email: txtemail,
        Gender: txtgender,
        address: txtaddress,
        upass, // no encryption
        urole: role,
        uprofile: newUprofile || old.uprofile,
        aadhar_front_photo: newFront || old.aadhar_front_photo,
        aadhar_back_photo: newBack || old.aadhar_back_photo,
      };

      // ✅ Step 2: Check if any of the numbers actually changed
      const isMobileChanged = txtmobile && txtmobile !== old.Umobile;
      const isAltChanged = txtaltno && txtaltno !== old.alt_mobile;
      const isWhatsChanged = txtwhatsapp && txtwhatsapp !== old.whatsappno;

      // If none of them changed, skip duplicate check
      if (!isMobileChanged && !isAltChanged && !isWhatsChanged) {
        console.log("No contact number changed — skipping duplicate check");
        return updateUserRecord();
      }

      // ✅ Otherwise, run duplicate check only for changed numbers
      const conditions = [];
      const params = [id];

      if (isMobileChanged) {
        conditions.push("Umobile = ?");
        params.push(txtmobile);
      }
      if (isAltChanged) {
        conditions.push("alt_mobile = ?");
        params.push(txtaltno);
      }
      if (isWhatsChanged) {
        conditions.push("whatsappno = ?");
        params.push(txtwhatsapp);
      }

      const duplicateCheckSql = `
        SELECT UID FROM mst_users 
        WHERE UID != ? AND (${conditions.join(" OR ")})
      `;

      db.query(duplicateCheckSql, params, (dupErr, dupResult) => {
        if (dupErr) {
          console.error("Duplicate check error:", dupErr);
          return res.status(500).json({ message: "Database error" });
        }

        if (dupResult.length > 0) {
          return res.status(400).json({
            success: false,
            message:
              "Duplicate mobile, alternate, or WhatsApp number not allowed",
          });
        }

        updateUserRecord();
      });

      // ✅ Step 3: Function to actually update user
      function updateUserRecord() {
        const updateSql = "UPDATE mst_users SET ? WHERE UID = ?";
        db.query(updateSql, [updatedFields, id], (updateErr, result) => {
          if (updateErr) {
            console.error("Update failed:", updateErr);
            return res.status(500).json({ message: "Update failed" });
          }

          // Step 4: Delete old files if replaced
          try {
            if (newUprofile && old.uprofile)
              fs.unlinkSync(
                path.join(__dirname, "../uploads/photos/", old.uprofile)
              );
            if (newFront && old.aadhar_front_photo)
              fs.unlinkSync(
                path.join(__dirname, "../uploads/aadhar/", old.aadhar_front_photo)
              );
            if (newBack && old.aadhar_back_photo)
              fs.unlinkSync(
                path.join(__dirname, "../uploads/aadhar/", old.aadhar_back_photo)
              );
          } catch (fileErr) {
            console.warn("File delete warning:", fileErr.message);
          }

          res.json({
            success: true,
            message: "✅ User updated successfully!",
            updatedId: id,
          });
        });
      }
    }
  );
};




// exports.updateUser = (req, res) => {
//   const id = req.params.id;
//   console.log("PUT /api/users/:id body:", req.body);
//   console.log("Files received:", req.files);

//   const {
//     txtuser,
//     txtmobile,
//     txtaltno,
//     txtwhatsapp,
//     txtemail,
//     txtgender,
//     txtaddress,
//     upass,
//     role,
//   } = req.body;

//   const newUprofile = req.files?.uprofile?.[0]?.filename || null;
//   const newFront = req.files?.aadhar_front_photo?.[0]?.filename || null;
//   const newBack = req.files?.aadhar_back_photo?.[0]?.filename || null;

//   // Step 1: Fetch old data first
//   db.query(
//     "SELECT uprofile, aadhar_front_photo, aadhar_back_photo FROM mst_users WHERE UID = ?",
//     [id],
//     (err, rows) => {
//       if (err) {
//         console.error("DB error while fetching old user:", err);
//         return res.status(500).json({ message: "Database error" });
//       }
//       if (rows.length === 0)
//         return res.status(404).json({ message: "User not found" });

//       const old = rows[0];

//       const updatedFields = {
//         Uname: txtuser,
//         Umobile: txtmobile,
//         alt_mobile: txtaltno,
//         whatsappno: txtwhatsapp,
//         Email: txtemail,
//         Gender: txtgender,
//         address: txtaddress,
//         upass, // no encryption
//         urole: role,
//         uprofile: newUprofile || old.uprofile,
//         aadhar_front_photo: newFront || old.aadhar_front_photo,
//         aadhar_back_photo: newBack || old.aadhar_back_photo,
//       };

//       // Step 2: Check duplicates excluding current user
//       const duplicateCheckSql = `
//         SELECT UID FROM mst_users 
//         WHERE UID != ? AND (
//           Umobile = ? OR alt_mobile = ? OR whatsappno = ?
//         )
//       `;

//       db.query(
//         duplicateCheckSql,
//         [id, txtmobile, txtaltno, txtwhatsapp],
//         (dupErr, dupResult) => {
//           if (dupErr) {
//             console.error("Duplicate check error:", dupErr);
//             return res.status(500).json({ message: "Database error" });
//           }

//           if (dupResult.length > 0) {
//             return res.status(400).json({
//               success: false,
//               message:
//                 "Duplicate mobile, alternate, or WhatsApp number not allowed",
//             });
//           }

//           // Step 3: Update user
//           const updateSql = "UPDATE mst_users SET ? WHERE UID = ?";
//           db.query(updateSql, [updatedFields, id], (updateErr, result) => {
//             if (updateErr) {
//               console.error("Update failed:", updateErr);
//               return res.status(500).json({ message: "Update failed" });
//             }

//             // Step 4: Delete old files if replaced
//             try {
//               if (newUprofile && old.uprofile)
//                 fs.unlinkSync(
//                   path.join(__dirname, "../uploads/photos/", old.uprofile)
//                 );
//               if (newFront && old.aadhar_front_photo)
//                 fs.unlinkSync(
//                   path.join(__dirname, "../uploads/aadhar/", old.aadhar_front_photo)
//                 );
//               if (newBack && old.aadhar_back_photo)
//                 fs.unlinkSync(
//                   path.join(__dirname, "../uploads/aadhar/", old.aadhar_back_photo)
//                 );
//             } catch (fileErr) {
//               console.warn("File delete warning:", fileErr.message);
//             }

//             res.json({
//               success: true,
//               message: "✅ User updated successfully!",
//               updatedId: id,
//             });
//           });
//         }
//       );
//     }
//   );
// };








// exports.updateUser = (req, res) => {
//   const id = req.params.id;
//   console.log("PUT /api/users/:id body:", req.body);
// console.log("Files received:", req.files);
//   const {
//     txtuser,
//     txtmobile,
//     txtaltno,
//     txtwhatsapp,
//     txtemail,
//     txtgender,
//     txtaddress,
//     upass,
//     role,
//   } = req.body;

//   const newUprofile = req.files?.uprofile?.[0]?.filename || null;
//   const newFront = req.files?.aadhar_front_photo?.[0]?.filename || null;
//   const newBack = req.files?.aadhar_back_photo?.[0]?.filename || null;

//   // Step 1: Fetch old data first
//   db.query(
//     "SELECT uprofile, aadhar_front_photo, aadhar_back_photo FROM mst_users WHERE UID = ?",
//     [id],
//     (err, rows) => {
//       if (err || rows.length === 0)
//         return res.status(404).json({ message: "User not found" });

//       const old = rows[0];

//       const updatedFields = {
//         Uname: txtuser,
//         Umobile: txtmobile,
//         alt_mobile: txtaltno,
//         whatsappno: txtwhatsapp,
//         Email: txtemail,
//         Gender: txtgender,
//         address: txtaddress,
//         upass,
//         urole: role,
//         uprofile: newUprofile || old.uprofile,
//         aadhar_front_photo: newFront || old.aadhar_front_photo,
//         aadhar_back_photo: newBack || old.aadhar_back_photo,
//       };

//       // Step 2: Check duplicate numbers (excluding current user)
//       const duplicateCheckSql = `
//         SELECT UID 
//         FROM mst_users 
//         WHERE UID != ? AND (
//           Umobile IN (?, ?, ?) 
//           OR alt_mobile IN (?, ?, ?) 
//           OR whatsappno IN (?, ?, ?)
//         )
//       `;

//       const checkValues = [
//         id,
//         txtmobile, txtaltno, txtwhatsapp,
//         txtmobile, txtaltno, txtwhatsapp,
//         txtmobile, txtaltno, txtwhatsapp,
//       ];

//       db.query(duplicateCheckSql, checkValues, (dupErr, dupResult) => {
//         if (dupErr) {
//           console.error("Database error:", dupErr);
//           return res.status(500).json({ message: "Database error" });
//         }

//         if (dupResult.length > 0) {
//           return res.status(400).json({
//             success: false,
//             message:
//               "Duplicate mobile, alternate, or WhatsApp number not allowed",
//           });
//         }

//         // Step 3: Proceed with update
//         db.query(
//           "UPDATE mst_users SET ? WHERE UID = ?",
//           [updatedFields, id],
//           (updateErr) => {
//             if (updateErr)
//               return res.status(500).json({ message: "Update failed" });

//             // Step 4: Delete old files if new uploaded
//             if (newUprofile && old.uprofile)
//               fs.unlink(
//                 path.join(__dirname, "../uploads/photos/", old.uprofile),
//                 () => {}
//               );
//             if (newFront && old.aadhar_front_photo)
//               fs.unlink(
//                 path.join(__dirname, "../uploads/aadhar/", old.aadhar_front_photo),
//                 () => {}
//               );
//             if (newBack && old.aadhar_back_photo)
//               fs.unlink(
//                 path.join(__dirname, "../uploads/aadhar/", old.aadhar_back_photo),
//                 () => {}
//               );

//             res.json({ success: true, message: "User updated successfully" });
//           }
//         );
//       });
//     }
//   );
// };





// exports.addUser = (req, res) => {
//   const {
//     txtuser,
//     txtmobile,
//     txtaltno,
//     txtwhatsapp,
//     txtemail,
//     txtgender,
//     txtaddress,
//     upass,
//     role,
//   } = req.body;

//   // Only store the filenames (not full paths)
//   const uprofile = req.files?.uprofile?.[0]?.filename || "";
//   const aadhar_front_photo = req.files?.aadhar_front_photo?.[0]?.filename || "";
//   const aadhar_back_photo = req.files?.aadhar_back_photo?.[0]?.filename || "";

//   // ✅ Step 1: Check if mobile number already exists with same name
//   const checkSql = "SELECT UID FROM mst_users WHERE Umobile = ? AND Uname = ?";
//   db.query(checkSql, [txtmobile, txtuser], (err, existing) => {
//     if (err) {
//       console.error("Database error:", err);
//       return res.status(500).json({ message: "Database error" });
//     }

//     if (existing.length > 0) {
//       return res.status(400).json({ success: false, message: "Mobile number already exists" });
//     }

//     // ✅ Step 2: If not exists, insert new record
//     const insertSql = `
//       INSERT INTO mst_users 
//       (Uname, Umobile, alt_mobile, whatsappno, Email, Gender, address, 
//        uprofile, aadhar_front_photo, aadhar_back_photo, upass, urole, jdate)
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
//     `;

//     const values = [
//       txtuser,
//       txtmobile,
//       txtaltno,
//       txtwhatsapp,
//       txtemail,
//       txtgender,
//       txtaddress,
//       uprofile,
//       aadhar_front_photo,
//       aadhar_back_photo,
//       upass,
//       role,
//     ];

//     db.query(insertSql, values, (err, result) => {
//       if (err) {
//         console.error("Database error:", err);
//         return res.status(500).json({ message: "Database error" });
//       }

//       res.json({
//         success: true,
//         message: "User added successfully",
//         userId: result.insertId,
//       });
//     });
//   });
// };


// === UPDATE ===
// exports.updateUser = (req, res) => {
//   const id = req.params.id;
//   const {
//     txtuser,
//     txtmobile,
//     txtaltno,
//     txtwhatsapp,
//     txtemail,
//     txtgender,
//     txtaddress,
//     upass,
//     role,
//   } = req.body;

//   const newUprofile = req.files?.uprofile?.[0]?.filename || null;
//   const newFront = req.files?.aadhar_front_photo?.[0]?.filename || null;
//   const newBack = req.files?.aadhar_back_photo?.[0]?.filename || null;

//   // Get old file names first
//   db.query("SELECT uprofile, aadhar_front_photo, aadhar_back_photo FROM mst_users WHERE UID = ?", [id], (err, rows) => {
//     if (err || rows.length === 0) return res.status(500).json({ message: "User not found" });

//     const old = rows[0];

//     const updatedFields = {
//       Uname: txtuser,
//       Umobile: txtmobile,
//       alt_mobile: txtaltno,
//       whatsappno: txtwhatsapp,
//       Email: txtemail,
//       Gender: txtgender,
//       address: txtaddress,
//       upass,
//       urole: role,
//       uprofile: newUprofile || old.uprofile,
//       aadhar_front_photo: newFront || old.aadhar_front_photo,
//       aadhar_back_photo: newBack || old.aadhar_back_photo,
//     };

//     db.query("UPDATE mst_users SET ? WHERE UID = ?", [updatedFields, id], (updateErr) => {
//       if (updateErr) return res.status(500).json({ message: "Update failed" });

//       // delete old files if new ones uploaded
//       if (newUprofile && old.uprofile)
//         fs.unlink(path.join(__dirname, "../uploads/photos/", old.uprofile), () => {});
//       if (newFront && old.aadhar_front_photo)
//         fs.unlink(path.join(__dirname, "../uploads/aadhar/", old.aadhar_front_photo), () => {});
//       if (newBack && old.aadhar_back_photo)
//         fs.unlink(path.join(__dirname, "../uploads/aadhar/", old.aadhar_back_photo), () => {});

//       res.json({ success: true, message: "User updated successfully" });
//     });
//   });
// };


// === DELETE ===
exports.deleteUser = (req, res) => {
  const id = req.params.id;
  db.query("SELECT * FROM mst_users WHERE UID = ?", [id], (err, rows) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (!rows.length) return res.status(404).json({ message: "User not found" });

    const user = rows[0];
    removeFile(user.uprofile);
    removeFile(user.aadhar_front_photo);
    removeFile(user.aadhar_back_photo);

    db.query("DELETE FROM mst_users WHERE UID = ?", [id], (err) => {
      if (err) return res.status(500).json({ message: "Database error" });
      res.json({ message: "User deleted successfully" });
    });
  });
};
