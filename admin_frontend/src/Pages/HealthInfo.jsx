import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../context/UserContext";

const HealthInfo = ({ onNextTab }) => {
    const { userId, setDiet, setDrink, setSmoking } = useUser(); // ⬅ added setters here
  const [formData, setFormData] = useState({
    UID: "",
    specs: "",
    Diet: "",
    Drink: "",
    Smoking: "",
    Dieses: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [allData, setAllData] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);
const limit = 10;
const [searchUID, setSearchUID] = useState("");
  const API_URL = "http://localhost:5000/api/health";

const fetchAll = async (page = 1, search = "") => {
  try {
    const res = await axios.get(`${API_URL}?page=${page}&limit=${limit}&searchUID=${search}`);
    setAllData(res.data.data || []);
    setCurrentPage(res.data.pagination.currentPage);
    setTotalPages(res.data.pagination.totalPages);
  } catch (err) {
    console.error("Error fetching data:", err);
  }
};


const handleSearch = (e) => {
  e.preventDefault();
  fetchAll(1, searchUID.trim());
};



  // ✅ Fetch all records
//  const fetchAll = async (page = 1) => {
//   try {
//     const res = await axios.get(`${API_URL}?page=${page}&limit=${limit}`);
//     setAllData(res.data.data || []);
//     setCurrentPage(res.data.pagination.currentPage);
//     setTotalPages(res.data.pagination.totalPages);
//   } catch (err) {
//     console.error("Error fetching data:", err);
//   }
// };

useEffect(() => {
  fetchAll(currentPage);
}, [userId, currentPage]);

// ✅ Pagination handlers
const handlePrevPage = () => {
  if (currentPage > 1) setCurrentPage((prev) => prev - 1);
};

const handleNextPage = () => {
  if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
};


  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error message for that field on change
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // ✅ Validate required fields
  const validateForm = () => {
    let newErrors = {};
    if (!formData.specs) newErrors.specs = "This field is required";
    if (!formData.Diet) newErrors.Diet = "This field is required";
    if (!formData.Drink) newErrors.Drink = "This field is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Handle form submit (Insert or Update)

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  try {
    let res;
    let isInsert = false; // 🔹 Track if this is a new insert

    if (isEdit && formData.UID) {
      // 🔹 Update record
      res = await axios.put(`${API_URL}/${formData.UID}`, formData);
    } else {
      // 🔹 Insert new record
      res = await axios.post(API_URL, {
        UID: userId,
        specs: formData.specs,
        Diet: formData.Diet,
        Drink: formData.Drink,
        Smoking: formData.Smoking,
        Dieses: formData.Dieses,
      });
      isInsert = true;
    }

    // ✅ Store in global context
    setDiet(formData.Diet);
    setDrink(formData.Drink);
    setSmoking(formData.Smoking);

    // ✅ Show success message
    setMessage(res.data.message || "✅ Saved successfully!");
 fetchAll();
    // ✅ Reset form and refresh table
    setIsEdit(false);
    setFormData({ UID: "", specs: "", Diet: "", Drink: "", Smoking: "", Dieses: "" });
    fetchAll();

    // ✅ Move to next tab only on insert (not update)
    if (isInsert && typeof onNextTab === "function") {
      setTimeout(() => {
        setMessage("");
        onNextTab();
      }, 2000); // Wait 2 seconds, then move
    } else {
      // ✅ On update, only clear message after 2 seconds
      setTimeout(() => setMessage(""), 2000);
    }

  } catch (err) {
    console.error(err);
    setMessage(err.response?.data?.message || "❌ Error saving data");
    setTimeout(() => setMessage(""), 2000);
  }
};



  //   const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   if (!validateForm()) return;

  //   try {
  //     let res;
  //     if (isEdit && formData.UID) {
  //       // Update record
  //       res = await axios.put(`${API_URL}/${formData.UID}`, formData);
  //     } else {
  //       // Insert record
  //       res = await axios.post(API_URL, {
  //         UID: userId,
  //         specs: formData.specs,
  //         Diet: formData.Diet,
  //         Drink: formData.Drink,
  //         Smoking: formData.Smoking,
  //         Dieses: formData.Dieses,
  //       });
  //     }

  //     // ✅ Store in global UserContext after success
  //     setDiet(formData.Diet);
  //     setDrink(formData.Drink);
  //     setSmoking(formData.Smoking);

  //     setMessage(res.data.message);
  //     setTimeout(() => setMessage(""), 2000);
  //     setIsEdit(false);
  //     setFormData({ UID: "", specs: "", Diet: "", Drink: "", Smoking: "", Dieses: "" });
  //     fetchAll();
  //     if (typeof onNextTab === "function") {
  //     onNextTab();
  //   }
  //   } catch (err) {
  //     console.error(err);
  //     setMessage(err.response?.data?.message || "❌ Error saving data");
  //     setTimeout(() => setMessage(""), 2000);
  //   }
  // };

  // ✅ Handle Edit
  const handleEdit = (item) => {
    setFormData({
      UID: item.UID,
      specs: item.specs,
      Diet: item.Diet,
      Drink: item.Drink,
      Smoking: item.Smoking,
      Dieses: item.Dieses,
    });
    setIsEdit(true);
    setErrors({});
  };

  // ✅ Handle Delete
  const handleDelete = async (UID) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    try {
      const res = await axios.delete(`${API_URL}/${UID}`);
      setMessage(res.data.message);
       setTimeout(() => setMessage(""), 3000);
      fetchAll();
    } catch (err) {
      console.error(err);
      setMessage("❌ Error deleting record");
       setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div className="container mt-3" style={{ overflowX: "hidden", maxWidth: "100%" }}>
      <h3>Health Information</h3>

      <form onSubmit={handleSubmit} className="border p-3 rounded">
        <div className="row mb-2">
          {/* Specs */}
          <div className="col-md-2">
            <label>
              Spect <span className="text-danger">*</span>
            </label>
            <select
              name="specs"
              value={formData.specs}
              onChange={handleChange}
              className={`form-control ${errors.specs ? "is-invalid" : ""}`}
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
            {errors.specs && (
              <div className="text-danger small mt-1">{errors.specs}</div>
            )}
          </div>

          {/* Diet */}
          <div className="col-md-2">
            <label>
              Diet <span className="text-danger">*</span>
            </label>
            <select
              name="Diet"
              value={formData.Diet}
              onChange={handleChange}
              className={`form-control ${errors.Diet ? "is-invalid" : ""}`}
            >
              <option value="">Select</option>
              <option value="Veg">Veg</option>
              <option value="NonVeg">NonVeg</option>
              <option value="Eggetarian">Eggetarian</option>
            </select>
            {errors.Diet && (
              <div className="text-danger small mt-1">{errors.Diet}</div>
            )}
          </div>

          {/* Drink */}
          <div className="col-md-2">
            <label>
              Drink <span className="text-danger">*</span>
            </label>
            <select
              name="Drink"
              value={formData.Drink}
              onChange={handleChange}
              className={`form-control ${errors.Drink ? "is-invalid" : ""}`}
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
              <option value="Occasionally">Occasionally</option>
            </select>
            {errors.Drink && (
              <div className="text-danger small mt-1">{errors.Drink}</div>
            )}
          </div>

          {/* Smoking */}
          <div className="col-md-2">
            <label>Smoking</label>
            <select
              name="Smoking"
              value={formData.Smoking}
              onChange={handleChange}
              className="form-control"
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          {/* Dieses */}
          <div className="col-md-4">
            <label>Dieses (if any)</label>
            <input
              type="text"
              name="Dieses"
              value={formData.Dieses}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter disease details"
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary">
          {isEdit ? "Update" : "Save"}
        </button>

        {isEdit && (
          <button
            type="button"
            onClick={() => {
              setFormData({ UID: "", specs: "", Diet: "", Drink: "", Smoking: "", Dieses: "" });
              setIsEdit(false);
              setErrors({});
            }}
            className="btn btn-secondary ms-2"
          >
            Cancel
          </button>
        )}

        {message && <div className="mt-2 alert alert-info">{message}</div>}
      </form>

      <hr />

      <h5>All Records</h5>
      <hr />
<h5>All Records</h5>

{/* 🔍 Search Box */}
<form onSubmit={handleSearch} className="mb-3 d-flex align-items-center gap-2">
  <input
    type="text"
    className="form-control flex-grow-1"
    placeholder="Search by UID"
    value={searchUID}
    onChange={(e) => setSearchUID(e.target.value)}
  />
  <button type="submit" className="btn btn-primary">
    Search
  </button>
  <button
    type="button"
    className="btn btn-secondary"
    onClick={() => {
      setSearchUID("");
      fetchAll(1, "");
    }}
  >
    Reset
  </button>
</form>
 <h5 className="text-center mb-3">All User Health info</h5>
      <div className="table-responsive">
        <table className="table table-bordered text-center align-middle">
          <thead className="table-dark">
            <tr>
              <th>UID</th>
              <th>Spect</th>
              <th>Diet</th>
              <th>Drink</th>
              <th>Smoking</th>
              <th>Dieses</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {allData.map((item) => (
              <tr key={item.UID}>
                <td>{item.UID}</td>
                <td>{item.specs}</td>
                <td>{item.Diet}</td>
                <td>{item.Drink}</td>
                <td>{item.Smoking}</td>
                <td>{item.Dieses}</td>
                <td>
                  <button
                    onClick={() => handleEdit(item)}
                    className="btn btn-warning btn-sm me-2"
                  >
                    ✏️
                  </button>
                  {/* <button
                    onClick={() => handleDelete(item.UID)}
                    className="btn btn-danger btn-sm"
                  >
                    🗑️
                  </button> */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Pagination Controls */}
<div className="mt-3">
  <button
    className="btn btn-secondary"
    onClick={handlePrevPage}
    disabled={currentPage === 1}
  >
    ⬅️ Prev
  </button>

  <span className="m-3">
    Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
  </span>

  <button
    className="btn btn-secondary"
    onClick={handleNextPage}
    disabled={currentPage === totalPages}
  >
    Next ➡️
  </button>
</div>

      </div>
    </div>
  );
};

export default HealthInfo;
