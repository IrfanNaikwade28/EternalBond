import React, { useState, useEffect } from "react";
import axios from "axios";
// import { useUser } from "../context/UserContext"; // Uncomment if you need setCtid

const UserDetailInfo = () => {
  // const { setCtid } = useUser();
  const storedUser = localStorage.getItem("user");
  const userId = storedUser ? JSON.parse(storedUser).UID : null;

  const [formData, setFormData] = useState({
    txtcast: "",
    txtscast: "",
    txtWeight: "",
    txtheight: "",
    txtVarn: "",
    txtbplace: "",
    txtDOB: "",
    txtbtime: "",
    txtmtype: "",
    txtbid: "",
    txtexpectation: "",
  });

  const [casts, setCasts] = useState([]);
  const [subCasts, setSubCasts] = useState([]);
  const [heights, setHeights] = useState([]);
  const [marriageTypes, setMarriageTypes] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch dropdowns
  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [castRes, heightRes, marriageRes] = await Promise.all([
          axios.get("http://localhost:5000/api/cast"),
          axios.get("http://localhost:5000/api/height/all"),
          axios.get("http://localhost:5000/api/marriage/all"),
        ]);
        setCasts(castRes.data);
        setHeights(heightRes.data);
        setMarriageTypes(marriageRes.data);
      } catch (err) {
        console.error("Error fetching dropdowns:", err);
      }
    };
    fetchDropdowns();
  }, []);

  // Fetch existing user details
  useEffect(() => {
    if (!userId) return;

    const fetchUserDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/userdetails/${userId}`);
        const data = res.data;

        if (data && data.UID) {
          setFormData({
            txtcast: data.CTID || "",
            txtscast: data.SCTID || "",
            txtWeight: data.weight || "",
            txtheight: data.height || "",
            txtVarn: data.varn || "",
            txtbplace: data.birthplace || "",
            txtDOB: data.DOB ? data.DOB.split("T")[0] : "",
            txtbtime: data.dob_time || "",
            txtmtype: data.marriage_type || "",
            txtbid: data.bloodgroup || "",
            txtexpectation: data.Expectation || "",
          });

          if (data.CTID) {
            const subcastRes = await axios.get(`http://localhost:5000/api/cast/${data.CTID}/subcasts`);
            setSubCasts(subcastRes.data);
          }
        }
      } catch (err) {
        console.error("Error fetching user details:", err);
      }
    };

    fetchUserDetails();
  }, [userId]);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "txtcast") {
      try {
        const subcastRes = await axios.get(`http://localhost:5000/api/cast/${value}/subcasts`);
        setSubCasts(subcastRes.data);
        setFormData((prev) => ({ ...prev, txtscast: "" })); // Reset subcast
      } catch (err) {
        console.error("Error fetching subcasts:", err);
      }
    }
  };

  const handleUpdate = async () => {
    if (!userId) {
      alert("User ID not found.");
      return;
    }

    setLoading(true);

    const payload = {
      CTID: formData.txtcast,
      SCTID: formData.txtscast,
      weight: formData.txtWeight,
      height: formData.txtheight,
      varn: formData.txtVarn,
      birthplace: formData.txtbplace,
      DOB: formData.txtDOB,
      dob_time: formData.txtbtime,
      marriage_type: formData.txtmtype,
      bloodgroup: formData.txtbid,
      Expectation: formData.txtexpectation,
    };

    try {
      const res = await axios.put(`http://localhost:5000/api/userdetails/${userId}`, payload);
      setMessage(res.data.message || "✔user Details Updated successfully!");
      // setCtid(formData.txtcast); // Uncomment if needed from context
    } catch (err) {
      console.error("Error updating data:", err);
      setMessage("Error updating data");
    }

    setTimeout(() => setMessage(""), 2000);
    setLoading(false);
  };

 return (
  <div className="container mt-4 mb-5">
    <div className="card shadow p-4">
      {/* <h4 className="mb-4 text-center">User Detail Information</h4> */}

      {message && <div className="alert alert-info text-center">{message}</div>}

      <div className="row g-3">
        {/* Row 1: Cast + Subcast */}
        <div className="col-md-6">
          <label>Cast *</label>
          <div className="input-group">
            <span className="input-group-text">
              <i className="fas fa-users"></i>
            </span>
            <select
              name="txtcast"
              className="form-control"
              value={formData.txtcast}
              onChange={handleChange}
            >
              <option value="">Select</option>
              {casts.map((c) => (
                <option value={c.CTID} key={c.CTID}>
                  {c.Cast}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="col-md-6">
          <label>Subcast *</label>
          <div className="input-group">
            <span className="input-group-text">
              <i className="fas fa-user-friends"></i>
            </span>
            <select
              name="txtscast"
              className="form-control"
              value={formData.txtscast}
              onChange={handleChange}
            >
              <option value="">Select</option>
              {subCasts.map((s) => (
                <option key={s.SCTID} value={s.SCTID}>
                  {s.Subcast}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 2: Birth Place + DOB */}
        <div className="col-md-6">
          <label>Birth Place *</label>
          <div className="input-group">
            <span className="input-group-text">
              <i className="fas fa-map-marker-alt"></i>
            </span>
            <input
              type="text"
              name="txtbplace"
              className="form-control"
              value={formData.txtbplace}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="col-md-6">
          <label>DOB *</label>
          <div className="input-group">
            <span className="input-group-text">
              <i className="fas fa-calendar-alt"></i>
            </span>
            <input
              type="date"
              name="txtDOB"
              className="form-control"
              value={formData.txtDOB}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Row 3: Birth Time + Marriage Type */}
        <div className="col-md-6">
          <label>Birth Time *</label>
          <div className="input-group">
            <span className="input-group-text">
              <i className="fas fa-clock"></i>
            </span>
            <input
              type="time"
              name="txtbtime"
              className="form-control"
              value={formData.txtbtime}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="col-md-6">
          <label>Marriage Type</label>
          <div className="input-group">
            <span className="input-group-text">
              <i className="fas fa-ring"></i>
            </span>
            <select
              name="txtmtype"
              className="form-control"
              value={formData.txtmtype}
              onChange={handleChange}
            >
              <option value="">Select</option>
              {marriageTypes.map((m) => (
                <option key={m.MRID} value={m.Marriage}>
                  {m.Marriage}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 4: Weight + Height */}
        <div className="col-md-6">
          <label>Weight</label>
          <div className="input-group">
            <span className="input-group-text">
              <i className="fas fa-weight"></i>
            </span>
            <input
              type="text"
              name="txtWeight"
              className="form-control"
              value={formData.txtWeight}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="col-md-6">
          <label>Height</label>
          <div className="input-group">
            <span className="input-group-text">
              <i className="fas fa-ruler-vertical"></i>
            </span>
            <select
              name="txtheight"
              className="form-control"
              value={formData.txtheight}
              onChange={handleChange}
            >
              <option value="">Select</option>
              {heights.map((h) => (
                <option key={h.HEID} value={h.Height}>
                  {h.Height}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 5: Varn + Blood Group */}
        <div className="col-md-6">
          <label>Varn</label>
          <div className="input-group">
            <span className="input-group-text">
              <i className="fas fa-palette"></i>
            </span>
            <select
              name="txtVarn"
              className="form-control"
              value={formData.txtVarn}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="गोरा">गोरा</option>
              <option value="सावळा">सावळा</option>
              <option value="काळा">काळा</option>
            </select>
          </div>
        </div>

        <div className="col-md-6">
          <label>Blood Group</label>
          <div className="input-group">
            <span className="input-group-text">
              <i className="fas fa-tint"></i>
            </span>
            <select
              name="txtbid"
              className="form-control"
              value={formData.txtbid}
              onChange={handleChange}
            >
              <option value="">Select</option>
              {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((bg) => (
                <option key={bg} value={bg}>
                  {bg}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 6: Expectation */}
        <div className="col-12">
          <label>Expectation</label>
          <div className="input-group">
            <span className="input-group-text">
              <i className="fas fa-comment-dots"></i>
            </span>
            <textarea
              name="txtexpectation"
              rows="3"
              className="form-control"
              value={formData.txtexpectation}
              onChange={handleChange}
            ></textarea>
          </div>
        </div>
      </div>

      <div className="col-12 mt-4 text-start">
        <button
          className="btn text-white px-5"
          onClick={handleUpdate}
          disabled={loading}
          style={{ background: "#c52e79ff" }}
        >
          <i className="fas fa-save me-2"></i>
          Update
        </button>
      </div>
    </div>
  </div>
);
};

export default UserDetailInfo;
