import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useUser } from "../context/UserContext"; // ✅ use your context

const EducationWorkInfo = ({ onNextTab }) => {
  const { user } = useUser(); // { userId, ctid, fatherName, motherName }
 const { 
  userId, setUserId, 
  EDID, setEDID, 
  CNID, setCNID, 
  DSID, setDSID, 
  INID, setINID 
} = useUser();


  const emptyForm = {
    UID: "",
    EDID: "",
    education_details: "",
    CNID: "",
    STID: "",
    DSID: "",
    INID: "",
    fincome: "",
    current_work: "",
  };

  const [formData, setFormData] = useState(emptyForm);
  const [educationList, setEducationList] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [records, setRecords] = useState([]);
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState(null);
  const formRef = useRef(null);
  const [page, setPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);

const [searchUID, setSearchUID] = useState("");
  // ⚠️ Lock tab check — userId must exist + father/mother name filled
  useEffect(() => {
    console.log("Context check:", user);
  }, [user]);

useEffect(() => {
  console.log("Context Values:", { EDID, CNID, DSID, INID });
}, [EDID, CNID, DSID, INID]);
  // 🔹 Fetch Education List
  useEffect(() => {
    axios.get("http://localhost:5000/api/education/all")
      .then(res => setEducationList(res.data))
      .catch(err => console.error("Error loading education:", err));
  }, []);

  // 🔹 Fetch Countries
  useEffect(() => {
    axios.get("http://localhost:5000/api/location/countries")
      .then(res => setCountries(res.data))
      .catch(err => console.error("Error loading countries:", err));
  }, []);

  // 🔹 Fetch All Records
const fetchRecords = (pageNumber = 1) => {
  axios
    .get(`http://localhost:5000/api/education-work`, {
    params: { page, limit: 10, uid: searchUID.trim() || undefined }
  })
    .then((res) => {
      console.log("Fetched Records:", res.data);
      setRecords(res.data.data || []); // ✅ backend sends {data:[...]}
      setPage(res.data.currentPage);
      setTotalPages(res.data.totalPages);
    })
    .catch((err) => {
      console.error("Error fetching records:", err);
      setRecords([]);
    });
};

useEffect(() => {
  fetchRecords(page);
}, [page]);

  // 🔹 Dropdown handling
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === "CNID") {
      axios.get(`http://localhost:5000/api/location/states/${value}`)
        .then(res => setStates(res.data));
      setDistricts([]);
    }

    if (name === "STID") {
      axios.get(`http://localhost:5000/api/location/districts/${value}`)
        .then(res => setDistricts(res.data));
    }
  };

  // 🔹 Submit Form
  const handleSubmit = async (e) => {
  e.preventDefault();

  const form = formRef.current;
  if (!form.checkValidity()) {
    form.classList.add("was-validated");
    return;
  }

  const payload = { ...formData, UID: userId };

  try {
    let res;
    if (editId) {
      // 🔹 Update existing record
      res = await axios.put(
        `http://localhost:5000/api/education-work/${editId}`,
        payload
      );
    } else {
      // 🔹 Insert (update existing UID with new info)
      res = await axios.post(
        `http://localhost:5000/api/education-work/${userId}`,
        payload
      );
    }

    setMessage(res.data.message);
    if (res.data.success) {
      setEDID(formData.EDID);
      setCNID(formData.CNID);
      setDSID(formData.DSID);
      setINID(formData.INID);
    }

    setFormData(emptyForm);
    setEditId(null);
    form.classList.remove("was-validated");
    fetchRecords();
     // ✅ Only move to next tab after 2 seconds
      setTimeout(() => {
        setMessage(null);
        // Only go next if not editing
        if (!editId && typeof onNextTab === "function") {
          onNextTab();
        }
      }, 2000);
   
    
  } catch (err) {
    console.error("Save Error:", err.response ? err.response.data : err);
    setMessage(err.response?.data?.message || "Error saving data");
  }
};


  // 🔹 Edit Record
  // 🔹 Edit Record
const handleEdit = (rec) => {
  setEditId(rec.UID);
  console.log("edit id",rec.UID)
  setFormData({
    UID: rec.UID,
    EDID: rec.EDID,
    education_details: rec.education_details || "",
    CNID: rec.CNID,
    STID: rec.STID,
    DSID: rec.DSID,
    INID: rec.INID,
    fincome: rec.fincome,
    current_work: rec.current_work || "",
  });

  // ✅ Fetch dependent dropdowns
  if (rec.CNID) {
    axios.get(`http://localhost:5000/api/location/states/${rec.CNID}`)
      .then(res => {
        setStates(res.data);

        // Fetch districts only after states are loaded
        if (rec.STID) {
          axios.get(`http://localhost:5000/api/location/districts/${rec.STID}`)
            .then(res2 => setDistricts(res2.data));
        }
      });
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
};


  // 🔹 Delete Record
  const handleDelete = (uid) => {
  if (!window.confirm("Are you sure you want to delete this record?")) return;

  axios
    .delete(`http://localhost:5000/api/education-work/${uid}`)
    .then((res) => {
      setMessage(res.data.message);
      fetchRecords();
    })
    .catch((err) =>
      setMessage(err.response?.data?.message || "Error deleting data")
    );
};
  // 🔹 Auto clear messages
  useEffect(() => {
    if (message) {
      const t = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(t);
    }
  }, [message]);

  return (
    <div div className="container mt-4" style={{ overflowX: "hidden", maxWidth: "100%" }}>
      {/* Form Section */}
      <div className="card mb-4">
        <div className="card-body">
          <h3>{editId ? "Edit Education & Work Info" : "Add Education & Work Info"}</h3>
          {message && <div className="alert alert-info">{message}</div>}

          <form ref={formRef} className="needs-validation" noValidate onSubmit={handleSubmit}>
            <div className="form-row">
              {/* Country */}
              <div className="col-md-3 mb-3">
                <label>Country</label>
                <select
                  name="CNID"
                  value={formData.CNID}
                  onChange={handleChange}
                  className="form-control"
                  required
                >
                  <option value="">Select Country</option>
                  {countries.map(c => (
                    <option key={c.CNID} value={c.CNID}>{c.Country}</option>
                  ))}
                </select>
                <div className="invalid-feedback">Please select country.</div>
              </div>

              {/* State */}
              <div className="col-md-3 mb-3">
                <label>State</label>
                <select
                  name="STID"
                  value={formData.STID}
                  onChange={handleChange}
                  className="form-control"
                  required
                >
                  <option value="">Select State</option>
                  {states.map(s => (
                    <option key={s.STID} value={s.STID}>{s.State}</option>
                  ))}
                </select>
                <div className="invalid-feedback">Please select state.</div>
              </div>

              {/* District */}
              <div className="col-md-3 mb-3">
                <label>District</label>
                <select
                  name="DSID"
                  value={formData.DSID}
                  onChange={handleChange}
                  className="form-control"
                  required
                >
                  <option value="">Select District</option>
                  {districts.map(d => (
                    <option key={d.DSID} value={d.DSID}>{d.District}</option>
                  ))}
                </select>
                <div className="invalid-feedback">Please select district.</div>
              </div>

              {/* Education */}
              <div className="col-md-3 mb-3">
                <label>Education</label>
                <select
                  name="EDID"
                  value={formData.EDID}
                  onChange={handleChange}
                  className="form-control"
                  required
                >
                  <option value="">Select Education</option>
                  {educationList.map(e => (
                    <option key={e.EDID} value={e.EDID}>{e.Education}</option>
                  ))}
                </select>
                <div className="invalid-feedback">Please select education.</div>
              </div>
            </div>

            {/* Row 2 */}
            <div className="form-row">
              <div className="col-md-3 mb-3">
                <label>Education Details</label>
                <textarea
                  name="education_details"
                  className="form-control"
                  value={formData.education_details}
                  onChange={handleChange}
                  rows="1"
                ></textarea>
              </div>

              <div className="col-md-3 mb-3">
                <label>Income Range</label>

{/* <select
                  name="INID"
                  value={formData.INID}
                  onChange={handleChange}
                  className="form-control"
                  required
                >
                  <option value="0">--- Select Income ---</option>
                    <option value="1 ते 2 लाख">1 ते 2 लाख</option>
                    <option value="No">No</option>
                    <option value="10 ते 20 लाख वार्षिक">10 ते 20 लाख वार्षिक</option>
                    <option value="Below 1 लाख">Below 1 लाख</option>
                    <option value="Above 40 लाख वार्षिक">Above 40 लाख वार्षिक</option>
                    <option value="30 ते 40 लाख वार्षिक">30 ते 40 लाख वार्षिक</option>
                    <option value="20 ते 30 लाख वार्षिक">20 ते 30 लाख वार्षिक</option>
                    <option value="2 ते 5 लाख वार्षिक">2 ते 5 लाख वार्षिक</option>
                    <option value="5 ते 10 लाख वार्षिक">5 ते 10 लाख वार्षिक</option>
                </select> */}

                <select
                  name="INID"
                  value={formData.INID}
                  onChange={handleChange}
                  className="form-control"
                  required
                >
                  <option value="0">--- Select Income ---</option>
                   <option value="1">Below 1 लाख</option>
                    <option value="2">1 ते 2 लाख</option>
                     <option value="3">2 ते 5 लाख वार्षिक</option>
                       <option value="4">5 ते 10 लाख वार्षिक</option>
                          <option value="5">10 ते 20 लाख वार्षिक</option>
                        <option value="6">20 ते 30 लाख वार्षिक</option>
                    <option value="7">30 ते 40 लाख वार्षिक</option>
                       <option value="8">Above 40 लाख वार्षिक</option>
                    <option value="9">No</option>
                 
                   
                 
                   
                   
                  
                </select>
                <div className="invalid-feedback">Please select income.</div>
              </div>

              <div className="col-md-3 mb-3">
                <label>Fixed Income</label>
                <input
                  type="text"
                  name="fincome"
                  className="form-control"
                  placeholder="Enter fixed income"
                  value={formData.fincome}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-3 mb-3">
                <label>Current Work / Address</label>
                <textarea
                  name="current_work"
                  className="form-control"
                  rows="1"
                  value={formData.current_work}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>

            <button type="submit" className="btn btn-primary">
              {editId ? "Update" : "Save and Next"}
            </button>
            {editId && (
              <button
                type="button"
                className="btn btn-secondary ml-2"
                onClick={() => {
                  setEditId(null);
                  setFormData(emptyForm);
                }}
              >
                Cancel
              </button>
            )}
          </form>
        </div>
      </div>

      {/* Table Section */}
      <div className="card">
        <div className="card-body">
          <h3>Education & Work Records</h3>
          <div className="d-flex justify-content-between align-items-center mb-3">
  <div className="input-group">
    <input
      type="text"
      className="form-control"
      placeholder="Search by UID"
      value={searchUID}
      onChange={(e) => setSearchUID(e.target.value)}
    />
    <button
      className="btn btn-primary"
      onClick={() => fetchRecords(1)} // fetch first page of searched data
    >
      Search
    </button>
    <button
      className="btn btn-secondary"
      onClick={() => {
        setSearchUID("");
        fetchRecords(1); // reset to full list
      }}
    >
      Clear
    </button>
  </div>
</div>
 <h5 className="text-center mb-3">All User Education and Work info</h5>
           <div className="table-responsive">
        <table className="table table-bordered text-center align-middle">
          <thead className="table-dark">
                <tr>
                  <th>UId</th>
                  <th>Education</th>
                   <th>Education Details</th>
                  <th>Country</th>
                  <th>State</th>
                  <th>District</th>
                  <th>Fixed Income</th>
                  <th>Current Work</th>
                  <th>Actions</th>
                </tr>
              </thead>
             <tbody>
  {records.length > 0 ? (
    records.map((r, idx) => (
      <tr key={r.UID}>
        <td>{r.UID}</td>
        <td>{r.education_name || "-"}</td>
         <td>{r.education_details || "-"}</td>
        <td>{r.country_name || "-"}</td>
        <td>{r.state_name || "-"}</td>
        <td>{r.district_name || "-"}</td>
        <td>{r.fincome || "-"}</td>
        <td>{r.current_work || "-"}</td>
        <td>
          <button
            className="btn btn-warning btn-sm mr-2"
            onClick={() => handleEdit(r)}
          >
            ✏️
          </button>
          {/* <button
            className="btn btn-danger btn-sm"
            onClick={() => handleDelete(r.UID)}
          >
            🗑️
          </button> */}
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="8" className="text-center">No records found</td>
    </tr>
  )}
</tbody>

            </table>
            {/* Pagination Controls */}
<div className="mt-3">
  <button
    className="btn btn-outline-primary"
    disabled={page === 1}
    onClick={() => setPage(page - 1)}
  >
    ⬅ Prev
  </button>

  <span className="m-2">
    Page <strong>{page}</strong> of <strong>{totalPages}</strong>
  </span>

  <button
    className="btn btn-outline-primary"
    disabled={page === totalPages}
    onClick={() => setPage(page + 1)}
  >
    Next ➡
  </button>
</div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationWorkInfo;
