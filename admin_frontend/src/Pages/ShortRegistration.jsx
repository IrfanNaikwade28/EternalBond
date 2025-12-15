import React, { useState } from "react";
import { useUser } from "../context/UserContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ShortRegistration() {
  const { setUserId } = useUser();
   const navigate = useNavigate();   // ✅ REQUIRED
  const [form, setForm] = useState({
    txtuser: "",
    txtmobile: "",
    txtgender: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/register", form);
      const { UID } = res.data;

      // Store UID in context
      setUserId(UID);

      alert("User Registered Successfully!");
       // Go to Add User Details page
      navigate("/AddUserDetails");
      console.log("Inserted UID:", UID);
    } catch (err) {
      console.error(err);
      alert("Registration failed!");
    }
  };

  return (
    <div className="main-content">
      <div className="page-content container-fluid">
        <h3>Short User Registration</h3>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-4 mb-3">
              <label>User Name / नाव</label>
              <input
                type="text"
                name="txtuser"
                className="form-control"
                value={form.txtuser}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-4 mb-3">
              <label>WhatsApp Mobile No. / मोबाइल नं.</label>
              <input
                type="text"
                name="txtmobile"
                className="form-control"
                value={form.txtmobile}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-4 mb-3">
              <label>Select Gender</label>
              <select
                name="txtgender"
                className="form-control"
                value={form.txtgender}
                onChange={handleChange}
                required
              >
                <option value="">--- Select Gender ---</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn btn-primary">Save and Next</button>
        </form>
      </div>
    </div>
  );
}
