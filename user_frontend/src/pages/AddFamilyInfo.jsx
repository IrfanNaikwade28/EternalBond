import React, { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";

const API_BASE = `${import.meta.env.VITE_ADMIN_API_BASE_URL || "http://localhost:5000"}/api`;
const alphaOnly = /^[A-Za-z\s]+$/;

export default function AddFamilyInfo() {

  const storedUser = localStorage.getItem("user");
  const userId = storedUser ? JSON.parse(storedUser).UID : null;
  //const { userId, setFatherName, setMotherName } = useUser();
  const [family, setFamily] = useState(null);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchFamily = async () => {
    if (!userId) return;
    setLoading(true);
    try {
       const res = await fetch(`${API_BASE}/family/${userId}`);
      //const res = await fetch(`${API_BASE}/families?UID=${userId}`);
      const data = await res.json();
      setFamily(data || null); // Take first record
    } catch (err) {
      console.error(err);
      setMsg("Error fetching family details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFamily();
  }, [userId]);

  const handleChange = (name, value) => {
    setFamily((prev) => ({ ...prev, [name]: value }));
  };

  const validate = (item) => {
    if (!alphaOnly.test(item.Father || "")) {
      setMsg("Father name required and must contain only letters");
      return false;
    }
    if (!alphaOnly.test(item.Mother || "")) {
      setMsg("Mother name required and must contain only letters");
      return false;
    }
    return true;
  };

  const handleUpdate = async () => {
    if (!family) return;
    setMsg("");
    if (!validate(family)) return;

    const payload = {
      txtFather: family.Father,
      txtMother: family.Mother,
      txtBrother: family.Brother,
      txtSitser: family.Sister,
      txtFOccupation: family.father_occupation,
      txtMOccupation: family.mother_occupation,
      txtBOccupation: family.brother_occupation,
      txtProperty: family.property_details,
      txtOtherDetails: family.other_details,
    };

    try {
      const res = await fetch(`${API_BASE}/family/${family.FID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) setMsg(data.message || "❌ Update failed");
      else {
        setMsg(data.message || "✅ Family details updated successfully");
        //setFatherName(family.Father);
        //setMotherName(family.Mother);
        setTimeout(() => setMsg(""), 2000);
      }
    } catch (err) {
      console.error(err);
      setMsg("Network error");
      setTimeout(() => setMsg(""), 2000);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!family) return <p className="text-muted">No family details found.</p>;

 return (
  <div className="container mt-4 mb-5">
    {msg && <div className="alert alert-info text-center">{msg}</div>}
    <div className="card shadow-sm">
      <div className="card-body">
        <div className="row g-3 mb-4">
          <div className="col-md-6">
            <label className="form-label fw-semibold">Father Name</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="fas fa-male"></i>
              </span>
              <input
                className="form-control"
                value={family.Father || ""}
                onChange={(e) => handleChange("Father", e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-6">
            <label className="form-label fw-semibold">Mother Name</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="fas fa-female"></i>
              </span>
              <input
                className="form-control"
                value={family.Mother || ""}
                onChange={(e) => handleChange("Mother", e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="row g-3 mb-4">
          <div className="col-md-6">
            <label className="form-label fw-semibold">Father Occupation</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="fas fa-briefcase"></i>
              </span>
              <input
                className="form-control"
                value={family.father_occupation || ""}
                onChange={(e) =>
                  handleChange("father_occupation", e.target.value)
                }
              />
            </div>
          </div>
          <div className="col-md-6">
            <label className="form-label fw-semibold">Mother Occupation</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="fas fa-briefcase"></i>
              </span>
              <input
                className="form-control"
                value={family.mother_occupation || ""}
                onChange={(e) =>
                  handleChange("mother_occupation", e.target.value)
                }
              />
            </div>
          </div>
        </div>

        <div className="row g-3 mb-4">
          <div className="col-md-6">
            <label className="form-label fw-semibold">Brother Name</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="fas fa-user"></i>
              </span>
              <input
                className="form-control"
                value={family.Brother || ""}
                onChange={(e) => handleChange("Brother", e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-6">
            <label className="form-label fw-semibold">Brother Occupation</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="fas fa-briefcase"></i>
              </span>
              <input
                className="form-control"
                value={family.brother_occupation || ""}
                onChange={(e) =>
                  handleChange("brother_occupation", e.target.value)
                }
              />
            </div>
          </div>
        </div>

        <div className="row g-3 mb-4">
          <div className="col-md-6">
            <label className="form-label fw-semibold">Sister Name</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="fas fa-user"></i>
              </span>
              <input
                className="form-control"
                value={family.Sister || ""}
                onChange={(e) => handleChange("Sister", e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-6">
            <label className="form-label fw-semibold">Property Details</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="fas fa-home"></i>
              </span>
              <input
                className="form-control"
                value={family.property_details || ""}
                onChange={(e) => handleChange("property_details", e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="form-label fw-semibold">Other Details</label>
          <div className="input-group">
            <span className="input-group-text">
              <i className="fas fa-info-circle"></i>
            </span>
            <textarea
              className="form-control"
              rows="2"
              value={family.other_details || ""}
              onChange={(e) => handleChange("other_details", e.target.value)}
            ></textarea>
          </div>
        </div>

        <div className="col-12 mt-2 text-start">
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
  </div>
);
}
