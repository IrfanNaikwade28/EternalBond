import React, { useEffect, useState } from "react";
import axios from "axios";
import { adminApi, asset } from "../lib/api";

const UserBasicInfo = () => {
  const storedUser = localStorage.getItem("user");
  const uid = storedUser ? JSON.parse(storedUser).UID : null;

  const [successMsg, setSuccessMsg] = useState("");

  const [form, setForm] = useState({
    txtuser: "",
    txtmobile: "",
    txtaltno: "",
    txtwhatsapp: "",
    txtemail: "",
    txtgender: "",
    txtaddress: "",
    upass: "",
    role: "user",
    uprofile: "",
    aadhar_front_photo: "",
    aadhar_back_photo: "",
  });

  const [files, setFiles] = useState({
    uprofile: null,
    aadhar_front_photo: null,
    aadhar_back_photo: null,
  });

  // =======================
  // FETCH USER
  // =======================
  useEffect(() => {
    if (!uid) return;

    adminApi
      .get(`/api/users/${uid}`)
      .then((res) => {
        const data = res.data || {};
        console.log("data=" + (data.urole || ""));
        setForm({
          txtuser: data.Uname || "",
          txtmobile: data.Umobile || "",
          txtaltno: data.alt_mobile || "",
          txtwhatsapp: data.whatsappno || "",
          txtemail: data.Email || "",
          txtgender: data.Gender || "",
          txtaddress: data.address || "",
          upass: data.upass || "",
          role: data.urole || "user",
          uprofile: data.uprofile || "",
          aadhar_front_photo: data.aadhar_front_photo || "",
          aadhar_back_photo: data.aadhar_back_photo || "",
        });
      })
      .catch((err) => console.error("Fetch error:", err));
  }, [uid]);

  // =======================
  // HANDLE INPUT
  // =======================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // =======================
  // HANDLE FILES
  // =======================
  const handleFile = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };

  // =======================
  // UPDATE USER
  // =======================
  const saveData = async () => {
    const fd = new FormData();

    Object.keys(form).forEach((key) => fd.append(key, form[key]));

    if (files.uprofile) fd.append("uprofile", files.uprofile);
    if (files.aadhar_front_photo)
      fd.append("aadhar_front_photo", files.aadhar_front_photo);
    if (files.aadhar_back_photo)
      fd.append("aadhar_back_photo", files.aadhar_back_photo);

    try {
      const res = await adminApi.put(
        `/api/users/${uid}`,
        fd,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setSuccessMsg("User Basic info  updated successfully!");

      // auto-hide alert
      setTimeout(() => setSuccessMsg(""), 3000);

    } catch (error) {
      console.log(error);
      alert("Update failed!");
    }
  };

 return (
  <div className="container mt-4 mb-5  p-4 border rounded shadow-sm" style={{height:"100%"}}>

    {/* SUCCESS MESSAGE */}
    {successMsg && (
      <div className="alert alert-info text-center fw-bold">
        {successMsg}
      </div>
    )}

    <div className="row">

      <div className="col-md-6 mb-3">
        <label>Name</label>
        <div className="input-group">
          <span className="input-group-text">
            <i className="fas fa-user"></i>
          </span>
          <input
            type="text"
            name="txtuser"
            className="form-control"
            value={form.txtuser}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="col-md-6 mb-3">
        <label>Mobile</label>
        <div className="input-group">
          <span className="input-group-text">
            <i className="fas fa-mobile-alt"></i>
          </span>
          <input
            type="text"
            name="txtmobile"
            className="form-control"
            value={form.txtmobile}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="col-md-6 mb-3">
        <label>Alternate Mobile</label>
        <div className="input-group">
          <span className="input-group-text">
            <i className="fas fa-phone"></i>
          </span>
          <input
            type="text"
            name="txtaltno"
            className="form-control"
            value={form.txtaltno}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="col-md-6 mb-3">
        <label>WhatsApp No</label>
        <div className="input-group">
          <span className="input-group-text">
            <i className="fab fa-whatsapp"></i>
          </span>
          <input
            type="text"
            name="txtwhatsapp"
            className="form-control"
            value={form.txtwhatsapp}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="col-md-6 mb-3">
        <label>Email</label>
        <div className="input-group">
          <span className="input-group-text">
            <i className="fas fa-envelope"></i>
          </span>
          <input
            type="email"
            name="txtemail"
            className="form-control"
            value={form.txtemail}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* GENDER DROPDOWN */}
      <div className="col-md-6 mb-3">
        <label>Gender</label>
        <div className="input-group">
          <span className="input-group-text">
            <i className="fas fa-venus-mars"></i>
          </span>
          <select
            name="txtgender"
            className="form-control"
            value={form.txtgender}
            onChange={handleChange}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div className="col-12 mb-3">
        <label>Address</label>
        <div className="input-group">
          <span className="input-group-text">
            <i className="fas fa-map-marker-alt"></i>
          </span>
          <textarea
            name="txtaddress"
            className="form-control"
            value={form.txtaddress}
            onChange={handleChange}
          ></textarea>
        </div>
      </div>

      {/* PROFILE IMAGE */}
      <div className="col-md-4 mb-3">
        <label>Profile Photo</label>
        <div className="input-group">
          <span className="input-group-text">
            <i className="fas fa-camera"></i>
          </span>
          <input
            type="file"
            name="uprofile"
            className="form-control"
            onChange={handleFile}
          />
        </div>
        {form.uprofile && (
          <img
            src={asset(`photos/${form.uprofile}`)}
            width="100"
            className="mt-2 rounded border"
          />
        )}
      </div>

      {/* AADHAAR FRONT */}
      <div className="col-md-4 mb-3">
        <label>Aadhar Front Photo</label>
        <div className="input-group">
          <span className="input-group-text">
            <i className="fas fa-id-card"></i>
          </span>
          <input
            type="file"
            name="aadhar_front_photo"
            className="form-control"
            onChange={handleFile}
          />
        </div>
        {form.aadhar_front_photo && (
          <img
            src={asset(`aadhar/${form.aadhar_front_photo}`)}
            width="110"
            className="mt-2 rounded border"
          />
        )}
      </div>

      {/* AADHAAR BACK */}
      <div className="col-md-4 mb-3">
        <label>Aadhar Back Photo</label>
        <div className="input-group">
          <span className="input-group-text">
            <i className="fas fa-id-card"></i>
          </span>
          <input
            type="file"
            name="aadhar_back_photo"
            className="form-control"
            onChange={handleFile}
          />
        </div>
        {form.aadhar_back_photo && (
          <img
            src={asset(`aadhar/${form.aadhar_back_photo}`)}
            width="110"
            className="mt-2 rounded border"
          />
        )}
      </div>

      <div className="col-12 text-start">
        <button
          className="btn text-white px-4"
          onClick={saveData}
          style={{  background: "#c52e79ff", }}
        >
          <i className="fas fa-save me-2"></i>
          Update
        </button>
      </div>

    </div>
  </div>
);
};

export default UserBasicInfo;
