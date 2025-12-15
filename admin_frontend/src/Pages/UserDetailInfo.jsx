import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";

const UserDetailInfo = ({ onNextTab }) => {
const { userId, setCtid } = useUser();


  const [formData, setFormData] = useState({
    txtcast: "",
    txtscast: "",
    txtWeight: "",
    txtheight: "",
    txtVarn: "",
    txtbplace: "",
    txtDOB: "",
    txtbtime: "",
    txtmtype: "",
    txtbid: "",
    txtexpectation: "",
  });

  const [errors, setErrors] = useState({});
  const [casts, setCasts] = useState([]);
  const [subCasts, setSubCasts] = useState([]);
  const [heights, setHeights] = useState([]);
  const [marriageTypes, setMarriageTypes] = useState([]);
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);
  const [page, setPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);
const [search, setSearch] = useState("");

  //const { userId, setCtid } = useUser();

  // Fetch dropdown data
  useEffect(() => {
    fetch("http://localhost:5000/api/cast")
      .then((res) => res.json())
      .then(setCasts)
      .catch((err) => console.error("Error fetching casts:", err));

    fetch("http://localhost:5000/api/height/all")
      .then((res) => res.json())
      .then(setHeights)
      .catch((err) => console.error("Error fetching heights:", err));

    fetch("http://localhost:5000/api/marriage/all")
      .then((res) => res.json())
      .then(setMarriageTypes)
      .catch((err) => console.error("Error fetching marriage types:", err));
  }, []);
useEffect(() => {
  const fetchUsers = async () => {
    try {
      const queryParam = search ? `&search=${search}` : "";
      const res = await fetch(
        `http://localhost:5000/api/userdetails/all?page=${page}&limit=10&search=${search}`
      );
      const data = await res.json();
      setUsers(data.users || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  fetchUsers();
}, [userId, page, search]);


//   useEffect(() => {
//   fetch(`http://localhost:5000/api/userdetails/all?page=${page}&limit=10`)
//     .then((res) => res.json())
//     .then((data) => {
//       setUsers(data.users || []);
//       setTotalPages(data.totalPages || 1);
//     })
//     .catch((err) => console.error("Error fetching users:", err));
// }, [userId, page]);

  // Load user details + all records
  // useEffect(() => {


  //   fetch("http://localhost:5000/api/userdetails/all")
  //     .then((res) => res.json())
  //     .then(setUsers)
  //     .catch((err) => console.error("Error fetching all users:", err));
  // }, [userId]);

  // Handle input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));

    if (name === "txtcast" && value) {
      fetch(`http://localhost:5000/api/cast/${value}/subcasts`)
        .then((res) => res.json())
        .then(setSubCasts)
        .catch((err) => console.error("Error fetching subcasts:", err));
    }
  };

  // Validate
  const validateForm = () => {
    const newErrors = {};

    if (!formData.txtcast) newErrors.txtcast = "Please select a Cast";
    if (!formData.txtscast) newErrors.txtscast = "Please select a Subcast";
    if (!formData.txtbplace.trim()) newErrors.txtbplace = "Birthplace is required";
    if (!formData.txtDOB.trim()) newErrors.txtDOB = "Date of Birth is required";
    if (!formData.txtbtime.trim()) newErrors.txtbtime = "Birth Time is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit (Insert or Update)
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!userId && !currentEditId) {
    alert("⚠️ Please fill User Basic Info form first!");
    return;
  }

  if (!validateForm()) return;

  const activeUserId = currentEditId || userId;
  setLoading(true);

  try {
    const formattedDOB = formData.txtDOB;

    const payload = {
      CTID: formData.txtcast,
      SCTID: formData.txtscast,
      weight: formData.txtWeight,
      height: formData.txtheight,
      varn: formData.txtVarn,
      birthplace: formData.txtbplace,
      DOB: formattedDOB,
      dob_time: formData.txtbtime,
      marriage_type: formData.txtmtype,
      bloodgroup: formData.txtbid,
      Expectation: formData.txtexpectation,
    };

    const method = currentEditId ? "PUT" : "POST";
    const res = await fetch(`http://localhost:5000/api/userdetails/${activeUserId}`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.message || "❌ Failed to save data");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    // ✅ Set success message
    const successMsg = currentEditId
      ? "✅ Data updated successfully!"
      : "✅ Data inserted successfully!";
    setMessage(successMsg);

    // ✅ Refresh list
    const updatedUsers = await fetch(
      `http://localhost:5000/api/userdetails/all?page=${page}&limit=10`
    ).then((res) => res.json());
    setUsers(updatedUsers.users || []);
    setTotalPages(updatedUsers.totalPages || 1);

    // ✅ Reset form and edit state
    setFormData({
      txtcast: "",
      txtscast: "",
      txtWeight: "",
      txtheight: "",
      txtVarn: "",
      txtbplace: "",
      txtDOB: "",
      txtbtime: "",
      txtmtype: "",
      txtbid: "",
      txtexpectation: "",
    });
    setCurrentEditId(null);

    // ✅ Update Cast ID globally
    if (formData.txtcast) setCtid(formData.txtcast);

    // 🟢 Only go to next tab on INSERT (not update)
    if (!currentEditId && typeof onNextTab === "function") {
      setTimeout(() => {
        setMessage("");
        onNextTab();
      }, 2000); // wait 2 seconds
    } else {
      // Just clear message if it's an update
      setTimeout(() => setMessage(""), 2000);
    }
  } catch (err) {
    console.error("Error saving data:", err);
    setMessage("❌ Failed to save data");
  } finally {
    setLoading(false);
  }
};

// const handleSubmit = async (e) => {
//   e.preventDefault();

//   if (!userId && !currentEditId) {
//     alert("⚠️ Please fill User Basic Info form first!");
//     return;
//   }

//   if (!validateForm()) return;

//   const activeUserId = currentEditId || userId;
//   setLoading(true);

//   try {
//     // Keep DOB format as yyyy-mm-dd
//     const formattedDOB = formData.txtDOB;

//     const payload = {
//       CTID: formData.txtcast,
//       SCTID: formData.txtscast,
//       weight: formData.txtWeight,
//       height: formData.txtheight,
//       varn: formData.txtVarn,
//       birthplace: formData.txtbplace,
//       DOB: formattedDOB,
//       dob_time: formData.txtbtime,
//       marriage_type: formData.txtmtype,
//       bloodgroup: formData.txtbid,
//       Expectation: formData.txtexpectation,
//     };

//     const method = currentEditId ? "PUT" : "POST";
//     const res = await fetch(`http://localhost:5000/api/userdetails/${activeUserId}`, {
//       method,
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload),
//     });

//     const data = await res.json();
//    // ✅ Check HTTP status — handle duplicate or error properly
//     if (!res.ok) {
//       setMessage(data.message || "❌ Failed to save data");
//       setTimeout(() => setMessage(""), 3000);
//       return;
//     }

//     // ✅ Success message depending on mode
//     const successMsg = currentEditId
//       ? "✅ Data updated successfully!"
//       : "✅ Data inserted successfully!";
//     setMessage(successMsg);

//     // ✅ Wait 2 seconds before switching tab
//     setTimeout(() => {
//       setMessage(""); // clear message
//       if (typeof onNextTab === "function") onNextTab();
//     }, 3000);

//     // ✅ Update Cast ID globally if present
//     if (formData.txtcast) setCtid(formData.txtcast);

//     // ✅ Refresh list immediately
//     const updatedUsers = await fetch("http://localhost:5000/api/userdetails/all").then((res) =>
//       res.json()
//     );
//     setUsers(updatedUsers);

//     // ✅ Reset form and edit mode
//     setFormData({
//       txtcast: "",
//       txtscast: "",
//       txtWeight: "",
//       txtheight: "",
//       txtVarn: "",
//       txtbplace: "",
//       txtDOB: "",
//       txtbtime: "",
//       txtmtype: "",
//       txtbid: "",
//       txtexpectation: "",
//     });

//     setCurrentEditId(null);

//     // 🟢 Only go to next tab on INSERT (not update)
//     if (!currentEditId && typeof onNextTab === "function") {
//       setTimeout(() => {
//         setMessage("");
//         onNextTab();
//       }, 2000); // wait 2 seconds
//     } else {
//       // Just clear message if it's an update
//       setTimeout(() => setMessage(""), 2000);
//     }
//   } catch (err) {
//     console.error("Error saving data:", err);
//     setMessage("❌ Failed to save data");
//   } finally {
//     setLoading(false);
//   }
// };



  const handleEdit = (user) => {
    setCurrentEditId(user.UID);
    setFormData({
      txtcast: user.CTID || "",
      txtscast: user.SCTID || "",
      txtWeight: user.weight || "",
      txtheight: user.height || "",
      txtVarn: user.varn || "",
      txtbplace: user.birthplace || "",
      txtDOB: user.DOB ? user.DOB.split("T")[0] : "",
      txtbtime: user.dob_time || "",
      txtmtype: user.marriage_type || "",
      txtbid: user.bloodgroup || "",
      txtexpectation: user.Expectation || "",
    });

    if (user.CTID) {
      fetch(`http://localhost:5000/api/cast/${user.CTID}/subcasts`)
        .then((res) => res.json())
        .then((data) => {
          setSubCasts(data);
          setFormData((prev) => ({ ...prev, txtscast: user.SCTID || "" }));
        })
        .catch((err) => console.error("Error fetching subcasts:", err));
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ✅ Cancel Update
  const handleCancel = () => {
    setCurrentEditId(null);
    setFormData({
      txtcast: "",
      txtscast: "",
      txtWeight: "",
      txtheight: "",
      txtVarn: "",
      txtbplace: "",
      txtDOB: "",
      txtbtime: "",
      txtmtype: "",
      txtbid: "",
      txtexpectation: "",
    });
    setMessage("✖️ Update canceled");
  };

  // Delete
  const handleDelete = async (uid) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/userdetails/${uid}`, { method: "DELETE" });
      const data = await res.json();
      setMessage(data.message || "✅ Deleted successfully");
      setTimeout(() => setMessage(""), 3000);
      setUsers((prev) => prev.filter((u) => u.UID !== uid));
    } catch (err) {
      console.error("Error deleting user:", err);
      setMessage("❌ Delete failed");
    }
  };
const doSearch = (e) => {
  e.preventDefault();
  setPage(1); // reset to first page when searching
};

  return (
    <div className="container mt-4" style={{ overflowX: "hidden", maxWidth: "100%" }}>
      <h4 className="mb-3">
        {currentEditId ? "Update User Details" : "Add User Details"}
      </h4>

      {message && <div className="alert alert-info text-center p-2">{message}</div>}

      <form onSubmit={handleSubmit}>
        <div className="row">
          {/* Cast */}
          <div className="col-md-3 mb-2">
            <label>Cast *</label>
            <select className="form-control" name="txtcast" value={formData.txtcast} onChange={handleChange}>
              <option value="">Select Cast</option>
              {casts.map((c) => (
                <option key={c.CTID} value={c.CTID}>
                  {c.Cast}
                </option>
              ))}
            </select>
            {errors.txtcast && <div className="text-danger small">{errors.txtcast}</div>}
          </div>

          {/* Subcast */}
          <div className="col-md-3 mb-2">
            <label>Subcast *</label>
            <select className="form-control" name="txtscast" value={formData.txtscast} onChange={handleChange}>
              <option value="">Select Subcast</option>
              {subCasts.map((s) => (
                <option key={s.SCTID} value={s.SCTID}>
                  {s.Subcast}
                </option>
              ))}
            </select>
            {errors.txtscast && <div className="text-danger small">{errors.txtscast}</div>}
          </div>

          {/* Birthplace */}
          <div className="col-md-3 mb-2">
            <label>Birth Place *</label>
            <input type="text" name="txtbplace" className="form-control" value={formData.txtbplace} onChange={handleChange} />
            {errors.txtbplace && <div className="text-danger small">{errors.txtbplace}</div>}
          </div>

          {/* DOB */}
          <div className="col-md-3 mb-2">
            <label>Date of Birth *</label>
            <input type="date" name="txtDOB" className="form-control" value={formData.txtDOB} onChange={handleChange} />
            {errors.txtDOB && <div className="text-danger small">{errors.txtDOB}</div>}
          </div>

          {/* Birth Time */}
          <div className="col-md-3 mb-2">
            <label>Birth Time *</label>
            <input type="time" name="txtbtime" className="form-control" value={formData.txtbtime} onChange={handleChange} />
            {errors.txtbtime && <div className="text-danger small">{errors.txtbtime}</div>}
          </div>

          {/* Marriage Type */}
          <div className="col-md-3 mb-2">
            <label>Marriage Type</label>
            <select className="form-control" name="txtmtype" value={formData.txtmtype} onChange={handleChange}>
              <option value="">Select Marriage Type</option>
              {marriageTypes.map((m) => (
                <option key={m.MRID} value={m.Marriage}>
                  {m.Marriage}
                </option>
              ))}
            </select>
          </div>

          {/* Weight */}
          <div className="col-md-3 mb-2">
            <label>Weight</label>
            <input type="text" name="txtWeight" className="form-control" value={formData.txtWeight} onChange={handleChange} />
          </div>

          {/* Height */}
          <div className="col-md-3 mb-2">
            <label>Height</label>
            <select className="form-control" name="txtheight" value={formData.txtheight} onChange={handleChange}>
              <option value="">Select Height</option>
              {heights.map((h) => (
                <option key={h.HEID} value={h.Height}>
                  {h.Height}
                </option>
              ))}
            </select>
          </div>

          {/* Varn */}
          <div className="col-md-3 mb-2">
            <label>Varn</label>
            <select className="form-control" name="txtVarn" value={formData.txtVarn} onChange={handleChange}>
              <option value="">Select Varn</option>
              <option value="गोरा">गोरा</option>
              <option value="सावळा">सावळा</option>
              <option value="काळा">काळा</option>
            </select>
          </div>

          {/* Blood Group */}
          <div className="col-md-3 mb-2">
            <label>Blood Group</label>
            <select className="form-control" name="txtbid" value={formData.txtbid} onChange={handleChange}>
              <option value="">Select Blood Group</option>
              {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((bg) => (
                <option key={bg} value={bg}>
                  {bg}
                </option>
              ))}
            </select>
          </div>

          {/* Expectation */}
          <div className="col-12 mb-3">
            <label>Expectation</label>
            <textarea
              name="txtexpectation"
              className="form-control"
              rows="3"
              value={formData.txtexpectation}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="text-center">
            <button type="submit" className="btn btn-primary me-2" disabled={loading}>
              {loading ? "Saving..." : currentEditId ? "Update" : "Save and Next"}
            </button>
                
            {currentEditId && (
              <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                Reset
              </button>
            )}
          </div>
        </div>
      </form>

      <hr />
<form className="d-flex mb-3" onSubmit={doSearch}>
  <input
    className="form-control me-2"
    placeholder="Search by UID"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />
  <button className="btn btn-outline-primary" type="submit">
    Search
  </button>
  <button
    className="btn btn-outline-secondary ms-2"
    type="button"
    onClick={() => {
      setSearch("");
      setPage(1);
    }}
  >
    Clear
  </button>
</form>



      <h5 className="text-center mb-3">All User Records</h5>

      <div className="table-responsive">
        <table className="table table-bordered text-center align-middle">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Cast</th>
              <th>Subcast</th>
              <th>Weight</th>
              <th>Height</th>
              <th>Varn</th>
              <th>Birthplace</th>
              <th>DOB</th>
              <th>Birth Time</th>
              <th>Marriage Type</th>
              <th>Blood Group</th>
              <th>Expectation</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((u) => (
                <tr key={u.UID}>
                  <td>{u.UID}</td>
                  <td>{u.cast_name || "-"}</td>
                  <td>{u.subcast_name || "-"}</td>
                  <td>{u.weight || "-"}</td>
                  <td>{u.height || "-"}</td>
                  <td>{u.varn || "-"}</td>
                  <td>{u.birthplace || "-"}</td>
                  <td>{u.DOB ? u.DOB.split("T")[0] : "-"}</td>
                  <td>{u.dob_time || "-"}</td>
                  <td>{u.marriage_type || "-"}</td>
                  <td>{u.bloodgroup || "-"}</td>
                  <td>{u.Expectation || "-"}</td>
                  <td>
                    <button onClick={() => handleEdit(u)} className="btn btn-sm btn-warning me-2">
                      ✏️
                    </button>
                    {/* <button onClick={() => handleDelete(u.UID)} className="btn btn-sm btn-danger">
                      🗑️
                    </button> */}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="13">No records found.</td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="pagination mt-3">
  <button
    className="btn btn-outline-primary me-2"
    disabled={page <= 1}
    onClick={() => setPage(page - 1)}
  >
    ◀ Previ
  </button>

  <span className="m-2">
    Page {page} of {totalPages}
  </span>

  <button
    className="btn btn-outline-primary ms-2"
    disabled={page >= totalPages}
    onClick={() => setPage(page + 1)}
  >
    Next ▶
  </button>
</div>

      </div>
    </div>
  );
};

export default UserDetailInfo;
