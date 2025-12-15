import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const AddNakshtra = () => {
  const [formData, setFormData] = useState({ nakshtraName: "", castId: "" });
  const [casts, setCasts] = useState([]);
  const [nakshtras, setNakshtras] = useState([]);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [message, setMessage] = useState(null); // success/error message
  const limit = 5;

  const formRef = useRef(null);

  // Fetch casts
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/nakshtra/cast")
      .then(res => setCasts(res.data))
      .catch(err => console.error(err));
  }, []);

  // Fetch nakshtras
  const fetchNakshtras = () => {
    axios
      .get(`http://localhost:5000/api/nakshtra?page=${page}&limit=${limit}&search=${search}`)
      .then(res => {
        setNakshtras(res.data.data);
        setTotal(res.data.total);
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchNakshtras();
  }, [page, search]);

  // Auto-clear message after 3 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = formRef.current;

    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      return;
    }

    // Trim Nakshtra name to prevent whitespace duplicates
    const data = {
      nakshtraName: formData.nakshtraName.trim(),
      castId: formData.castId
    };

    const request = editId
      ? axios.put(`http://localhost:5000/api/nakshtra/${editId}`, data)
      : axios.post("http://localhost:5000/api/nakshtra", data);

    request
      .then((res) => {
        setFormData({ nakshtraName: "", castId: "" });
        setEditId(null);
        form.classList.remove("was-validated");
        fetchNakshtras();
        setMessage(res.data.message);
      })
      .catch((err) => {
        if (err.response?.status === 409) {
          setMessage(err.response.data.message); // duplicate message
        } else if (err.response?.status === 400) {
          setMessage(err.response.data.message); // missing fields
        } else {
          console.error(err);
          setMessage("Something went wrong");
        }
      });
  };
 const resetForm = () => { setFormData({ nakshtraName: "",castId:"" }); setEditId(null); formRef.current?.classList.remove("was-validated"); };
  const handleEdit = (item) => {
    setFormData({ nakshtraName: item.Nakshtra, castId: item.CTID });
    setEditId(item.NKID);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this Nakshtra?")) {
      axios.delete(`http://localhost:5000/api/nakshtra/${id}`)
        .then((res) => {
          fetchNakshtras();
          setMessage(res.data.message);
        })
        .catch(err => console.error(err));
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="page-section">
      {/* Message */}
      {message && <div className="alert alert-success">{message}</div>}

      {/* Form */}
      <div className="card mb-4">
        <div className="card-body">
          <h3>{editId ? "Edit Nakshtra" : "Add Nakshtra"}</h3>
          <form ref={formRef} className="needs-validation" noValidate onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="col-md-6 mb-3">
                <label>Enter Nakshtra Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Nakshtra Name"
                  name="nakshtraName"
                  value={formData.nakshtraName}
                  onChange={handleChange}
                  required
                />
                <div className="invalid-feedback">Please enter Nakshtra Name.</div>
              </div>
              <div className="col-md-6 mb-3">
                <label>Cast</label>
                <select
                  className="custom-select"
                  name="castId"
                  value={formData.castId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Choose Cast</option>
                  {casts.map(c => (
                    <option key={c.CTID} value={c.CTID}>{c.Cast}</option>
                  ))}
                </select>
                <div className="invalid-feedback">Please select a Cast.</div>
              </div>
            </div>
            <button type="submit" className="btn btn-primary">
              {editId ? "Update Nakshtra" : "Add Nakshtra"}
            </button>
              {editId && <button type="button" className="btn btn-secondary ml-2" onClick={resetForm}>Cancel</button>}
          </form>
        </div>
      </div>

     

      {/* Table */}
      <div className="card">
        <div className="card-body">
          <h3>Nakshtra List</h3>
           {/* Search */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search Nakshtra..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
      </div>
          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nakshtra</th>
                  <th>Cast</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {nakshtras.length > 0 ? nakshtras.map((n, idx) => (
                  <tr key={n.NKID}>
                    <td>{(page - 1) * limit + idx + 1}</td>
                    <td>{n.Nakshtra}</td>
                    <td>{n.Cast}</td>
                    <td>
                      <button className="btn btn-warning btn-sm mr-2" onClick={() => handleEdit(n)}>✏️</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(n.NKID)}>🗑️</button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4" className="text-center">No Nakshtras found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <nav>
            <ul className="pagination">
              <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => setPage(page - 1)}>Previous</button>
              </li>
              {Array.from({ length: totalPages }, (_, i) => (
                <li key={i} className={`page-item ${page === i + 1 ? "active" : ""}`}>
                  <button className="page-link" onClick={() => setPage(i + 1)}>{i + 1}</button>
                </li>
              ))}
              <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => setPage(page + 1)}>Next</button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default AddNakshtra;
