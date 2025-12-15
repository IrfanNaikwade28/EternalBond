import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../context/UserContext";

const HealthInfo = () => {
  //const { userId, setDiet, setDrink, setSmoking } = useUser();
const storedUser = localStorage.getItem("user");
  const userId = storedUser ? JSON.parse(storedUser).UID : null;
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

  const API_URL = "http://localhost:5000/api/health";

  // ✅ Fetch existing data for selected user
useEffect(() => {
  if (!userId) return;

  const fetchUserData = async () => {
    try {
      const res = await axios.get(`${API_URL}/${userId}`);

      console.log("Fetched Health Data:", res.data);

      if (res.data) {
        setFormData({
          UID: res.data.UID || "",
          specs: res.data.specs || "",
          Diet: res.data.Diet || "",
          Drink: res.data.Drink || "",
          Smoking: res.data.Smoking || "",
          Dieses: res.data.Dieses || "",
        });
      }
    } catch (err) {
      console.error("Error fetching user health info:", err);
    }
  };

  fetchUserData();
}, [userId]);




  // useEffect(() => {
  //   if (!userId) return;

  //   const fetchUserData = async () => {
  //     try {
  //       const res = await axios.get(`${API_URL}/${userId}`);

  //       if (res.data && res.data.data) {

  //       //   setFormData({
  //       //   UID: res.data.UID || "",
  //       //   specs: res.data.specs || "",
  //       //   Diet: res.data.Diet || "",
  //       //   Drink: res.data.Drink || "",
  //       //   Smoking: res.data.Smoking || "",
  //       //   Dieses: res.data.Dieses || ""
  //       // });
  //          setFormData(res.data.data);
  //          console.log("Fetched User Data:", res.data.data); // SHOW DATA IN CONSOLE
  //       }
  //     } catch (err) {
  //       console.error("Error fetching user health info:", err);
  //     }
  //   };

  //   fetchUserData();
  // }, [userId]);

  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // ✅ Validate fields before update
  const validateForm = () => {
    let newErrors = {};
    if (!formData.specs) newErrors.specs = "Required";
    if (!formData.Diet) newErrors.Diet = "Required";
    if (!formData.Drink) newErrors.Drink = "Required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ UPDATE only
  const handleUpdate = async () => {
    if (!validateForm()) return;

    try {
      const res = await axios.put(`${API_URL}/${formData.UID}`, formData);

      setMessage("Health Info Updated Successfully!");
setTimeout(() => setMessage(""), 2000);
      // store in global context
      // setDiet(formData.Diet);
      // setDrink(formData.Drink);
      // setSmoking(formData.Smoking);

      // setTimeout(() => {
      //   setMessage("");
      //   if (typeof onNextTab === "function") onNextTab();
      // }, 2000);
    } catch (err) {
      console.error(err);
      setMessage("Error updating");
      setTimeout(() => setMessage(""), 2000);
    }
  };

 return (
  <div className="container mt-4 mb-5">
    {message && <div className="alert alert-info text-center mt-3">{message}</div>}
    <div className="card shadow p-3">
      <h4 className="mb-3">Update Health Information</h4>

      {/* Row 1 */}
      <div className="row mb-4">
        <div className="col-md-6">
          <label>Spect <span className="text-danger">*</span></label>
          <div className="input-group">
            <span className="input-group-text">
              <i className="fas fa-glasses"></i>
            </span>
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
            {errors.specs && <small className="text-danger">{errors.specs}</small>}
          </div>
        </div>

        <div className="col-md-6">
          <label>Diet <span className="text-danger">*</span></label>
          <div className="input-group">
            <span className="input-group-text">
              <i className="fas fa-utensils"></i>
            </span>
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
            {errors.Diet && <small className="text-danger">{errors.Diet}</small>}
          </div>
        </div>
      </div>

      {/* Row 2 */}
      <div className="row mb-4">
        <div className="col-md-6">
          <label>Drink <span className="text-danger">*</span></label>
          <div className="input-group">
            <span className="input-group-text">
              <i className="fas fa-wine-glass-alt"></i>
            </span>
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
            {errors.Drink && <small className="text-danger">{errors.Drink}</small>}
          </div>
        </div>

        <div className="col-md-6">
          <label>Smoking</label>
          <div className="input-group">
            <span className="input-group-text">
              <i className="fas fa-smoking"></i>
            </span>
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
        </div>
      </div>

      {/* Row 3 */}
      <div className="row mb-4">
        <div className="col-md-6">
          <label>Dieses</label>
          <div className="input-group">
            <span className="input-group-text">
              <i className="fas fa-file-medical-alt"></i>
            </span>
            <input
              type="text"
              name="Dieses"
              value={formData.Dieses}
              onChange={handleChange}
              placeholder="Enter disease details"
              className="form-control"
            />
          </div>

          <button style={{ background: "#c52e79ff" }} className="btn text-white mt-2" onClick={handleUpdate}>
            <i className="fas fa-save me-2"></i>
            Update
          </button>
        </div>
      </div>
    </div>
  </div>
);
};

export default HealthInfo;
