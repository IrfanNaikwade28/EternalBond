import React, { useState } from "react";
import axios from "axios";
import { userApi } from "../lib/api";
import { useNavigate,Link } from "react-router-dom";
//import { useNavigate, Link } from "react-router-dom"; // <-- Import Link
//import { useUser } from "../context/UserContext.jsx"; // Import your context hook
const Login = ({ setUser }) => {
  const [formData, setFormData] = useState({ Umobile: "", upass: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
 //const { setUserId } = useUser(); // Context function to store UID
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
console.log("data sending",payload)
      const res = await userApi.post("/api/auth/login", payload);

      if (res.data.user && res.data.user.urole === "user") {
        // Save in localStorage
        localStorage.setItem("user", JSON.stringify(res.data.user));

        // ✅ Update state in App
        setUser(res.data.user);
         // ✅ Save ONLY UID in context
        //setUserId(user.UID);
        //console.log("context",user.UID)
        // Redirect to dashboard
        navigate("/app");
        
      } else {
        setError("Invalid credentials or not an usee.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="card p-4" style={{ width: "600px" }}>
        <h3 className="text-center mb-3">User Login</h3>

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

          <button type="submit" className="btn text-white fw-bold w-100" style={{  background: "#d63384"}}>
            Login
          </button>
          <hr/>
          {/* ✅ Link to Register page */}
          <p className="text-muted fw-bold">
            Don't Have an Account?{" "}
            <Link to="/register" style={{color:" #d63384"} }
         >
              Register Now
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
