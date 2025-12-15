import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../context/UserContext"; // ✅ import context
import '../App.css'
const API = "http://localhost:5000/api/users";
import './table.css'

export default function UserBasicInfo({ onNextTab }) {
  //const { userId, setUserId } = useUser(); // ✅ Access userId globally
  const { userId, setUserId, setUpass, setUprofile } = useUser();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [form, setForm] = useState({
    txtuser: "",
    txtmobile: "",
    txtaltno: "",
    txtwhatsapp: "",
    txtemail: "",
    txtaddress: "",
    txtgender: "Male",
    upass: "",
    role: "user",
  });
  const [files, setFiles] = useState({
    uprofile: null,
    aadhar_front_photo: null,
    aadhar_back_photo: null,
  });
  const [msg, setMsg] = useState("");

  // === FETCH USERS ===
  const fetchUsers = async (searchTerm = "", p = page) => {
    try {
      const response = await axios.get(`${API}?page=${p}&limit=${limit}&search=${searchTerm}`);
      setUsers(response.data.data);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };



  // const fetchUsers = async (q = "") => {
  //   try {
  //     const res = await axios.get(API, { params: q ? { search: q } : {} });
  //     setUsers(res.data);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  useEffect(() => {
    fetchUsers(search);
  }, [page]);
  // === HANDLE INPUT ===
  // === HANDLE INPUT ===
  const handleChange = (e) => {
    const { name, value } = e.target;

    // ✅ Restrict user name to alphabets and spaces
    if (name === "txtuser") {
      const onlyLetters = value.replace(/[^A-Za-z\s]/g, "");
      setForm((s) => ({ ...s, [name]: onlyLetters }));
      return;
    }



    if (["txtmobile", "txtaltno", "txtwhatsapp"].includes(name)) {
      const digitsOnly = value.replace(/\D/g, ""); // keep only numbers
      const error = validateMobile(digitsOnly, name);
      setMsg(error); // set appropriate message
      setForm((s) => ({ ...s, [name]: digitsOnly }));
      return;
    }

    setForm((s) => ({ ...s, [name]: value }));
  };

  // Reusable mobile validator
  const validateMobile = (num, fieldName) => {
    if (num.length > 10) return `${fieldName}_invalid`; // too long
    if (num.length > 0 && !/^[7-9]/.test(num)) return `${fieldName}_start_invalid`; // first digit invalid
    return ""; // valid

    // ✅ For mobile-like fields: only digits, limit 10, show error instantly
    // if (["txtmobile", "txtaltno", "txtwhatsapp"].includes(name)) {
    //   const digitsOnly = value.replace(/\D/g, ""); // remove non-numeric chars

    //   if (digitsOnly.length > 10) {
    //     setMsg(`${name}_invalid`); // store which field is invalid
    //   } else if (digitsOnly.length > 0 && !/^[7-9]/.test(digitsOnly)) {
    //   setMsg(`${name}_start_invalid`); // first digit invalid
    // } 
    //   else {
    //     setMsg(""); // clear when valid
    //   }

    //   setForm((s) => ({ ...s, [name]: digitsOnly }));
    //   return;
    // }

    // setForm((s) => ({ ...s, [name]: value }));
  };

  // === HANDLE FILE UPLOAD ===
  const handleFile = (e) => {
    const { name, files } = e.target;
    setFiles((s) => ({ ...s, [name]: files && files[0] ? files[0] : null }));
  };

  // === RESET FORM ===
  const resetForm = () => {
    setEditingId(null);
    setForm({
      txtuser: "",
      txtmobile: "",
      txtaltno: "",
      txtwhatsapp: "",
      txtemail: "",
      txtaddress: "",
      txtgender: "Male",
      upass: "",
      role: "user",
    });
    setFiles({ uprofile: null, aadhar_front_photo: null, aadhar_back_photo: null });
    setMsg("");
  };

  // === VALIDATION ===
  const validate = () => {
    if (!form.txtuser) return "Name required";

    const nameRe = /^[A-Za-z\s]+$/;
    if (!nameRe.test(form.txtuser)) return "Name must contain only alphabets";

    if (!form.txtmobile) return "Mobile required";
    const mobileRe = /^[0-9+\-\s]{7,20}$/;
    if (!mobileRe.test(form.txtmobile)) return "Invalid mobile format";

    if (form.txtemail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.txtemail))
      return "Invalid email";

    if (!form.upass) return "Password required";

    // ✅ File validations (always required even if editing)
    if (!files.uprofile && !form.uprofile)
      return "Profile photo required";

    if (!files.aadhar_front_photo && !form.aadhar_front_photo)
      return "Aadhar front required";

    if (!files.aadhar_back_photo && !form.aadhar_back_photo)
      return "Aadhar back required";

    return null;
  };


  const checkDuplicates = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/check-duplicates', {
        mobile: form.txtmobile,
        alternate: form.txtaltno,
        whatsapp: form.txtwhatsapp,
        UID: editingId || null, // Pass current UID if editing
      });

      // Server should respond { success: true } if no duplicates
      return true;
    } catch (err) {
      const field = err.response?.data?.field; // server returns which field is duplicate
      if (field === "mobile") setMsg("duplicate_mobile");
      else if (field === "alternate") setMsg("duplicate_alt");
      else if (field === "whatsapp") setMsg("duplicate_whatsapp");
      else setMsg("Duplicate found");
      return false;
    }
  };



  // === SUBMIT FORM ===
  const submit = async (e) => {
    e.preventDefault();
    // ✅ Block re-submission if userId already exists
    if (userId && !editingId) {
      alert("Please first fill up other form.");
      return;
    }

    const v = validate();
    if (v) {
      setMsg(v);
      return;
    }
    // ✅ Check duplicates before sending form
    // const noDupes = await checkDuplicates();
    //if (!noDupes) return; // Stop if duplicates found


    // ✅ Check duplicates before sending form


    // if (!editingId) { // Only for new insertion
    //   try {
    //     await axios.post("http://localhost:5000/api/check-duplicates", {
    //       mobile: form.txtmobile,
    //       alternate: form.txtaltno,
    //       whatsapp: form.txtwhatsapp,
    //     });
    //   } catch (err) {
    //     const field = err.response?.data?.field;
    //     if (field === "mobile") setMsg("duplicate_mobile");
    //     else if (field === "alternate") setMsg("duplicate_alt");
    //     else if (field === "whatsapp") setMsg("duplicate_whatsapp");
    //     return; // stop submission
    //   }
    // }



    const fd = new FormData();
    Object.keys(form).forEach((key) => fd.append(key, form[key]));
    Object.keys(files).forEach((key) => {
      if (files[key]) fd.append(key, files[key]);
    });

    try {
      let res;
      let successMsg = "";

      if (editingId) {
        console.log("🔄 Updating ID:", editingId);
        res = await axios.put(`${API}/${editingId}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        successMsg = "✅ User updated successfully!";
      } else {
        res = await axios.post(API, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        successMsg = "✅ User created successfully!";
      }

      if (res.data?.success) {
        setMsg(successMsg);
      } else {
        setMsg(res.data?.message || "Operation failed");
      }

      // ✅ Save userId globally
      // if (res.data?.userId) {
      //   setUserId(res.data.userId);
      //   console.log("✅ User ID saved in context:", res.data.userId);
      // }
      if (res.data?.userId) {
        setUserId(res.data.userId);
        setUpass(res.data.upass); // ✅ Save password
        setUprofile(res.data?.uprofile || form.uprofile); // ✅ Save uploaded profile photo filename
        console.log("✅ User ID, upass, uprofile saved in context:", res.data.userId, form.upass, res.data?.uprofile);
      }
      fetchUsers();
      // ✅ Behavior difference: only go next tab on NEW insert
      setTimeout(() => {
        if (!editingId && typeof onNextTab === "function") {
          onNextTab();
        }
        resetForm(); // reset form in both cases
      }, 2000);
    } catch (err) {
      console.error("❌ Update error:", err.response?.data || err.message);
      const serverMsg = err.response?.data?.message;
      setMsg(serverMsg || "❌ Failed to save user");
    }
  };




  //=== SUBMIT FORM ===
  // const submit = async (e) => {
  //   e.preventDefault();

  //   const v = validate();
  //   if (v) {
  //     setMsg(v);
  //     return;
  //   }

  //   const fd = new FormData();
  //   Object.keys(form).forEach((key) => fd.append(key, form[key]));
  //   Object.keys(files).forEach((key) => {
  //     if (files[key]) fd.append(key, files[key]);
  //   });

  //   try {
  //     let res;
  //     let successMsg = "";

  //     // ✅ Case 1: Editing existing record
  //     if (editingId) {
  //       console.log("upadte id",editingId)
  //       res = await axios.put(`${API}/${editingId}`, fd, {
  //         headers: { "Content-Type": "multipart/form-data" },
  //       });
  //       successMsg = "✅ User updated successfully!";
  //     } 
  //     // ✅ Case 2: New insertion
  //     else {

  //       res = await axios.post(API, fd, {
  //         headers: { "Content-Type": "multipart/form-data" },
  //       });
  //       successMsg = "✅ User created successfully!";
  //     }

  //     // ✅ Show success message below button
  //     setMsg(successMsg);

  //     // ✅ Save userId globally
  //     if (res.data?.userId) {
  //       setUserId(res.data.userId);
  //       console.log("✅ User ID saved in context:", res.data.userId);
  //     }

  //     // ✅ Refresh data
  //     fetchUsers();

  //     // ✅ Wait 2 seconds, then move to next tab
  //     setTimeout(() => {
  //       if (typeof onNextTab === "function") {
  //         onNextTab();
  //       }
  //       resetForm();
  //     }, 2000);
  //   } catch (err) {
  //     console.error(err);
  //     const serverMsg = err.response?.data?.message;

  //     if (serverMsg === "duplicate_mobile") setMsg("duplicate_mobile");
  //     else if (serverMsg === "duplicate_alt") setMsg("duplicate_alt");
  //     else if (serverMsg === "duplicate_whatsapp") setMsg("duplicate_whatsapp");
  //     else setMsg(serverMsg || "Save failed");
  //   }
  // };


  // === EDIT USER ===
  const doEdit = (u) => {
    setEditingId(u.UID);
    setForm({
      txtuser: u.Uname || "",
      txtmobile: u.Umobile || "",
      txtaltno: u.alt_mobile || "",
      txtwhatsapp: u.whatsappno || "",
      txtemail: u.Email || "",
      txtaddress: u.address || "",
      txtgender: u.Gender || "Male",
      upass: u.upass || "",
      role: u.role || "user",
      uprofile: u.uprofile || "",
      aadhar_front_photo: u.aadhar_front_photo || "",
      aadhar_back_photo: u.aadhar_back_photo || "",
    });
    setFiles({ uprofile: null, aadhar_front_photo: null, aadhar_back_photo: null });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // === DELETE USER ===
  const doDelete = async (uid) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`${API}/${uid}`);
      fetchUsers();
    } catch (err) {
      alert("Delete failed");
    }
  };

  // === SEARCH ===
  const doSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUsers(search.trim(), 1); // send page = 1
  };


  return (
    <>


    
      {/*style={{ overflowX: "hidden", maxWidth: "100%" }}*/}
      {/* <div className="container mt-4" > */}
      <h3>User Form</h3>

      {userId && (
        <div className="alert alert-info">
          <strong>Current Logged-in User ID:</strong> {userId}
        </div>
      )}

      <div className="page-section">


        <div className="card mb-4">
          <div className="card-body">

            {/* === FORM === */}
            <form onSubmit={submit} encType="multipart/form-data" className="border p-3 mb-4">


              <div className="form-row">
                {/* USER NAME */}
                <div className="col-md-3 mb-2">
                  <label>User Name *</label>
                  <input
                    name="txtuser"
                    className="form-control"
                    value={form.txtuser}
                    onChange={handleChange}
                    placeholder="Enter alphabets only"
                  />
                  {msg === "Name required" && (
                    <small className="text-danger">Enter a user name</small>
                  )}
                  {msg === "Name must contain only alphabets" && (
                    <small className="text-danger">Only letters and spaces allowed</small>
                  )}
                </div>

                {/* MOBILE */}
                <div className="col-md-3 mb-2">
                  <label>Mobile *</label>
                  <input
                    name="txtmobile"
                    className={`form-control ${["txtmobile_invalid", "txtmobile_start_invalid", "duplicate_mobile"].includes(msg)
                      ? "is-invalid"
                      : ""
                      }`}
                    value={form.txtmobile}
                    onChange={handleChange}
                    maxLength="10"
                  />
                  {msg === "txtmobile_invalid" && (
                    <small className="text-danger">Please enter a valid 10-digit mobile number</small>
                  )}
                  {msg === "txtmobile_start_invalid" && (
                    <small className="text-danger">Mobile number should start with 7, 8, or 9</small>
                  )}
                  {msg === "duplicate_mobile" && (
                    <small className="text-danger">Duplicate mobile number not allowed</small>
                  )}
                </div>

                {/* ALTERNATE */}
                <div className="col-md-3 mb-2">
                  <label>Alternate</label>
                  <input
                    name="txtaltno"
                    className={`form-control ${["txtaltno_invalid", "txtaltno_start_invalid", "duplicate_alt"].includes(msg)
                      ? "is-invalid"
                      : ""
                      }`}
                    value={form.txtaltno}
                    onChange={handleChange}
                    maxLength="10"
                  />
                  {msg === "txtaltno_invalid" && (
                    <small className="text-danger">Please enter a valid 10-digit alternate number</small>
                  )}
                  {msg === "txtaltno_start_invalid" && (
                    <small className="text-danger">Alternate number should start with 7, 8, or 9</small>
                  )}
                  {msg === "duplicate_alt" && (
                    <small className="text-danger">Duplicate alternate number not allowed</small>
                  )}
                </div>

                {/* WHATSAPP */}
                <div className="col-md-3 mb-2">
                  <label>Whatsapp</label>
                  <input
                    name="txtwhatsapp"
                    className={`form-control ${["txtwhatsapp_invalid", "txtwhatsapp_start_invalid", "duplicate_whatsapp"].includes(msg)
                      ? "is-invalid"
                      : ""
                      }`}
                    value={form.txtwhatsapp}
                    onChange={handleChange}
                    maxLength="10"
                  />
                  {msg === "txtwhatsapp_invalid" && (
                    <small className="text-danger">Please enter a valid 10-digit WhatsApp number</small>
                  )}
                  {msg === "txtwhatsapp_start_invalid" && (
                    <small className="text-danger">WhatsApp number should start with 7, 8, or 9</small>
                  )}
                  {msg === "duplicate_whatsapp" && (
                    <small className="text-danger">Duplicate WhatsApp number not allowed</small>
                  )}
                </div>
              </div>
              <div className="form-row">
                {/* EMAIL */}
                <div className="col-md-3 mb-2">
                  <label>Email</label>
                  <input
                    name="txtemail"
                    type="email"
                    className="form-control"
                    value={form.txtemail}
                    onChange={handleChange}
                  />
                  {msg === "Invalid email" && (
                    <small className="text-danger">Invalid email</small>
                  )}
                </div>

                {/* GENDER */}
                <div className="col-md-3 mb-2">
                  <label>Gender *</label>
                  <select
                    name="txtgender"
                    className="form-control"
                    value={form.txtgender}
                    onChange={handleChange}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                {/* ADDRESS */}
                <div className="col-md-6 mb-2">
                  <label>Address *</label>
                  <textarea
                    name="txtaddress"
                    className="form-control"
                    value={form.txtaddress}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-row">
                {/* PROFILE PHOTO */}
                <div className="col-md-4 mb-2">
                  <label>Profile Photo *</label>
                  <input
                    type="file"
                    name="uprofile"
                    accept="image/*"
                    className="form-control"
                    onChange={handleFile}
                  />
                  {msg === "Profile photo required" && (
                    <small className="text-danger">Please select a profile photo</small>
                  )}
                  {editingId && form.uprofile && (
                    <img
                      src={`http://localhost:5000/uploads/photos/${form.uprofile}`}
                      alt="Current Profile"
                      width="80"
                      className="mt-2 border rounded"
                    />
                  )}

                </div>

                {/* AADHAR FRONT */}
                <div className="col-md-4 mb-2">
                  <label>Aadhar Front *</label>
                  <input
                    type="file"
                    name="aadhar_front_photo"
                    accept="image/*"
                    className="form-control"
                    onChange={handleFile}
                  />
                  {msg === "Aadhar front required" && (
                    <small className="text-danger">Please upload Aadhar front image</small>
                  )}
                  {editingId && form.aadhar_front_photo && (
                    <img
                      src={`http://localhost:5000/uploads/aadhar/${form.aadhar_front_photo}`}
                      alt="Aadhar Front"
                      width="80"
                      className="mt-2 border rounded"
                    />
                  )}
                </div>

                {/* AADHAR BACK */}
                <div className="col-md-4 mb-2">
                  <label>Aadhar Back *</label>
                  <input
                    type="file"
                    name="aadhar_back_photo"
                    accept="image/*"
                    className="form-control"
                    onChange={handleFile}
                  />
                  {msg === "Aadhar back required" && (
                    <small className="text-danger">Please upload Aadhar back image</small>
                  )}
                  {editingId && form.aadhar_back_photo && (
                    <img
                      src={`http://localhost:5000/uploads/aadhar/${form.aadhar_back_photo}`}
                      alt="Aadhar Back"
                      width="80"
                      className="mt-2 border rounded"
                    />
                  )}
                </div>
              </div>
              <div className="form-row">
                {/* PASSWORD */}
                <div className="col-md-4 mb-2">
                  <label>Password *</label>
                  <input
                    name="upass"
                    type="password"
                    className="form-control"
                    value={form.upass}
                    onChange={handleChange}
                  />
                  {msg === "Password required" && (
                    <small className="text-danger">Please enter a password</small>
                  )}
                </div>
              </div>
              <div className="form-row">
                <div className="col-md-12 mb-2">
                  <button className="btn btn-primary me-2" type="submit">
                    {editingId ? "Update" : "Save and Next"}
                  </button>
                  <button className="btn btn-secondary" type="button" onClick={resetForm}>
                    Reset
                  </button>
                  {/* ✅ Success or error message display */}
                  {msg && (msg.includes("successfully") || msg.includes("failed")) && (
                    <div className={`mt-3 alert ${msg.includes("successfully") ? "alert-success" : "alert-danger"}`}>
                      {msg}
                    </div>
                  )}
                </div>
              </div>


            </form>

          </div>

        </div>



      </div>




      <div className="card">
        <div className="card-body">
          {/* === SEARCH === */}
          <div className="d-flex mb-3">
            <input
              className="form-control me-5"
              placeholder="Search by UID or Mobile"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="btn btn-outline-primary" type="button" onClick={doSearch}>
              Search
            </button>
            <button
              className="btn btn-outline-secondary ms-2"
              type="button"
              onClick={() => {
                setSearch("");
                setPage(1); // reset page
                fetchUsers("", 1);
              }}
            >
              Clear
            </button>
          </div>


          <h5 className="text-center mb-3">All User Basic info</h5>

          {/* === TABLE === */}

          <div className="mobile-table-wrapper">
            <table className="table table-bordered table-striped align-middle">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>

                  <th>User Name</th>
                  <th>Mobile</th>
                  <th>Alternate</th>
                  <th>Whatsapp</th>
                  <th>Joining Date</th>
                  <th>Gender</th>
                  <th>Address</th>
                  <th>Profile</th>
                  <th>Aadhar Front</th>
                  <th>Aadhar Back</th>
                  <th>Password</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length ? (
                  users.map((u) => (
                    <tr key={u.UID}>
                      <td>{u.UID}</td>
                      <td>{u.Uname}</td>
                      <td>{u.Umobile}</td>
                      <td>{u.alt_mobile}</td>
                      <td>{u.whatsappno}</td>
                      <td>{u.jdate ? new Date(u.jdate).toLocaleString() : ""}</td>
                      <td>{u.Gender}</td>
                      <td>{u.address}</td>
                      <td>
                        {u.uprofile && (
                          <img
                            src={`http://localhost:5000/uploads/photos/${u.uprofile}`}
                            alt="Profile"
                            width="50"
                            className="rounded"
                          />
                        )}
                      </td>
                      <td>
                        {u.aadhar_front_photo && (
                          <img
                            src={`http://localhost:5000/uploads/aadhar/${u.aadhar_front_photo}`}
                            alt="Front"
                            width="50"
                          />
                        )}
                      </td>
                      <td>
                        {u.aadhar_back_photo && (
                          <img
                            src={`http://localhost:5000/uploads/aadhar/${u.aadhar_back_photo}`}
                            alt="Back"
                            width="50"
                          />
                        )}
                      </td>

                      <td>{u.upass}</td>
                      <td>
                        <button
                          className="btn btn-warning btn-sm me-2"
                          onClick={() => doEdit(u)}
                        >
                          ✏️
                        </button>
                        {/* <button
                      className="btn btn-danger btn-sm"
                      onClick={() => doDelete(u.UID)}
                    >
                      🗑️
                    </button> */}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="12" className="text-center">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="pagination mt-3">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="btn btn-outline-primary me-2"
              >
                Prev
              </button>

              <span className="m-2">Page {page} of {totalPages}</span>

              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="btn btn-outline-primary ms-2"
              >
                Next
              </button>
            </div>

          </div>

        </div>

      </div>




    </>
  );
}
