import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const AddSubCast = () => {
  const [formData, setFormData] = useState({ subCastName: "", castId: "" });
  const [subCasts, setSubCasts] = useState([]);
  const [casts, setCasts] = useState([]);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [message, setMessage] = useState(null);
  const formRef = useRef(null);
  const limit = 5;

  // fetch casts and list
  const fetchCasts = () => {
    axios.get("http://localhost:5000/api/subcast/casts")
      .then(res => { if (res.data.success) setCasts(res.data.data); })
      .catch(err => console.error(err));
  };

  const fetchSubCasts = () => {
    axios.get(`http://localhost:5000/api/subcast/list?search=${encodeURIComponent(search)}&page=${page}&limit=${limit}`)
      .then(res => {
        if (res.data.success) {
          setSubCasts(res.data.data);
          setTotal(res.data.total);
        }
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchCasts();
    fetchSubCasts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, page]);

  // auto clear message
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(null), 3000);
    return () => clearTimeout(t);
  }, [message]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const resetForm = () => {
    setFormData({ subCastName: "", castId: "" });
    setEditId(null);
    formRef.current?.classList.remove("was-validated");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = formRef.current;
    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      return;
    }

    const payload = { subCastName: formData.subCastName.trim(), castId: formData.castId };

    if (editId) {
      // update
      axios.put("http://localhost:5000/api/subcast/update", { SCTID: editId, ...payload })
        .then(res => {
          setMessage(res.data.message);
          resetForm();
          fetchSubCasts();
        })
        .catch(err => {
          const status = err.response?.status;
          setMessage(err.response?.data?.message || "Error updating SubCast");
          if (status === 409) { /* duplicate */ }
        });
    } else {
      // add
      axios.post("http://localhost:5000/api/subcast/add", payload)
        .then(res => {
          setMessage(res.data.message);
          resetForm();
          fetchSubCasts();
        })
        .catch(err => {
          const status = err.response?.status;
          setMessage(err.response?.data?.message || "Error adding SubCast");
          if (status === 409) { /* duplicate */ }
        });
    }
  };

  const handleEdit = (item) => {
    setFormData({ subCastName: item.Subcast, castId: item.CTID });
    setEditId(item.SCTID);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this SubCast?")) return;
    axios.delete(`http://localhost:5000/api/subcast/delete/${id}`)
      .then(res => {
        setMessage(res.data.message);
        // if current page becomes empty after delete, go to previous page
        fetchSubCasts();
      })
      .catch(err => {
        setMessage(err.response?.data?.message || "Failed to delete SubCast");
      });
  };

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="page-section ">
      {message && <div className="alert alert-info">{message}</div>}

      <div className="card mb-4">
        <div className="card-body">
          <h3 >{editId ? "Edit SubCast" : "Add SubCast"}</h3>

          <form ref={formRef} className="needs-validation" noValidate onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="col-md-6 mb-3">
                <label>SubCast Name <abbr title="Required">*</abbr></label>
                <input
                  name="subCastName"
                  type="text"
                  className="form-control"
                  value={formData.subCastName}
                  onChange={handleChange}
                  required
                />
                <div className="invalid-feedback">Please enter SubCast name.</div>
              </div>

              <div className="col-md-6 mb-3">
                <label>Cast <abbr title="Required">*</abbr></label>
                <select
                  name="castId"
                  className="custom-select d-block w-100"
                  value={formData.castId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Choose Cast</option>
                  {casts.map(c => <option key={c.CTID} value={c.CTID}>{c.Cast}</option>)}
                </select>
                <div className="invalid-feedback">Please select a cast.</div>
              </div>
            </div>

            <button type="submit" className="btn btn-primary">
              {editId ? "Update SubCast" : "Add SubCast"}
            </button>
            {editId && (
              <button type="button" className="btn btn-secondary ml-2" onClick={resetForm}>Cancel</button>
            )}
          </form>
        </div>
      </div>

    

      <div className="card">
        <div className="card-body">
          <h3 className="card-title">SubCast List</h3>
            <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search SubCast..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
        />
      </div>
          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>#</th>
                  <th>SubCast</th>
                  <th>Cast</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {subCasts.length > 0 ? subCasts.map((item, i) => (
                  <tr key={item.SCTID}>
                    <td>{(page - 1) * limit + i + 1}</td>
                    <td>{item.Subcast}</td>
                    <td>{item.CastName}</td>
                    <td>
                      <button className="btn btn-warning btn-sm mr-2" onClick={() => handleEdit(item)}>✏️</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.SCTID)}>🗑️</button>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="4" className="text-center">No records found.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          <nav>
            <ul className="pagination">
              <li className={`page-item ${page <= 1 ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => setPage(p => Math.max(1, p - 1))}>Previous</button>
              </li>
              {Array.from({ length: totalPages }, (_, i) => (
                <li key={i} className={`page-item ${page === i + 1 ? "active" : ""}`}>
                  <button className="page-link" onClick={() => setPage(i + 1)}>{i + 1}</button>
                </li>
              ))}
              <li className={`page-item ${page >= totalPages ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => setPage(p => Math.min(totalPages, p + 1))}>Next</button>
              </li>
            </ul>
          </nav>

        </div>
      </div>
    </div>
  );
};

export default AddSubCast;
