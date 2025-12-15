import React, { useEffect, useState } from "react";
import axios from "axios";

function AddAbout() {
  const [castList, setCastList] = useState([]);
  const [aboutList, setAboutList] = useState([]);

  const [form, setForm] = useState({
    cast: "",
    testimonial: ""
  });

  const [editId, setEditId] = useState(null);

  // Load cast and about list
  useEffect(() => {
    loadCast();
    loadAbout();
  }, []);

  const loadCast = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/about/cast");
      setCastList(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const loadAbout = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/about/all");
      setAboutList(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        // Update
        await axios.put(`http://localhost:5000/api/about/${editId}`, form);
        alert("Updated successfully!");
      } else {
        // Insert
        await axios.post("http://localhost:5000/api/about/add", form);
        alert("Added successfully!");
      }
      setForm({ cast: "", testimonial: "" });
      setEditId(null);
      loadAbout();
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = (data) => {
    setEditId(data.ABID);
    setForm({ cast: data.Cast, testimonial: data.ABOUT });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/about/${id}`);
      alert("Deleted successfully!");
      loadAbout();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="main-content">
      <div className="page-content">
        <div className="container-fluid">
      <h3>About</h3>
      <div className="card mb-4">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-4 mb-3">
                <label>Cast *</label>
                <select
                  className="form-control"
                  name="cast"
                  value={form.cast}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Cast</option>
                  {castList.map((c) => (
                    <option key={c.CTID} value={c.Cast}>
                      {c.Cast}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-8 mb-3">
                <label>Testimonial *</label>
                <textarea
                  className="form-control"
                  rows={6}
                  name="testimonial"
                  value={form.testimonial}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <button className="btn btn-primary">
              {editId ? "Update" : "Save"}
            </button>
            {editId && (
              <button
                type="button"
                className="btn btn-secondary ms-2"
                onClick={() => {
                  setEditId(null);
                  setForm({ cast: "", testimonial: "" });
                }}
              >
                Cancel
              </button>
            )}
          </form>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h5>About List</h5>
          <table className="table table-bordered mt-3">
            <thead>
              <tr>
                <th>#</th>
                <th>Cast</th>
                <th>Testimonial</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {aboutList.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-muted">
                    No data found
                  </td>
                </tr>
              ) : (
                aboutList.map((row, i) => (
                  <tr key={row.ABID}>
                    <td>{i + 1}</td>
                    <td>{row.Cast}</td>
                    <td>{row.ABOUT}</td>
                    <td>
                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() => handleEdit(row)}
                      >
                        Edit
                      </button>
                    </td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(row.ABID)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </div>
    </div>
  );
}

export default AddAbout;
