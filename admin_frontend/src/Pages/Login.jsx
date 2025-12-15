import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = ({ setUser }) => {
  const [formData, setFormData] = useState({ Umobile: "", upass: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const payload = {
        Umobile: formData.Umobile.trim(),
        upass: formData.upass.trim(),
      };

      const res = await axios.post("http://localhost:5000/api/auth/login", payload);

      if (res.data.user && res.data.user.urole === "admin") {
        // Save in localStorage
        localStorage.setItem("user", JSON.stringify(res.data.user));

        // ✅ Update state in App
        setUser(res.data.user);

        // Redirect to dashboard
        navigate("/");
      } else {
        setError("Invalid credentials or not an admin.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="card p-4" style={{ width: "400px" }}>
        <h3 className="text-center mb-3">Admin Login</h3>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label>Mobile Number</label>
            <input
              type="text"
              name="Umobile"
              value={formData.Umobile}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="form-group mb-3">
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

          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
