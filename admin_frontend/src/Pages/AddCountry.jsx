import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const AddCountry = () => {
  const [formData, setFormData] = useState({ countryName: "" });
  const [countries, setCountries] = useState([]);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [message, setMessage] = useState(null);
  const formRef = useRef(null);
  const limit = 5;

  const fetchCountries = () => {
    axios.get(`http://localhost:5000/api/country/list?search=${encodeURIComponent(search)}&page=${page}&limit=${limit}`)
      .then(res => { if (res.data.success) { setCountries(res.data.data); setTotal(res.data.total); } })
      .catch(err => console.error(err));
  };

  useEffect(() => { fetchCountries(); }, [search, page]);

  useEffect(() => { if (!message) return; const t = setTimeout(() => setMessage(null), 3000); return () => clearTimeout(t); }, [message]);

  const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); };

  const resetForm = () => { setFormData({ countryName: "" }); setEditId(null); formRef.current?.classList.remove("was-validated"); };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = formRef.current;
    if (!form.checkValidity()) { form.classList.add("was-validated"); return; }

    const payload = { countryName: formData.countryName.trim() };

    if (editId) {
      axios.put("http://localhost:5000/api/country/update", { CNID: editId, ...payload })
        .then(res => { setMessage(res.data.message); resetForm(); fetchCountries(); })
        .catch(err => setMessage(err.response?.data?.message || "Error updating country"));
    } else {
      axios.post("http://localhost:5000/api/country/add", payload)
        .then(res => { setMessage(res.data.message); resetForm(); fetchCountries(); })
        .catch(err => setMessage(err.response?.data?.message || "Error adding country"));
    }
  };

  const handleEdit = (item) => { setFormData({ countryName: item.Country }); setEditId(item.CNID); window.scrollTo({ top: 0, behavior: "smooth" }); };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this country?")) return;
    axios.delete(`http://localhost:5000/api/country/delete/${id}`)
      .then(res => { setMessage(res.data.message); fetchCountries(); })
      .catch(err => setMessage(err.response?.data?.message || "Failed to delete country"));
  };

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="page-section">
      {message && <div className="alert alert-info">{message}</div>}

      <div className="card mb-4">
        <div className="card-body">
          <h3>{editId ? "Edit Country" : "Add Country"}</h3>

          <form ref={formRef} className="needs-validation" noValidate onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="col-md-6 mb-3">
                <label>Country Name <abbr title="Required">*</abbr></label>
                <input type="text" name="countryName" className="form-control" value={formData.countryName} onChange={handleChange} required />
                <div className="invalid-feedback">Please enter country name.</div>
              </div>
            </div>

            <button type="submit" className="btn btn-primary">{editId ? "Update Country" : "Add Country"}</button>
            {editId && <button type="button" className="btn btn-secondary ml-2" onClick={resetForm}>Cancel</button>}
          </form>
        </div>
      </div>

      

      <div className="card">
        <div className="card-body">
          <h3 className="card-title">Country List</h3>
          <div className="mb-3">
        <input type="text" className="form-control" placeholder="Search Country..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
      </div>
          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead>
                <tr><th>#</th><th>Country</th><th>Action</th></tr>
              </thead>
              <tbody>
                {countries.length > 0 ? countries.map((item, i) => (
                  <tr key={item.CNID}>
                    <td>{(page - 1) * limit + i + 1}</td>
                    <td>{item.Country}</td>
                    <td>
                      <button className="btn btn-warning btn-sm mr-2" onClick={() => handleEdit(item)}>✏️</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.CNID)}>🗑️</button>
                    </td>
                  </tr>
                )) : <tr><td colSpan="3" className="text-center">No records found.</td></tr>}
              </tbody>
            </table>
          </div>

          <nav>
            <ul className="pagination">
              <li className={`page-item ${page <= 1 ? "disabled" : ""}`}><button className="page-link" onClick={() => setPage(p => Math.max(1, p - 1))}>Previous</button></li>
              {Array.from({ length: totalPages }, (_, i) => (
                <li key={i} className={`page-item ${page === i + 1 ? "active" : ""}`}><button className="page-link" onClick={() => setPage(i + 1)}>{i + 1}</button></li>
              ))}
              <li className={`page-item ${page >= totalPages ? "disabled" : ""}`}><button className="page-link" onClick={() => setPage(p => Math.min(totalPages, p + 1))}>Next</button></li>
            </ul>
          </nav>

        </div>
      </div>
    </div>
  );
};

export default AddCountry;
