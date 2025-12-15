import React, { useState, useEffect } from "react";
import axios from "axios";

const AddTestimonial = () => {
  const [form, setForm] = useState({
    name: "",
    testimonial: "",
    simg: null,
    oldImg: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [testimonials, setTestimonials] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [message, setMessage] = useState(""); // ✅ Success message
  const limit = 5;

  // Load testimonials
  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/testimonial");
      setTestimonials(res.data);
    } catch (err) {
      console.log("Load Error:", err);
    }
  };

  // Submit / Update
  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("testimonial", form.testimonial);
    fd.append("oldImg", form.oldImg);

    if (form.simg) fd.append("simg", form.simg);

    try {
      if (editingId) {
        await axios.put(
          `http://localhost:5000/api/testimonial/${editingId}`,
          fd
        );
        setMessage("Testimonial updated successfully!");
      } else {
        await axios.post("http://localhost:5000/api/testimonial", fd);
        setMessage("Testimonial added successfully!");
      }

      setForm({ name: "", testimonial: "", simg: null, oldImg: "" });
      setEditingId(null);
      loadTestimonials();

      // ✅ Hide message after 3 seconds
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.log("Submit Error:", err);
    }
  };

  // Edit
  const handleEdit = async (TSID) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/testimonial/${TSID}`
      );
      const data = res.data;
      setForm({
        name: data.Name,
        testimonial: data.Testimonial,
        simg: null,
        oldImg: data.simg,
      });
      setEditingId(TSID);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.log("Edit Error:", err);
    }
  };

  // Delete
  const handleDelete = async (TSID) => {
    if (!window.confirm("Are you sure you want to delete this testimonial?"))
      return;

    try {
      await axios.delete(`http://localhost:5000/api/testimonial/${TSID}`);
      setMessage("Testimonial deleted successfully!");
      loadTestimonials();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.log("Delete Error:", err);
    }
  };

  // Pagination & Search
  const filtered = testimonials.filter(
    (t) =>
      t.Name.toLowerCase().includes(search.toLowerCase()) ||
      t.Testimonial.toLowerCase().includes(search.toLowerCase())
  );
  const paginated = filtered.slice((page - 1) * limit, page * limit);

  return (
    <div className="main-content">
      <div className="page-content">
        <div className="container-fluid">
          <h3>Testimonials</h3>

          {/* ================= SUCCESS MESSAGE ================= */}
          {message && (
            <div className="alert alert-success">{message}</div>
          )}

          {/* ================= FORM ================= */}
          <div className="card">
            <div className="card-body">
              <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="row">
                  {/* Name */}
                  <div className="col-md-3 mb-3">
                    <label>Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Name"
                      value={form.name}
                      required
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                    />
                  </div>

                  {/* Testimonial */}
                  <div className="col-md-6 mb-3">
                    <label>Testimonial *</label>
                    <textarea
                      className="form-control"
                      rows={2}
                      value={form.testimonial}
                      required
                      onChange={(e) =>
                        setForm({ ...form, testimonial: e.target.value })
                      }
                    ></textarea>
                  </div>

                  {/* Image Upload */}
                  <div className="col-md-3 mb-3">
                    <label>Choose Photo *</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={(e) =>
                        setForm({ ...form, simg: e.target.files[0] })
                      }
                    />
                  </div>

                  {/* Old Image Preview */}
                  {editingId && form.oldImg && (
                    <div className="col-md-3 mb-3 mt-2">
                      <label>Old Image</label>
                      <br />
                      <img
                        src={`http://localhost:5000/uploads/testimonial/${form.oldImg}`}
                        width="120"
                        style={{ borderRadius: "5px" }}
                        alt="Old"
                      />
                    </div>
                  )}
                </div>

                <button className="btn btn-primary mt-2">
                  {editingId ? "Update Testimonial" : "Add Testimonial"}
                </button>
              </form>
            </div>
          </div>

          {/* ================= TABLE ================= */}
          <div className="card mt-4">
            <div className="card-body">
              {/* Search */}
              <div className="d-flex mb-3">
                <input
                  className="form-control me-3"
                  placeholder="Search by Name or Testimonial"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <table className="table table-bordered table-striped">
                <thead className="table-dark">
                  <tr>
                    <th>TSID</th>
                    <th>Name</th>
                    <th>Testimonial</th>
                    <th>Photo</th>
                    <th>Edit</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center">
                        No Records Found
                      </td>
                    </tr>
                  ) : (
                    paginated.map((t) => (
                      <tr key={t.TSID}>
                        <td>{t.TSID}</td>
                        <td>{t.Name}</td>
                        <td>{t.Testimonial.slice(0, 40)}...</td>
                        <td>
                          {t.simg && (
                            <img
                              src={`http://localhost:5000/uploads/testimonial/${t.simg}`}
                              width="80"
                              alt="testimonial"
                            />
                          )}
                        </td>
                        <td>
                          <button
                            className="btn btn-warning btn-sm"
                            onClick={() => handleEdit(t.TSID)}
                          >
                            Edit
                          </button>
                        </td>
                        <td>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(t.TSID)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="mt-3">
                <button
                  className="btn btn-outline-primary me-2"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  Prev
                </button>
                <button
                  className="btn btn-outline-primary"
                  disabled={page * limit >= filtered.length}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTestimonial;
