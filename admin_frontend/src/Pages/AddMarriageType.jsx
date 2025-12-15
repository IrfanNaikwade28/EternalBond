import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const AddMarriageType = () => {
  const [formData, setFormData] = useState({ marriage: "" });
  const [marriages, setMarriages] = useState([]);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [message, setMessage] = useState(null);
  const limit = 5;
  const formRef = useRef(null);

  // ✅ Fetch marriage types
  const fetchMarriages = () => {
    axios
      .get(`http://localhost:5000/api/marriage/list?search=${search}&page=${page}`)
      .then((res) => {
        if (res.data.success) {
          setMarriages(res.data.data);
          setTotal(res.data.total);
        }
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchMarriages();
  }, [page, search]);

  // ✅ Auto-clear messages
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // ✅ Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Add / Update Marriage
  const handleSubmit = (e) => {
    e.preventDefault();
    const form = formRef.current;
    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      return;
    }

    const data = { marriage: formData.marriage.trim() };

    const request = editId
      ? axios.put(`http://localhost:5000/api/marriage/update`, { MRID: editId, marriage: data.marriage })
      : axios.post(`http://localhost:5000/api/marriage/add`, data);

    request
      .then((res) => {
        setMessage(res.data.message);
        setFormData({ marriage: "" });
        setEditId(null);
        form.classList.remove("was-validated");
        fetchMarriages();
      })
      .catch((err) => {
        if (err.response?.status === 400 || err.response?.status === 409) {
          setMessage(err.response.data.message);
        } else {
          setMessage("Something went wrong");
        }
      });
  };
const resetForm = () => { setFormData({ marriage: "" }); setEditId(null); formRef.current?.classList.remove("was-validated"); };
  // ✅ Edit Marriage
  const handleEdit = (item) => {
    setFormData({ marriage: item.Marriage });
    setEditId(item.MRID);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ✅ Delete Marriage
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this Marriage Type?")) {
      axios
        .delete(`http://localhost:5000/api/marriage/delete/${id}`)
        .then((res) => {
          setMessage(res.data.message);
          fetchMarriages();
        })
        .catch((err) => console.error(err));
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="page-section container mt-4">
      {/* ✅ Success/Error Message */}
      {message && <div className="alert alert-success">{message}</div>}

      {/* ✅ Add/Edit Form */}
      <div className="card mb-4">
        <div className="card-body">
          <h3>
            {editId ? "Edit Marriage Type" : "Add Marriage Type"}
          </h3>
          <form ref={formRef} className="needs-validation" noValidate onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="col-md-6 mb-3">
                <label>
                  Marriage Type <abbr title="Required">*</abbr>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="marriage"
                  value={formData.marriage}
                  onChange={handleChange}
                  required
                />
                <div className="invalid-feedback">Please enter a marriage type.</div>
              </div>
            </div>
            <button type="submit" className="btn btn-primary">
              {editId ? "Update" : "Add"} Marriage Type
            </button>
             {editId && <button type="button" className="btn btn-secondary ml-2" onClick={resetForm}>Cancel</button>}
          </form>
        </div>
      </div>

     

      {/* ✅ Marriage List Table */}
      <div className="card">
        <div className="card-body">
          <h3 className="card-title">Marriage Type List</h3>
           {/* ✅ Search Box */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search Marriage Type..."
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
                  <th>Marriage Type</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {marriages.length > 0 ? (
                  marriages.map((m, idx) => (
                    <tr key={m.MRID}>
                      <td>{(page - 1) * limit + idx + 1}</td>
                      <td>{m.Marriage}</td>
                      <td>
                        <button
                          className="btn btn-warning btn-sm mr-2"
                          onClick={() => handleEdit(m)}
                        >
                          ✏️
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(m.MRID)}
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center">
                      No marriage types found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* ✅ Pagination */}
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

export default AddMarriageType;
