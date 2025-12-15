import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const AddGan = () => {
  const [formData, setFormData] = useState({ ganName: "", castId: "" });
  const [casts, setCasts] = useState([]);
  const [gans, setGans] = useState([]);
  const [editId, setEditId] = useState(null);
  const [validated, setValidated] = useState(false);
  const [message, setMessage] = useState(null); // Success / error message
  const [error, setError] = useState(""); // Validation error for duplicate

  const formRef = useRef(null);

  // Fetch Casts
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/gan/cast")
      .then((res) => setCasts(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Fetch Gans
  const fetchGans = () => {
    axios
      .get("http://localhost:5000/api/gan")
      .then((res) => setGans(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchGans();
  }, []);

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
    setError(""); // Clear duplicate error on input change
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = formRef.current;

    if (!form.checkValidity()) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setValidated(false);

    if (editId) {
      // Update Gan
      axios
        .put(`http://localhost:5000/api/gan/${editId}`, formData)
        .then((res) => {
          setFormData({ ganName: "", castId: "" });
          setEditId(null);
          form.classList.remove("was-validated");
          setMessage(res.data.message || "Gan updated successfully");
          fetchGans();
        })
        .catch((err) => {
          if (err.response?.status === 409) {
            setMessage(err.response?.data?.message || "Duplicate Gan");
          } else {
            console.error(err);
          }
        });
    } else {
      // Add Gan
      axios
        .post("http://localhost:5000/api/gan", formData)
        .then((res) => {
          setFormData({ ganName: "", castId: "" });
          form.classList.remove("was-validated");
          setMessage(res.data.message || "Gan added successfully");
          fetchGans();
        })
        .catch((err) => {
          if (err.response?.status === 409) {
            setMessage(err.response?.data?.message || "Duplicate Gan");
          } else {
            console.error(err);
          }
        });
    }
  };
const resetForm = () => { setFormData({ ganName: "" ,castId:""}); setEditId(null); formRef.current?.classList.remove("was-validated"); };
  const handleEdit = (gan) => {
    setFormData({ ganName: gan.Gan, castId: gan.CTID });
    setEditId(gan.GNID);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this Gan?")) {
      axios
        .delete(`http://localhost:5000/api/gan/${id}`)
        .then((res) => {
          setMessage(res.data.message || "Gan deleted successfully");
          fetchGans();
        })
        .catch((err) => console.error(err));
    }
  };

  return (
    <div className="page-section">
      {/* Message */}
      {message && <div className="alert alert-success">{message}</div>}

      {/* Form */}
      <div className="card mb-4">
        <div className="card-body">
          <h3>{editId ? "Edit Gan" : "Add Gan"}</h3>
          <form
            ref={formRef}
            className={`needs-validation ${validated ? "was-validated" : ""}`}
            noValidate
            onSubmit={handleSubmit}
          >
            <div className="form-row">
              <div className="col-md-6 mb-3">
                <label>Gan Name</label>
                <input
                  type="text"
                  name="ganName"
                  value={formData.ganName}
                  onChange={handleChange}
                  className={`form-control ${error ? "is-invalid" : ""}`}
                  placeholder="Enter Gan Name"
                  required
                />
                <div className="invalid-feedback">
                  {error || "Please enter Gan Name."}
                </div>
              </div>

              <div className="col-md-6 mb-3">
                <label>Cast</label>
                <select
                  name="castId"
                  value={formData.castId}
                  onChange={handleChange}
                  className={`custom-select ${error ? "is-invalid" : ""}`}
                  required
                >
                  <option value="">Choose Cast</option>
                  {casts.map((c) => (
                    <option key={c.CTID} value={c.CTID}>
                      {c.Cast}
                    </option>
                  ))}
                </select>
                <div className="invalid-feedback">
                  {error || "Please select a Cast."}
                </div>
              </div>
            </div>

            <button className="btn btn-primary" type="submit">
              {editId ? "Update Gan" : "Add Gan"}
            </button>
             {editId && <button type="button" className="btn btn-secondary ml-2" onClick={resetForm}>Cancel</button>}
          </form>
        </div>
      </div>

      {/* Gan List */}
      <div className="card">
        <div className="card-body">
          <h3>Gan List</h3>
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>#</th>
                <th>Gan</th>
                <th>Cast</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {gans.length > 0 ? (
                gans.map((g, i) => (
                  <tr key={g.GNID}>
                    <td>{i + 1}</td>
                    <td>{g.Gan}</td>
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
                        onClick={() => handleDelete(g.GNID)}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">
                    No Gan found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AddGan;
