import React, { useState, useEffect } from "react";
import axios from "axios";

const AddRashi = () => {
  const [formData, setFormData] = useState({ Rashi: "" });
  const [validated, setValidated] = useState(false);
  const [editId, setEditId] = useState(null);
  const [rashis, setRashis] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [message, setMessage] = useState(null);
  const limit = 5; // items per page

  // Fetch Rashis with search & pagination
  const fetchRashis = () => {
    axios
      .get(`http://localhost:5000/api/rashi?page=${page}&limit=${limit}&search=${search}`)
      .then((res) => {
        setRashis(res.data.data);
        setTotal(res.data.total);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchRashis();
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
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    const apiCall = editId
      ? axios.put(`http://localhost:5000/api/rashi/${editId}`, formData)
      : axios.post("http://localhost:5000/api/rashi", formData);

    apiCall
      .then((res) => {
        setFormData({ Rashi: "" });
        setEditId(null);
        form.classList.remove("was-validated");
        setMessage(res.data.message);
        fetchRashis();
      })
      .catch((err) => {
        if (err.response && err.response.status === 409) {
         setMessage(err.response?.data?.message || "Error occurred"); // ✅ Duplicate alert
        } else {
          console.error(err);
        }
      });

    setValidated(true);
  };
 const resetForm = () => { setFormData({ Rashi: "" }); setEditId(null); formRef.current?.classList.remove("was-validated"); };
  const handleEdit = (rashi) => {
    setFormData({ Rashi: rashi.Ras });
    setEditId(rashi.RSID);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this Rashi?")) {
      axios.delete(`http://localhost:5000/api/rashi/${id}`).then(fetchRashis);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="page-section">
      {/* Form Card */}
      <div className="card mb-4">
        <div className="card-body">
          <h3>{editId ? "Edit Rashi" : "Add Rashi"}</h3>
           {message && <div className="alert alert-info">{message}</div>}
          <form
            className={`needs-validation ${validated ? "was-validated" : ""}`}
            noValidate
            onSubmit={handleSubmit}
          >
            <div className="form-row">
              <div className="col-md-6 mb-3">
                <label htmlFor="Rashi">
                  Enter Rashi Name <abbr title="Required">*</abbr>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="Rashi"
                  name="Rashi"
                  value={formData.Rashi}
                  onChange={handleChange}
                  required
                  placeholder="Enter Rashi"
                />
                <div className="invalid-feedback">Rashi name is required.</div>
              </div>
            </div>

            <button className="btn btn-primary" type="submit">
              {editId ? "Update Rashi" : "Add Rashi"}
            </button>
            {editId && <button type="button" className="btn btn-secondary ml-2" onClick={resetForm}>Cancel</button>}
          </form>
        </div>
      </div>

      

      {/* Table */}
      <div className="card">
        <div className="card-body">
          <h3>Rashi List</h3>
          {/* Search */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search Rashi..."
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
                  <th>Rashi</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rashis.map((r, idx) => (
                  <tr key={r.RSID}>
                    <td>{(page - 1) * limit + idx + 1}</td>
                    <td>{r.Ras}</td>
                    <td>
                      <button className="btn btn-warning btn-sm mr-2" onClick={() => handleEdit(r)}>
                        ✏️
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(r.RSID)}>
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
                {rashis.length === 0 && (
                  <tr>
                    <td colSpan="3" className="text-center">
                      No Rashis found.
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

export default AddRashi;
