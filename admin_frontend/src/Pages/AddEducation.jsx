import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const AddEducation = () => {
  const [formData, setFormData] = useState({ education: "" });
  const [educations, setEducations] = useState([]);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [message, setMessage] = useState(null);
  const limit = 5; // items per page

  const formRef = useRef(null); // Bootstrap validation

  // Fetch educations
  const fetchEducations = () => {
    axios
      .get(`http://localhost:5000/api/education?page=${page}&limit=${limit}&search=${search}`)
      .then((res) => {
        setEducations(res.data.data);
        setTotal(res.data.total);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchEducations();
  }, [page, search]);

  useEffect(() => {
  if (message) {
    const timer = setTimeout(() => setMessage(null), 3000); // Clear message after 3 seconds
    return () => clearTimeout(timer); // Cleanup on unmount or when message changes
  }
}, [message]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = formRef.current;

    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      return;
    }

    const request = editId
      ? axios.put(`http://localhost:5000/api/education/${editId}`, formData)
      : axios.post("http://localhost:5000/api/education", formData);

    request
      .then((res) => {
        setFormData({ education: "" });
        setEditId(null);
        form.classList.remove("was-validated");
        setMessage(res.data.message);
        fetchEducations();
      })
      .catch((err) => {
        setMessage(err.response?.data?.message || "Error occurred");
      });
  };
const resetForm = () => { setFormData({ education: "" }); setEditId(null); formRef.current?.classList.remove("was-validated"); };
  const handleEdit = (edu) => {
    setFormData({ education: edu.Education });
    setEditId(edu.EDID);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this Education?")) {
      axios
        .delete(`http://localhost:5000/api/education/${id}`)
        .then((res) => {
          setMessage(res.data.message);
          fetchEducations();
        })
        .catch((err) => console.error(err));
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="page-section">
      {/* Form Card */}
      <div className="card mb-4">
        <div className="card-body">
          <h3>{editId ? "Edit Education" : "Add Education"}</h3>

          {message && <div className="alert alert-info">{message}</div>}

          <form ref={formRef} className="needs-validation" noValidate onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="col-md-6 mb-3">
                <label>Education Name</label>
                <input
                  type="text"
                  name="education"
                  className="form-control"
                  placeholder="Enter Education"
                  value={formData.education}
                  onChange={handleChange}
                  required
                />
                <div className="invalid-feedback">Please enter Education Name.</div>
              </div>
            </div>

            <button type="submit" className="btn btn-primary">
              {editId ? "Update Education" : "Add Education"}
              
            </button>
            {editId && <button type="button" className="btn btn-secondary ml-2" onClick={resetForm}>Cancel</button>}
          </form>
        </div>
      </div>

      {/* Table Card */}
      <div className="card">
        <div className="card-body">
          <h3>Education List</h3>

          <input
            type="text"
            className="form-control mb-3"
            placeholder="Search Education..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />

          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Education</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {educations.map((edu, idx) => (
                  <tr key={edu.EDID}>
                    <td>{(page - 1) * limit + idx + 1}</td>
                    <td>{edu.Education}</td>
                    <td>
                      <button className="btn btn-warning btn-sm mr-2" onClick={() => handleEdit(edu)}>
                        ✏️
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(edu.EDID)}>
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
                {educations.length === 0 && (
                  <tr>
                    <td colSpan="3" className="text-center">
                      No Education found.
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
                <li key={i} className={`page-item ${page === i + 1 ? "active" : ""}`}>
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

export default AddEducation;
