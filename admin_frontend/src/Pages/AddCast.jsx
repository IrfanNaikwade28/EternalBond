import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const AddCast = () => {
  const [formData, setFormData] = useState({ Cast: "" });
  const [editId, setEditId] = useState(null);
  const [casts, setCasts] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(""); // duplicate error
  const [message, setMessage] = useState(null); // success / error message

  const formRef = useRef(null);

  const fetchCasts = () => {
    axios
      .get(`http://localhost:5000/api/cast`)
      .then((res) => setCasts(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchCasts();
  });

  // Auto-clear message after 3 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // clear duplicate error
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = formRef.current;

    if (!form.checkValidity()) {
      e.stopPropagation();
      form.classList.add("was-validated");
      return;
    }

    const request = editId
      ? axios.put(`http://localhost:5000/api/cast/${editId}`, formData)
      : axios.post("http://localhost:5000/api/cast", formData);

    request
      .then((res) => {
        setFormData({ Cast: "" });
        setEditId(null);
        form.classList.remove("was-validated");
        fetchCasts();
        setMessage(res.data.message || (editId ? "Cast updated" : "Cast added"));
      })
      .catch((err) => {
        if (err.response?.status === 409) {
          setError(err.response.data.message);
          setMessage(err.response.data.message);
        } else {
          console.error(err);
        }
      });
  };

  const resetForm = () => {
    setFormData({ Cast: "" });
    setEditId(null);
    formRef.current?.classList.remove("was-validated");
  };

  const handleEdit = (cast) => {
    setFormData({ Cast: cast.Cast });
    setEditId(cast.CTID);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure to delete this Cast?")) {
      axios
        .delete(`http://localhost:5000/api/cast/${id}`)
        .then((res) => {
          setMessage(res.data.message || "Cast deleted");
          fetchCasts();
        })
        .catch((err) => console.error(err));
    }
  };

  return (
    <div className="page-section">
      {/* Success/Error Message */}
      {message && <div className="alert alert-success">{message}</div>}

      <div className="card mb-4">
        <div className="card-body">
          <h3>{editId ? "Edit Cast" : "Add Cast"}</h3>
          <form ref={formRef} className="needs-validation" noValidate onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="col-md-6 mb-3">
                <label htmlFor="Cast">Cast Name</label>
                <input
                  type="text"
                  className={`form-control ${error ? "is-invalid" : ""}`}
                  id="Cast"
                  name="Cast"
                  value={formData.Cast}
                  onChange={handleChange}
                  placeholder="Enter Cast Name"
                  required
                />
                <div className="invalid-feedback">{error || "Please enter Cast Name."}</div>
              </div>
            </div>
            <button className="btn btn-primary" type="submit">
              {editId ? "Update Cast" : "Add Cast"}
            </button>
            {editId && (
              <button type="button" className="btn btn-secondary ml-2" onClick={resetForm}>
                Cancel
              </button>
            )}
          </form>
        </div>
      </div>

      {/* Cast List */}
      <div className="card">
        <div className="card-body">
          <h3>Cast List</h3>

          {/* Search */}
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search Cast..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="table-responsive">
        <table className="table table-bordered table-striped align-middle">
         
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Cast Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {casts.length > 0 ? (
                casts.map((cast, idx) => (
                  <tr key={cast.CTID}>
                    <td>{idx + 1}</td>
                    <td>{cast.Cast}</td>
                    <td>
                      <button
                        className="btn btn-warning btn-sm mr-2"
                        onClick={() => handleEdit(cast)}
                      >
                        ✏️
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(cast.CTID)}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center">
                    No Cast found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCast;
