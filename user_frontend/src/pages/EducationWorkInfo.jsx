import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../context/UserContext";

const EducationWorkInfo = () => {
 // const { userId, EDID, setEDID, CNID, setCNID, DSID, setDSID, INID, setINID } = useUser();
const storedUser = localStorage.getItem("user");
  const userId = storedUser ? JSON.parse(storedUser).UID : null;
  const emptyForm = {
    UID: "",
    EDID: "",
    education_details: "",
    CNID: "",
    STID: "",
    DSID: "",
    INID: "",
    fincome: "",
    current_work: "",
  };

  const [formData, setFormData] = useState(emptyForm);
  const [educationList, setEducationList] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState(null);

  // Fetch education list & countries
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_ADMIN_API_BASE_URL || "http://localhost:5000"}/api/education/all`)
      .then(res => setEducationList(res.data))
      .catch(err => console.error(err));

    axios.get(`${import.meta.env.VITE_ADMIN_API_BASE_URL || "http://localhost:5000"}/api/location/countries`)
      .then(res => setCountries(res.data))
      .catch(err => console.error(err));
  }, []);

  // Fetch user's existing education/work info
  useEffect(() => {
    if (!userId) return;
    axios.get(`${import.meta.env.VITE_ADMIN_API_BASE_URL || "http://localhost:5000"}/api/education-work/${userId}`)
      .then(res => {
        const data = res.data.data;
        console.log("all data of id"+data)
        setEditId(data.UID || null);
        setFormData({
          UID: data.UID,
          EDID: data.EDID,
          education_details: data.education_details || "",
          CNID: data.CNID,
          STID: data.STID,
          DSID: data.DSID,
          INID: data.INID,
          fincome: data.fincome || "",
          current_work: data.current_work || "",
        });

        // Load states & districts for dropdowns
        if (data.CNID) {
          axios.get(`${import.meta.env.VITE_ADMIN_API_BASE_URL || "http://localhost:5000"}/api/location/states/${data.CNID}`)
            .then(res => setStates(res.data));
        }
        if (data.STID) {
          axios.get(`${import.meta.env.VITE_ADMIN_API_BASE_URL || "http://localhost:5000"}/api/location/districts/${data.STID}`)
            .then(res => setDistricts(res.data));
        }
      })
      .catch(err => console.error(err));
  }, [userId]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === "CNID") {
      axios.get(`${import.meta.env.VITE_ADMIN_API_BASE_URL || "http://localhost:5000"}/api/location/states/${value}`)
        .then(res => setStates(res.data));
      setDistricts([]);
    }
    if (name === "STID") {
      axios.get(`${import.meta.env.VITE_ADMIN_API_BASE_URL || "http://localhost:5000"}/api/location/districts/${value}`)
        .then(res => setDistricts(res.data));
    }
  };

  // Update handler
  const handleUpdate = async () => {
    const payload = { ...formData, UID: userId };
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_ADMIN_API_BASE_URL || "http://localhost:5000"}/api/education-work/${editId}`,
        payload
      );
      setMessage(res.data.message || "Education Work Info Updated successfully!");
      // setEDID(formData.EDID);
      // setCNID(formData.CNID);
      // setDSID(formData.DSID);
      // setINID(formData.INID);
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Update failed!");
    }
  };

 return (
  <div className="container mt-4 mb-5">
    {message && <div className="alert alert-info text-center">{message}</div>}
    <div className="card">
      <div className="card-body">
        <h3>Education & Work Info</h3>

        <div>
          {/* Row 1: Country + State */}
          <div className="form-row">
            <div className="col-md-6 mb-3">
              <label>Country</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-globe"></i>
                </span>
                <select
                  name="CNID"
                  value={formData.CNID}
                  onChange={handleChange}
                  className="form-control"
                >
                  <option value="">Select Country</option>
                  {countries.map(c => (
                    <option key={c.CNID} value={c.CNID}>{c.Country}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <label>State</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-map-marker-alt"></i>
                </span>
                <select
                  name="STID"
                  value={formData.STID}
                  onChange={handleChange}
                  className="form-control"
                >
                  <option value="">Select State</option>
                  {states.map(s => (
                    <option key={s.STID} value={s.STID}>{s.State}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Row 2: District + Education */}
          <div className="form-row">
            <div className="col-md-6 mb-3">
              <label>District</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-map-pin"></i>
                </span>
                <select
                  name="DSID"
                  value={formData.DSID}
                  onChange={handleChange}
                  className="form-control"
                >
                  <option value="">Select District</option>
                  {districts.map(d => (
                    <option key={d.DSID} value={d.DSID}>{d.District}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <label>Education</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-graduation-cap"></i>
                </span>
                <select
                  name="EDID"
                  value={formData.EDID}
                  onChange={handleChange}
                  className="form-control"
                >
                  <option value="">Select Education</option>
                  {educationList.map(e => (
                    <option key={e.EDID} value={e.EDID}>{e.Education}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Row 3: Education Details + Income Range */}
          <div className="form-row">
            <div className="col-md-6 mb-3">
              <label>Education Details</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-file-alt"></i>
                </span>
                <textarea
                  name="education_details"
                  value={formData.education_details}
                  onChange={handleChange}
                  className="form-control"
                  rows="2"
                />
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <label>Income Range</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-money-bill-wave"></i>
                </span>
                <select
                  name="INID"
                  value={formData.INID}
                  onChange={handleChange}
                  className="form-control"
                >
                  <option value="0">--- Select Income ---</option>
                  <option value="1">Below 1 लाख</option>
                  <option value="2">1 ते 2 लाख</option>
                  <option value="3">2 ते 5 लाख वार्षिक</option>
                  <option value="4">5 ते 10 लाख वार्षिक</option>
                  <option value="5">10 ते 20 लाख वार्षिक</option>
                  <option value="6">20 ते 30 लाख वार्षिक</option>
                  <option value="7">30 ते 40 लाख वार्षिक</option>
                  <option value="8">Above 40 लाख वार्षिक</option>
                  <option value="9">No</option>
                </select>
              </div>
            </div>
          </div>

          {/* Row 4: Fixed Income + Current Work */}
          <div className="form-row">
            <div className="col-md-6 mb-3">
              <label>Fixed Income</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-rupee-sign"></i>
                </span>
                <input
                  type="text"
                  name="fincome"
                  value={formData.fincome}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <label>Current Work / Address</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-briefcase"></i>
                </span>
                <textarea
                  name="current_work"
                  value={formData.current_work}
                  onChange={handleChange}
                  className="form-control"
                  rows="2"
                />
              </div>
            </div>
          </div>

          <button style={{ background: "#c52e79ff" }} className="btn text-white" onClick={handleUpdate}>
            <i className="fas fa-save me-2"></i>
            Update
          </button>
        </div>
      </div>
    </div>
  </div>
);
};

export default EducationWorkInfo;
