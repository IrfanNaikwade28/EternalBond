import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const AddHeight = () => {
  const [formData, setFormData] = useState({ height: "" });
  const [heights, setHeights] = useState([]);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [message, setMessage] = useState(null);
  const limit = 5;

  const formRef = useRef(null);

  // Fetch heights from API
  const fetchHeights = () => {
    axios
      .get(`http://localhost:5000/api/height?page=${page}&limit=${limit}&search=${search}`)
      .then(res => {
        setHeights(res.data.data);
        setTotal(res.data.total);
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchHeights();
  }, [page, search]);

  // Auto-clear messages after 3 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const form = formRef.current;
    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      return;
    }

    const data = { height: formData.height.trim() };

    const request = editId
      ? axios.put(`http://localhost:5000/api/height/${editId}`, data)
      : axios.post("http://localhost:5000/api/height", data);

    request
      .then(res => {
        setFormData({ height: "" });
        setEditId(null);
        form.classList.remove("was-validated");
        fetchHeights();
        setMessage(res.data.message);
      })
      .catch(err => {
        if (err.response?.status === 409) {
          setMessage(err.response.data.message);
        } else {
          setMessage("Something went wrong");
        }
      });
  };
const resetForm = () => { setFormData({ height: "" }); setEditId(null); formRef.current?.classList.remove("was-validated"); };
  // Edit height
  const handleEdit = (item) => {
    setFormData({ height: item.Height });
    setEditId(item.HEID);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Delete height
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this height?")) {
      axios.delete(`http://localhost:5000/api/height/${id}`)
        .then(res => {
          fetchHeights();
          setMessage(res.data.message);
        })
        .catch(err => console.error(err));
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="page-section container mt-4">
      {/* Success/Error Message */}
      {message && <div className="alert alert-success">{message}</div>}

      {/* Add/Edit Form */}
      <div className="card mb-4">
        <div className="card-body">
          <h3 >{editId ? "Edit Height" : "Add Height"}</h3>
          <form
            ref={formRef}
            className="needs-validation"
            noValidate
            onSubmit={handleSubmit}
          >
            <div className="form-row">
              <div className="col-md-6 mb-3">
                <label>Height <abbr title="Required">*</abbr></label>
                <input
                  type="text"
                  className="form-control"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  required
                />
                <div className="invalid-feedback">Please enter height.</div>
              </div>
            </div>
            <button type="submit" className="btn btn-primary">
              {editId ? "Update" : "Add"} Height
            </button>
             {editId && <button type="button" className="btn btn-secondary ml-2" onClick={resetForm}>Cancel</button>}
          </form>
        </div>
      </div>

      

      {/* Height List Table */}
      <div className="card">
        <div className="card-body">
          <h3 className="card-title">Height List</h3>
          {/* Search Box */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search Height..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
      </div>
          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Height</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {heights.length > 0 ? heights.map((h, idx) => (
                  <tr key={h.HEID}>
                    <td>{(page - 1) * limit + idx + 1}</td>
                    <td>{h.Height}</td>
                    <td>
                      <button
                        className="btn btn-warning btn-sm mr-2"
                        onClick={() => handleEdit(h)}
                      >✏️</button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(h.HEID)}
                      >🗑️</button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="3" className="text-center">No Heights found.</td>
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

export default AddHeight;
