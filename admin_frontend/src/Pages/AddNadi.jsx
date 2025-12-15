import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const AddNadi = () => {
  const [formData, setFormData] = useState({ Nadi: "" });
  const [editId, setEditId] = useState(null);
  const [nadis, setNadis] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(""); // duplicate error
  const [message, setMessage] = useState(null); // success / error message

  const formRef = useRef(null);

  const fetchNadis = () => {
    axios
      .get(`http://localhost:5000/api/nadi`)
      .then((res) => setNadis(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchNadis();
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
    setError(""); // clear duplicate error on input change
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
      ? axios.put(`http://localhost:5000/api/nadi/${editId}`, formData)
      : axios.post("http://localhost:5000/api/nadi", formData);

    request
      .then((res) => {
        setFormData({ Nadi: "" });
        setEditId(null);
        form.classList.remove("was-validated");
        fetchNadis();
        setMessage(res.data.message || (editId ? "Nadi updated" : "Nadi added")); // success message
      })
      .catch((err) => {
        if (err.response?.status === 409) {
          setError(err.response.data.message); // duplicate error
          setMessage(err.response.data.message); // show duplicate message
        } else {
          console.error(err);
        }
      });
  };
const resetForm = () => { setFormData({ Nadi: "" }); setEditId(null); formRef.current?.classList.remove("was-validated"); };
  const handleEdit = (nadi) => {
    setFormData({ Nadi: nadi.Nadi });
    setEditId(nadi.NDID);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure to delete this Nadi?")) {
      axios
        .delete(`http://localhost:5000/api/nadi/${id}`)
        .then((res) => {
          setMessage(res.data.message || "Nadi deleted"); // success message
          fetchNadis();
        })
        .catch((err) => console.error(err));
    }
  };

  return (
    <div className="page-section">
      {/* Message */}
      {message && <div className="alert alert-success">{message}</div>}

      <div className="card mb-4">
        <div className="card-body">
          <h3>{editId ? "Edit Nadi" : "Add Nadi"}</h3>
          <form ref={formRef} className="needs-validation" noValidate onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="col-md-6 mb-3">
                <label htmlFor="Nadi">Nadi Name</label>
                <input
                  type="text"
                  className={`form-control ${error ? "is-invalid" : ""}`}
                  id="Nadi"
                  name="Nadi"
                  value={formData.Nadi}
                  onChange={handleChange}
                  placeholder="Enter Nadi Name"
                  required
                />
                <div className="invalid-feedback">{error || "Please enter Nadi Name."}</div>
              </div>
            </div>
            <button className="btn btn-primary" type="submit">
              {editId ? "Update Nadi" : "Add Nadi"}
            </button>
             {editId && <button type="button" className="btn btn-secondary ml-2" onClick={resetForm}>Cancel</button>}
          </form>
        </div>
      </div>

      

      {/* Table */}
      <div className="card">
        <div className="card-body">
          <h3>Nadi List</h3>
{/* Search */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search Nadi..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>#</th>
                <th>Nadi Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {nadis.length > 0 ? (
                nadis.map((nadi, idx) => (
                  <tr key={nadi.NDID}>
                    <td>{idx + 1}</td>
                    <td>{nadi.Nadi}</td>
                    <td>
                      <button className="btn btn-warning btn-sm mr-2" onClick={() => handleEdit(nadi)}>
                        ✏️
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(nadi.NDID)}>
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center">No Nadi found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AddNadi;
