import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../context/UserContext"; // ✅ import context

const RashiInfo = () => {
  //const { userId } = useUser(); // ✅ get logged-in userId

   const {
    userId,
    setUserId,
    setCtid,
    setFatherName,
    setMotherName,
    setEDID,
    setCNID,
    setDSID,
    setINID,
    setDiet,
    setDrink,
    setSmoking,
  } = useUser();

  const [formData, setFormData] = useState({
    RSID: "",
    NKID: "",
    NDID: "",
    managal: "",
    charan: "",
  });

  const [rashis, setRashis] = useState([]);
  const [nakshtras, setNakshtras] = useState([]);
  const [nadis, setNadis] = useState([]);
  const [records, setRecords] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
const [page, setPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);
const [searchUID, setSearchUID] = useState("");



  const API_URL = "http://localhost:5000/api/otherinfo";

  useEffect(() => {
    axios.get("http://localhost:5000/api/rashi/all").then((res) => setRashis(res.data));
    axios.get("http://localhost:5000/api/nakshtra/all").then((res) => setNakshtras(res.data));
    axios.get("http://localhost:5000/api/nadi").then((res) => setNadis(res.data));
    if (userId) fetchAll(1);
  }, [userId]);


  const fetchAll = async (newPage = 1, search = "") => {
  try {
    const res = await axios.get(`${API_URL}?page=${newPage}&limit=10&search=${search}`);
    setRecords(res.data.data);
    setTotalPages(res.data.totalPages);
    setPage(res.data.page);
  } catch (err) {
    console.error("Fetch error:", err);
  }
};
const handleSearch = (e) => {
  e.preventDefault();
  fetchAll(1, searchUID); // search from page 1 using entered UID
};
  
// const fetchAll = async (newPage = 1) => {
//   const res = await axios.get(`${API_URL}?page=${newPage}&limit=10`);
//   setRecords(res.data.data);
//   setTotalPages(res.data.totalPages);
//   setPage(res.data.page);
// };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    let newErrors = {};
    ["RSID", "NKID", "NDID", "managal", "charan"].forEach((f) => {
      if (!formData[f]) newErrors[f] = "Required field";
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validate()) return;

  try {
    let res;
    const payload = { ...formData, UID: userId };

    if (isEdit) {
      const payload = { ...formData};
      console.log("all data",payload)
      res = await axios.put(`${API_URL}/${formData.OID}`, payload);
      
    } else {
      res = await axios.post(API_URL, payload);
    }

    // ✅ Show message temporarily
    setMessage(res.data.message || "✅ Saved successfully");
    setTimeout(() => setMessage(""), 3000);


     //🟢 Clear the user context completely after successful insertion
      if (!isEdit) {
        setUserId(null);
        setCtid(null);
        setFatherName("");
        setMotherName("");
        setEDID(null);
        setCNID(null);
        setDSID(null);
        setINID(null);
        setDiet("");
        setDrink("");
        setSmoking("");
        localStorage.clear(); // also clear localStorage
     }
    // ✅ Keep pagination position same (stay on same tab)
    await fetchAll(page);

    // ✅ Reset form but DO NOT clear userId or context (to stay on same page)
    setIsEdit(false);
    setFormData({ RSID: "", NKID: "", NDID: "", managal: "", charan: "" });

  } catch (err) {
    setMessage(err.response?.data?.message || "❌ Error saving data");
    setTimeout(() => setMessage(""), 3000);
  }
};





  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!validate()) return;

  //   try {
  //     let res;
  //     const payload = { ...formData, UID: userId };

  //     if (isEdit) {
  //       res = await axios.put(`${API_URL}/${formData.OID}`, payload);
  //     } else {
  //       res = await axios.post(API_URL, payload);
  //     }

  //     setMessage(res.data.message || "✅ Saved successfully");
  //     setTimeout(() => setMessage(""), 3000);

  //     // 🟢 Clear the user context completely after successful insertion
  //     if (!isEdit) {
  //       setUserId(null);
  //       setCtid(null);
  //       setFatherName("");
  //       setMotherName("");
  //       setEDID(null);
  //       setCNID(null);
  //       setDSID(null);
  //       setINID(null);
  //       setDiet("");
  //       setDrink("");
  //       setSmoking("");
  //       localStorage.clear(); // also clear localStorage
  //     }

  //     fetchAll();
  //     setIsEdit(false);
  //     setFormData({ RSID: "", NKID: "", NDID: "", managal: "", charan: "" });
  //   } catch (err) {
  //     setMessage(err.response?.data?.message || "❌ Error saving data");
  //     setTimeout(() => setMessage(""), 3000);
  //   }
  // };
 const handleEdit = (item) => {
  setFormData({
    OID: item.OID, // ✅ include this
    UID:item.UID,
    RSID: item.RSID,
    NKID: item.NKID,
    NDID: item.NDID,
    managal: item.managal,
    charan: item.charan,
  });
  setIsEdit(true);
};


  const handleDelete = async (OID) => {
    if (!window.confirm("Are you sure?")) return;
    const res = await axios.delete(`${API_URL}/${OID}`);
    setMessage(res.data.message);
    fetchAll();
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div className="container mt-3 " style={{ overflowX: "hidden", maxWidth: "100%" }}>
      <h3>Rashi / Nakshatra / Nadi Info</h3>
      <form onSubmit={handleSubmit} className="border p-3 rounded">
        <div className="row">
          <div className="col-md-2">
            <label>Rashi</label>
            <select name="RSID" value={formData.RSID} onChange={handleChange} className="form-control">
              <option value="">Select</option>
              {rashis.map((r) => (
                <option key={r.RSID} value={r.RSID}>{r.Ras}</option>
              ))}
            </select>
            {errors.RSID && <div className="text-danger small">{errors.RSID}</div>}
          </div>

          <div className="col-md-2">
            <label>Nakshtra</label>
            <select name="NKID" value={formData.NKID} onChange={handleChange} className="form-control">
              <option value="">Select</option>
              {nakshtras.map((n) => (
                <option key={n.NKID} value={n.NKID}>{n.Nakshtra}</option>
              ))}
            </select>
            {errors.NKID && <div className="text-danger small">{errors.NKID}</div>}
          </div>

          <div className="col-md-2">
            <label>Nadi</label>
            <select name="NDID" value={formData.NDID} onChange={handleChange} className="form-control">
              <option value="">Select</option>
              {nadis.map((n) => (
                <option key={n.NDID} value={n.NDID}>{n.Nadi}</option>
              ))}
            </select>
            {errors.NDID && <div className="text-danger small">{errors.NDID}</div>}
          </div>

          <div className="col-md-2">
            <label>Mangal</label>
            <select name="managal" value={formData.managal} onChange={handleChange} className="form-control">
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
              <option value="Medium">Medium</option>
              <option value="Nirdosh">Nirdosh</option>
            </select>
            {errors.managal && <div className="text-danger small">{errors.managal}</div>}
          </div>

          <div className="col-md-2">
            <label>Charan</label>
            <select name="charan" value={formData.charan} onChange={handleChange} className="form-control">
              <option value="">Select</option>
              {[1, 2, 3, 4].map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            {errors.charan && <div className="text-danger small">{errors.charan}</div>}
          </div>
        </div>

        <button className="btn btn-primary mt-3">{isEdit ? "Update" : "Save"}</button>
        {isEdit && (
          <button
            type="button"
            className="btn btn-secondary mt-3 ms-2"
            onClick={() => {
              setFormData({ RSID: "", NKID: "", NDID: "", managal: "", charan: "" });
              setIsEdit(false);
            }}
          >
            Cancel
          </button>
        )}
      </form>

      {message && <div className="alert alert-info mt-2">{message}</div>}

      <hr />


 <form
  onSubmit={handleSearch}
  className="d-flex  mb-3"
  style={{ width: "100%" }}
>
  <input
    type="text"
    className="form-control me-2"
  
    placeholder="Enter UID to Search"
    value={searchUID}
    onChange={(e) => setSearchUID(e.target.value)}
  />
  <button type="submit" className="btn btn-primary me-2">
    Search
  </button>
  <button
    type="button"
    className="btn btn-secondary"
    onClick={() => {
      setSearchUID("");
      fetchAll(1, ""); // reset to show all data
    }}
  >
    Reset
  </button>
</form>

 <h5 className="text-center mb-3">All User Rashi Nakshtra Nadi info</h5>
      <table className="table table-bordered text-center">
        <thead className="table-dark">
          <tr>
            {/* <th>OID</th> */}
            <th>UID</th>
            <th>Rashi</th>
            <th>Nakshtra</th>
            <th>Nadi</th>
            <th>Mangal</th>
            <th>Charan</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
  {records.map((r) => (
    <tr key={r.OID}>
      {/* <td>{r.OID}</td> */}
      <td>{r.UID}</td>
      <td>{r.RashiName}</td>
      <td>{r.NakshtraName}</td>
      <td>{r.NadiName}</td>
      <td>{r.managal}</td>
      <td>{r.charan}</td>
      <td>
        <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(r)}>✏️</button>
        {/* <button className="btn btn-danger btn-sm" onClick={() => handleDelete(r.OID)}>🗑️</button> */}
      </td>
    </tr>
  ))}
</tbody>

      </table>
      <div className="mt-3">
  <button
    className="btn btn-secondary"
    disabled={page === 1}
    onClick={() => fetchAll(page - 1)}
  >
    ← Prev
  </button>

  <span className="m-3">
    Page {page} of {totalPages}
  </span>

  <button
    className="btn btn-secondary"
    disabled={page === totalPages}
    onClick={() => fetchAll(page + 1)}
  >
    Next →
  </button>
</div>

    </div>
  );
};

export default RashiInfo;
