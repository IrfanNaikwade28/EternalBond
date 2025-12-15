import React, { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";

const API_BASE = "http://localhost:5000/api";
const alphaOnly = /^[A-Za-z\s]+$/;

const emptyForm = {
  txtuser: "",
  txtFather: "",
  txtMother: "",
  txtFOccupation: "",
  txtMOccupation: "",
  txtBrother: "",
  txtBOccupation: "",
  txtSitser: "",
  txtProperty: "",
  txtOtherDetails: "",
  FID: null,
  UID: null,
};

export default function FamilyCRUD({ onNextTab }) {
  const { userId } = useUser();
  const [list, setList] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [page, setPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);
const { setFatherName, setMotherName } = useUser();
const [search, setSearch] = useState("");

const fetchAll = async (pageNum = 1, searchTerm = search) => {
  setLoading(true);
  try {
    const res = await fetch(`${API_BASE}/families?page=${pageNum}&limit=10&search=${searchTerm}`);
    const data = await res.json();

    setList(data.data || []);
    setTotalPages(data.pagination?.totalPages || 1);
    setPage(data.pagination?.currentPage || 1);
  } catch (err) {
    console.error(err);
    setMsg("Error fetching families");
  } finally {
    setLoading(false);
  }
};



//  const fetchAll = async (pageNum = 1) => {
//   setLoading(true);
//   try {
//     const res = await fetch(`${API_BASE}/families?page=${pageNum}&limit=10`);
//     const data = await res.json();

//     setList(data.data || []);
//     setTotalPages(data.pagination?.totalPages || 1);
//     setPage(data.pagination?.currentPage || 1);
//   } catch (err) {
//     console.error(err);
//     setMsg("Error fetching families");
//   } finally {
//     setLoading(false);
//   }
// };
//const { user } = useUser();

useEffect(() => {
  const fetchUserName = async () => {
    if (!userId) return; // no user selected yet

    try {
      const res = await fetch(`${API_BASE}/users/${userId}`);
      const data = await res.json();
  console.log("Fetched User Data:", data); // ✅ Console check here
      // assuming your backend route returns { UID, uname, ... }
      setForm((prev) => ({
        ...prev,
        UID: data.UID,
        txtuser: data.Uname || "",

      }));
    } catch (err) {
      console.error("Error fetching username:", err);
    }
  };

  fetchUserName();
}, [userId]);


  useEffect(() => {
    fetchAll();
  }, [page]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const validate = () => {
    if (!alphaOnly.test(form.txtFather || "")) {
      setMsg("Father name required and  must contain only letters and spaces");
      return false;
    }
    if (!alphaOnly.test(form.txtMother || "")) {
      setMsg("Mother name required and must contain only letters and spaces");
      return false;
    }
    if (!alphaOnly.test(form.txtFOccupation || "")) {
      setMsg("Father occupation required and  must contain only letters and spaces");
      return false;
    }
    return true;
  };

//   const onAddClick = () => {
//   setForm((p) => ({
//     ...emptyForm,
//     UID: userId || null,
//     txtuser: form.txtuser || "", // already set from useEffect
   
//   }));
//   setEditing(false);
//   setMsg("");
// };

const submitAdd = async (e) => {
  e.preventDefault();
  setMsg("");

  // 🔹 Basic validation
  if (!userId) {
    alert("Please fill basic user info first (user not found).");
    return;
  }

  // 🔹 Required family info check
  if (!form.txtFather || !form.txtMother|| !form.txtFOccupation) {
    alert("Please fill Family tab details completely before saving.");
    return;
  }

  if (!validate()) return;

  const payload = {
    UID: userId,
    txtFather: form.txtFather,
    txtMother: form.txtMother,
    txtBrother: form.txtBrother,
    txtSitser: form.txtSitser,
    txtFOccupation: form.txtFOccupation,
    txtMOccupation: form.txtMOccupation,
    txtBOccupation: form.txtBOccupation,
    txtProperty: form.txtProperty,
    txtOtherDetails: form.txtOtherDetails,
  };

  try {
    const res = await fetch(`${API_BASE}/family`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      setMsg(data.message || "❌ Error adding");
    } else {
      setMsg(data.message || "✅ Family details saved successfully");
      fetchAll();

      // ✅ Update context before clearing form
      setFatherName(form.txtFather);
      setMotherName(form.txtMother);

      // ✅ Smooth UX: Wait 2 seconds → then clear form & move tab
      setTimeout(() => {
        setMsg(""); // clear success message
        setForm(emptyForm);
        if (typeof onNextTab === "function") {
          onNextTab();
        }
      }, 2000);
    }
  } catch (err) {
    console.error(err);
    setMsg("Network error");
    setTimeout(() => setMsg(""), 2000); // hide after 2 seconds
  }
};



  const onEdit = (item) => {
    setForm({
      txtuser: item.uname || "",
      txtFather: item.Father || "",
      txtMother: item.Mother || "",
      txtFOccupation: item.father_occupation || "",
      txtMOccupation: item.mother_occupation || "",
      txtBrother: item.Brother || "",
      txtBOccupation: item.brother_occupation || "",
      txtSitser: item.Sister || "",
      txtProperty: item.property_details || "",
      txtOtherDetails: item.other_details || "",
      FID: item.FID,
      UID: item.UID,
    });
    setEditing(true);
    setMsg("");
  };

  const submitEdit = async (e) => {
  e.preventDefault();
  setMsg("");

  if (!validate()) return;

  const payload = {
    txtFather: form.txtFather,
    txtMother: form.txtMother,
    txtBrother: form.txtBrother,
    txtSitser: form.txtSitser,
    txtFOccupation: form.txtFOccupation,
    txtMOccupation: form.txtMOccupation,
    txtBOccupation: form.txtBOccupation,
    txtProperty: form.txtProperty,
    txtOtherDetails: form.txtOtherDetails,
  };

  try {
    const res = await fetch(`${API_BASE}/family/${form.FID}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      setMsg(data.message || "❌ Update failed");
      // auto-hide error message
      setTimeout(() => setMsg(""), 2000);
    } else {
      setMsg(data.message || "✅ Family details updated successfully");
      fetchAll();

      // ✅ Smooth UX: hide message after 2 sec, reset form
      setTimeout(() => {
        setMsg(""); // clear success message
        setForm(emptyForm);
        setEditing(false);
      }, 2000);
    }
  } catch (err) {
    console.error(err);
    setMsg("Network error");
    setTimeout(() => setMsg(""), 2000); // hide after 2 seconds
  }
};

  const onDelete = async (fid) => {
    if (!window.confirm("Delete this record?")) return;
    try {
      const res = await fetch(`${API_BASE}/family/${fid}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) setMsg(data.message || "Delete failed");
      else {
        setMsg(data.message);
        fetchAll();
        setTimeout(() => {
        setMsg(""); // clear success message
        setForm(emptyForm);
        setEditing(false);
      }, 2000);
      }
    } catch (err) {
      console.error(err);
      setMsg("Network error");
    }
  };

  return (
    <div className="container mt-4 " style={{ overflowX: "hidden", maxWidth: "100%" }}>
      <h4 className="mb-3 fw-bold">
        {editing ? "Edit Family Details" : "Add Family Details"}
      </h4>

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          {msg && <div className="alert alert-info">{msg}</div>}

          <form onSubmit={editing ? submitEdit : submitAdd}>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label fw-semibold">User Name</label>
                <input
                  name="txtuser"
                  className="form-control"
                  value={form.txtuser}
                  onChange={handleChange}
                  readOnly
                />
              </div>

              <div className="col-md-4">
                <label className="form-label fw-semibold">Father Name</label>
                <input
                  name="txtFather"
                  className="form-control"
                  value={form.txtFather}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label fw-semibold">Mother Name</label>
                <input
                  name="txtMother"
                  className="form-control"
                  value={form.txtMother}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label fw-semibold">Father Occupation</label>
                <input
                  name="txtFOccupation"
                  className="form-control"
                  value={form.txtFOccupation}
                  onChange={handleChange}
                   required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label fw-semibold">Mother Occupation</label>
                <input
                  name="txtMOccupation"
                  className="form-control"
                  value={form.txtMOccupation}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-4">
                <label className="form-label fw-semibold">Brother Name</label>
                <input
                  name="txtBrother"
                  className="form-control"
                  value={form.txtBrother}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-4">
                <label className="form-label fw-semibold">Brother Occupation</label>
                <input
                  name="txtBOccupation"
                  className="form-control"
                  value={form.txtBOccupation}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-4">
                <label className="form-label fw-semibold">Sister Name</label>
                <input
                  name="txtSitser"
                  className="form-control"
                  value={form.txtSitser}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-4">
                <label className="form-label fw-semibold">Property Details</label>
                <input
                  name="txtProperty"
                  className="form-control"
                  value={form.txtProperty}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-12">
                <label className="form-label fw-semibold">Other Details</label>
                <textarea
                  name="txtOtherDetails"
                  className="form-control"
                  rows="2"
                  value={form.txtOtherDetails}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>

            <div className="mt-2" >
              <button type="submit" className="btn btn-primary">
                {editing ? "Update" : "Save and Next"}
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => {
                  setForm(emptyForm);
                  setEditing(false);
                }}
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Table Section */}
      <div className="card shadow-sm border-0">
        <div className="card-body">
          {/* <h5 className="fw-semibold mb-3">Family Records</h5> */}

         
  <h5 className="mb-3">Family Records</h5>
 <div className="d-flex align-items-center w-100 mb-3">
  <div className="input-group">
    <input
      type="text"
      className="form-control"
      placeholder="🔍 Search by UID"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
    <button
      className="btn btn-primary"
      type="button"
      onClick={() => fetchAll(1, search)}
    >
      Search
    </button>
    <button
      className="btn btn-outline-secondary"
      type="button"
      onClick={() => {
        setSearch("");
        fetchAll(1, "");
      }}
    >
      Clear
    </button>
  </div>
</div>
 <h5 className="text-center mb-3">All User Family Info info</h5>
          {loading ? (
            <p>Loading...</p>
          ) : (
         
           
            <div className="table-responsive">
       <table className="table table-striped text-center align-middle w-100">
          <thead className="table-dark">
                  <tr>
                    <th>UId</th>
                    <th>FID</th>
                    <th>User</th>
                    <th>Father</th>
                    <th>Father Occupation</th>
                    <th>Mother</th>
                     <th>Mother Occupation</th>
                    <th>Brother</th>
                    <th>Brother Occupation</th>
                    <th>Sister</th>
                    <th>Property Details</th>
                     <th>Other Details</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {list.length === 0 && (
                    <tr>
                      <td colSpan="7" className="text-center text-muted">
                        No records found
                      </td>
                    </tr>
                  )}
                  {list.map((r) => (
                    <tr key={r.FID}>
                      <td>{r.UID}</td>
                      <td>{r.FID}</td>
                      <td>{r.uname}</td>
                      <td>{r.Father}</td>
                      <td>{r.father_occupation}</td>
                      <td>{r.Mother}</td>
                       <td>{r.mother_occupation}</td>
                      <td>{r.Brother}</td>
                       <td>{r.brother_occupation}</td>
                      <td>{r.Sister}</td>
                      <td>{r.property_details}</td>
                      <td>{r.other_details}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-warning me-2"
                          onClick={() => onEdit(r)}
                        >
                          ✏️
                        </button>
                        {/* <button
                          className="btn btn-sm btn-danger"
                          onClick={() => onDelete(r.FID)}
                        >
                          🗑️
                        </button> */}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Pagination Controls */}
<div className=" mt-3">
 <button
  className="btn btn-outline-primary btn-sm"
  disabled={page <= 1}
  onClick={() => fetchAll(page - 1, search)}
>
  ◀ Previous
</button>

<span className="m-2">
  Page {page} of {totalPages}
</span>

<button
  className="btn btn-outline-primary btn-sm"
  disabled={page >= totalPages}
  onClick={() => fetchAll(page + 1, search)}
>
  Next ▶
</button>

</div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
