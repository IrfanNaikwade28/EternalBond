import React, { useState, useEffect } from "react";
import axios from "axios";

const RashiInfo = () => {
  const storedUser = localStorage.getItem("user");
  const userId = storedUser ? JSON.parse(storedUser).UID : null;

  const [rashis, setRashis] = useState([]);
  const [nakshtras, setNakshtras] = useState([]);
  const [nadis, setNadis] = useState([]);

  const [record, setRecord] = useState(null);
  const [form, setForm] = useState({});
  const [message, setMessage] = useState("");

  const API_URL = `${import.meta.env.VITE_ADMIN_API_BASE_URL || "http://localhost:5000"}/api/otherinfo`;

  // Load dropdown data
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_ADMIN_API_BASE_URL || "http://localhost:5000"}/api/rashi/all`).then((res) => setRashis(res.data));
    axios.get(`${import.meta.env.VITE_ADMIN_API_BASE_URL || "http://localhost:5000"}/api/nakshtra/all`).then((res) => setNakshtras(res.data));
    axios.get(`${import.meta.env.VITE_ADMIN_API_BASE_URL || "http://localhost:5000"}/api/nadi`).then((res) => setNadis(res.data));
  }, []);

  // Fetch record by userId
  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_URL}/${userId}`);
        const data = res.data.data;

        setRecord(data);

        setForm({
          RSID: data?.RSID || "",
          NKID: data?.NKID || "",
          NDID: data?.NDID || "",
          managal: data?.managal || "",
          charan: data?.charan || "",
        });
      } catch (err) {
        console.error("Error fetching:", err);
        setRecord(null);
      }
    };

    fetchData();
  }, [userId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`${API_URL}/${record.OID}`, { ...form, UID: userId });

      setMessage("✔ Rashi Info Updated Successfully!");
      setTimeout(() => setMessage(""), 2500);
    } catch (err) {
      setMessage("❌ Update Failed");
      setTimeout(() => setMessage(""), 2500);
    }
  };

  return (
  <div className="container mt-3 mb-5">
    <h3 className="mb-3">Rashi / Nakshatra / Nadi Info</h3>

    {message && <div className="alert alert-info text-center">{message}</div>}

    {!record && (
      <div className="alert alert-warning">No record found for UID: {userId}</div>
    )}

    {record && (
      <div className="card shadow p-4">
        <div className="mb-3">
          <label className="form-label">Rashi</label>
          <div className="input-group">
            <span className="input-group-text">
              <i className="fas fa-star"></i>
            </span>
            <select
              name="RSID"
              value={form.RSID}
              onChange={handleChange}
              className="form-control"
            >
              <option value="">Select</option>
              {rashis.map((r) => (
                <option key={r.RSID} value={r.RSID}>{r.Ras}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Nakshatra</label>
          <div className="input-group">
            <span className="input-group-text">
              <i className="fas fa-moon"></i>
            </span>
            <select
              name="NKID"
              value={form.NKID}
              onChange={handleChange}
              className="form-control"
            >
              <option value="">Select</option>
              {nakshtras.map((n) => (
                <option key={n.NKID} value={n.NKID}>{n.Nakshtra}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Nadi</label>
          <div className="input-group">
            <span className="input-group-text">
              <i className="fas fa-wave"></i>
            </span>
            <select
              name="NDID"
              value={form.NDID}
              onChange={handleChange}
              className="form-control"
            >
              <option value="">Select</option>
              {nadis.map((n) => (
                <option key={n.NDID} value={n.NDID}>{n.Nadi}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Mangal</label>
          <div className="input-group">
            <span className="input-group-text">
              <i className="fas fa-fire"></i>
            </span>
            <select
              name="managal"
              value={form.managal}
              onChange={handleChange}
              className="form-control"
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
              <option value="Medium">Medium</option>
              <option value="Nirdosh">Nirdosh</option>
            </select>
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Charan</label>
          <div className="input-group">
            {/* <span className="input-group-text">
              <i className="fas fa-shoe-prints"></i>
            </span> */}
            <select
              name="charan"
              value={form.charan}
              onChange={handleChange}
              className="form-control"
            >
              <option value="">Select</option>
              {[1, 2, 3, 4].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="col-6 text-start">
          <button style={{ background: "#c52e79ff" }} className="btn mt-2 text-white" onClick={handleUpdate}>
            <i className="fas fa-save me-2"></i>
            Update
          </button>
        </div>
      </div>
    )}
  </div>
);
};

export default RashiInfo;
