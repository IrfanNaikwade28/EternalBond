import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const AddGotra = () => {
  const [formData, setFormData] = useState({ gotraName: "", castId: "" });
  const [casts, setCasts] = useState([]);
  const [gotras, setGotras] = useState([]);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [message, setMessage] = useState(null); // Success / error message
  const limit = 5;

  const formRef = useRef(null); // form reference for validation

  // Fetch casts
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/gotra/cast")
      .then((res) => setCasts(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Fetch gotras with search & pagination
  const fetchGotras = () => {
    axios
      .get(`http://localhost:5000/api/gotra`, {
        params: { page, limit, search },
      })
      .then((res) => {
        setGotras(res.data.gotras);
        setTotalPages(res.data.totalPages);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchGotras();
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

    // Check Bootstrap validation
    if (!form.checkValidity()) {
      e.stopPropagation();
      form.classList.add("was-validated");
      return;
    }

    const request = editId
      ? axios.put(`http://localhost:5000/api/gotra/${editId}`, formData)
      : axios.post("http://localhost:5000/api/gotra", formData);

    request
      .then((res) => {
        setFormData({ gotraName: "", castId: "" });
        setEditId(null);
        form.classList.remove("was-validated"); // remove validation class
        fetchGotras();
        setMessage(res.data.message || (editId ? "Gotra updated" : "Gotra added")); // show message
      })
      .catch((err) => {
        if (err.response && err.response.status === 409) {
          setMessage(err.response.data.message); // duplicate message
        } else {
          console.error(err);
        }
      });
  };
const resetForm = () => { setFormData({ gotraName: "" ,castId:""}); setEditId(null); formRef.current?.classList.remove("was-validated"); };
  const handleEdit = (gotra) => {
    setFormData({ gotraName: gotra.Gotra, castId: gotra.CTID });
    setEditId(gotra.GID);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this Gotra?")) {
      axios
        .delete(`http://localhost:5000/api/gotra/${id}`)
        .then((res) => {
          setMessage(res.data.message || "Gotra deleted");
          fetchGotras();
        })
        .catch((err) => console.error(err));
    }
  };

  return (
    <div className="page-section">
      {/* Message */}
      {message && <div className="alert alert-success">{message}</div>}

      {/* Form Card */}
      <div className="card mb-4">
        <div className="card-body">
          <h3>{editId ? "Edit Gotra" : "Add Gotra"}</h3>
          <form
            ref={formRef}
            className="needs-validation"
            noValidate
            onSubmit={handleSubmit}
          >
            <div className="form-row">
              <div className="col-md-6 mb-3">
                <label>Enter Gotra Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="gotraName"
                  value={formData.gotraName}
                  onChange={handleChange}
                  placeholder="Enter Gotra"
                  required
                />
                <div className="invalid-feedback">Please enter Gotra Name.</div>
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
                  {casts.map((c) => (
                    <option key={c.CTID} value={c.CTID}>
                      {c.Cast}
                    </option>
                  ))}
                </select>
                <div className="invalid-feedback">Please select a Cast.</div>
              </div>
            </div>
            <button className="btn btn-primary" type="submit">
              {editId ? "Update Gotra" : "Add Gotra"}
            </button>
              {editId && <button type="button" className="btn btn-secondary ml-2" onClick={resetForm}>Cancel</button>}
          </form>
        </div>
      </div>

      {/* Table Card */}
      <div className="card">
        <div className="card-body">
          <h3>Gotra List</h3>

          {/* Search */}
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search Gotra..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>

          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Gotra</th>
                  <th>Cast</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {gotras.map((g, idx) => (
                  <tr key={g.GID}>
                    <td>{(page - 1) * limit + idx + 1}</td>
                    <td>{g.Gotra}</td>
                    <td>{g.Cast}</td>
                    <td>
                      <button
                        className="btn btn-warning btn-sm mr-2"
                        onClick={() => handleEdit(g)}
                      >
                        ✏️
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(g.GID)}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
                {gotras.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center">
                      No Gotras found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <nav>
            <ul className="pagination">
              <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => setPage(page - 1)}>
                  Previous
                </button>
              </li>
              {Array.from({ length: totalPages }, (_, i) => (
                <li
                  key={i}
                  className={`page-item ${page === i + 1 ? "active" : ""}`}
                >
                  <button className="page-link" onClick={() => setPage(i + 1)}>
                    {i + 1}
                  </button>
                </li>
              ))}
              <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => setPage(page + 1)}>
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default AddGotra;
