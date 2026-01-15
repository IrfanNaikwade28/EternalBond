import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { adminApi } from "../lib/api";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    txtuser: "",
    txtmobile: "",
    txtaltno: "",
    txtwhatsapp: "",
    txtemail: "",
    txtgender: "",
    txtaddress: "",
    upass: "",
    role: "user",
  });

  const [files, setFiles] = useState({
    uprofile: null,
    aadhar_front_photo: null,
    aadhar_back_photo: null,
  });

  const [preview, setPreview] = useState({
    uprofile: "",
    aadhar_front_photo: "",
    aadhar_back_photo: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    setFiles({ ...files, [e.target.name]: file });
    setPreview({ ...preview, [e.target.name]: URL.createObjectURL(file) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => data.append(key, formData[key]));
      Object.keys(files).forEach((key) => {
        if (files[key]) data.append(key, files[key]);
      });

      const res = await adminApi.post("/api/users", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        alert("User registered successfully!");
        navigate("/login");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light p-2">
      <div className="card p-4 w-100" style={{ maxWidth: "450px" }}>
        <h3 className="text-center mb-3">User Registration</h3>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Candidate Name</label>
            <input
              type="text"
              name="txtuser"
              value={formData.txtuser}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="mb-3">
            <label>Mobile Number</label>
            <input
              type="text"
              name="txtmobile"
              value={formData.txtmobile}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              name="upass"
              value={formData.upass}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="mb-3">
            <label>Gender</label>
            <select
              name="txtgender"
              className="form-control"
              value={formData.txtgender}
              onChange={handleChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="mb-3">
            <label>Profile Photo</label>
            <input
              type="file"
              name="uprofile"
              className="form-control"
              onChange={handleFile}
              required
            />
            {preview.uprofile && (
              <img
                src={preview.uprofile}
                width="110"
                className="mt-2 rounded border"
                alt="Profile Photo"
              />
            )}
          </div>

          <div className="mb-3">
            <label>Aadhar Front Photo</label>
            <input
              type="file"
              name="aadhar_front_photo"
              className="form-control"
              onChange={handleFile}
              required
            />
            {preview.aadhar_front_photo && (
              <img
                src={preview.aadhar_front_photo}
                width="110"
                className="mt-2 rounded border"
                alt="Front Aadhar"
              />
            )}
          </div>

          <div className="mb-3">
            <label>Aadhar Back Photo (optional)</label>
            <input
              type="file"
              name="aadhar_back_photo"
              className="form-control"
              onChange={handleFile}
            />
            {preview.aadhar_back_photo && (
              <img
                src={preview.aadhar_back_photo}
                width="110"
                className="mt-2 rounded border"
                alt="Back Aadhar"
              />
            )}
          </div>

          <button
            type="submit"
            className="btn text-white fw-bold w-100"
            style={{   background: "#d63384",}}
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>

          <p className="text-muted fw-bold mt-3 text-center">
            Already have an account?{" "}
            <Link to="/login" style={{color:" #d63384"}}>
              Login Now
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
