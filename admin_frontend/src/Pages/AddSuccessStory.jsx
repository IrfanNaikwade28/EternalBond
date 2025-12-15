import React, { useEffect, useState } from "react";
import axios from "axios";

const AddSuccessStory = () => {
  const [grooms, setGrooms] = useState([]);
  const [brides, setBrides] = useState([]);
  const [stories, setStories] = useState([]);

  const [form, setForm] = useState({
    Groomname: "",
    Bridename: "",
    Feedback: "",
    simg: null,
    oldImg: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [message, setMessage] = useState(""); // ✅ Success message
  const limit = 5;

  // Load DDL + Stories
  useEffect(() => {
    loadDropdowns();
    loadStories();
  }, []);

  const loadDropdowns = async () => {
    try {
      const groomRes = await axios.get("http://localhost:5000/api/successstory/grooms");
      setGrooms(groomRes.data);

      const brideRes = await axios.get("http://localhost:5000/api/successstory/brides");
      setBrides(brideRes.data);
    } catch (err) {
      console.log("Dropdown Load Error:", err);
    }
  };

  const loadStories = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/successstory/all");
      setStories(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log("Load Stories Error:", err);
    }
  };

  // Submit / Update
  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("Groomname", form.Groomname);
    fd.append("Bridename", form.Bridename);
    fd.append("Feedback", form.Feedback);
    fd.append("oldImg", form.oldImg);

    if (form.simg) {
      fd.append("simg", form.simg);
    }

    try {
      let res;
      if (editingId) {
        res = await axios.put(
          `http://localhost:5000/api/successstory/update/${editingId}`,
          fd
        );
      } else {
        res = await axios.post("http://localhost:5000/api/successstory/add", fd);
      }

      // ✅ Show success message
      setMessage(res.data.message);
      setTimeout(() => setMessage(""), 3000); // hide after 3 sec

      setForm({
        Groomname: "",
        Bridename: "",
        Feedback: "",
        simg: null,
        oldImg: "",
      });

      setEditingId(null);
      loadStories();
    } catch (err) {
      console.log("Submit Error:", err);
    }
  };

  // Edit Story
  const handleEdit = async (SID) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/successstory/${SID}`);
      const data = res.data;

      setForm({
        Groomname: data.groomname,
        Bridename: data.Bridename,
        Feedback: data.Feedback,
        simg: null,
        oldImg: data.simg,
      });

      setEditingId(SID);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.log("Edit Error:", err);
    }
  };

  // Delete Story
  const handleDelete = async (SID) => {
    if (!window.confirm("Are you sure you want to delete this story?")) return;

    try {
      const res = await axios.delete(`http://localhost:5000/api/successstory/delete/${SID}`);
      setMessage(res.data.message); // ✅ show delete message
      setTimeout(() => setMessage(""), 3000);

      loadStories();
    } catch (err) {
      console.log("Delete Error:", err);
    }
  };

  // Search + Pagination
  const filtered = stories.filter(
    (s) =>
      s.groomname.toLowerCase().includes(search.toLowerCase()) ||
      s.Bridename.toLowerCase().includes(search.toLowerCase())
  );

  const paginated = filtered.slice((page - 1) * limit, page * limit);

  return (
    <div className="main-content">
      <div className="page-content">
        <div className="container-fluid">
          <h3>Success Story</h3>

          {/* ================= FORM CARD ================= */}
          <div className="card">
            <div className="card-body">
              {/* ✅ Success Message */}
              {message && <div className="alert alert-success">{message}</div>}

              <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="row">
                  {/* Groom */}
                  <div className="col-md-3 mb-3">
                    <label>Select Groom</label>
                    <select
                      className="form-control"
                      value={form.Groomname}
                      required
                      onChange={(e) =>
                        setForm({ ...form, Groomname: e.target.value })
                      }
                    >
                      <option value="">--- Select Groom ---</option>
                      {grooms.map((g) => (
                        <option key={g.UID} value={g.Uname}>
                          {g.Uname}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Bride */}
                  <div className="col-md-3 mb-3">
                    <label>Select Bride</label>
                    <select
                      className="form-control"
                      value={form.Bridename}
                      required
                      onChange={(e) =>
                        setForm({ ...form, Bridename: e.target.value })
                      }
                    >
                      <option value="">--- Select Bride ---</option>
                      {brides.map((b) => (
                        <option key={b.UID} value={b.Uname}>
                          {b.Uname}
                        </option>
                      ))}
                    </select>
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
                    <div className="col-md-3 mb-3">
                      <label>Old Image</label>
                      <br />
                      <img
                        src={`http://localhost:5000/uploads/story/${form.oldImg}`}
                        width="120"
                        style={{ borderRadius: "5px" }}
                      />
                    </div>
                  )}
                </div>

                <div className="row">
                  {/* Feedback */}
                  <div className="col-md-6 mb-3">
                    <label>Feedback</label>
                    <textarea
                      className="form-control"
                      rows={5}
                      value={form.Feedback}
                      onChange={(e) =>
                        setForm({ ...form, Feedback: e.target.value })
                      }
                    ></textarea>
                  </div>
                </div>

                <button className="btn btn-primary">
                  {editingId ? "Update Story" : "Add Story"}
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
                  placeholder="Search by Groom or Bride"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <table className="table table-bordered table-striped">
                <thead className="table-dark">
                  <tr>
                    <th>SID</th>
                    <th>Groom</th>
                    <th>Bride</th>
                    <th>Feedback</th>
                    <th>Photo</th>
                    <th>Edit</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center">
                        No Records Found
                      </td>
                    </tr>
                  ) : (
                    paginated.map((s) => (
                      <tr key={s.SID}>
                        <td>{s.SID}</td>
                        <td>{s.groomname}</td>
                        <td>{s.Bridename}</td>
                        <td>{s.Feedback.slice(0, 40)}...</td>
                        <td>
                          <img
                            src={`http://localhost:5000/uploads/story/${s.simg}`}
                            width="80"
                          />
                        </td>
                        <td>
                          <button
                            className="btn btn-warning btn-sm"
                            onClick={() => handleEdit(s.SID)}
                          >
                            Edit
                          </button>
                        </td>
                        <td>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(s.SID)}
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

export default AddSuccessStory;
