import React, { useState } from "react";
import axios from "axios";

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
const storedUser = localStorage.getItem("user");
  const userId = storedUser ? JSON.parse(storedUser).UID : null;
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    //const userId = localStorage.getItem("user");
    console.log("for chnager pASSWORD login id",userId)

    if (!userId) {
      setMessage({ type: "danger", text: "User not logged in!" });
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: "warning", text: "New & Confirm Password do not match!" });
      return;
    }

    try {
      const response = await axios.post("http://localhost:5001/api/changePassword", {
        userId,
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      });

      setMessage({ type: "success", text: response.data.message });

      setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });

      setTimeout(() => {
        localStorage.removeItem("UID");
        window.location.href = "/login";
      }, 2000);
    } catch (error) {
      setMessage({
        type: "danger",
        text: error.response?.data?.message || "Something went wrong!"
      });
    }
  };

  return (
  <div className="container-fluid">
    <div className="row">
      {/* Left Side - Empty for balance */}
      {/* <div className="col-lg-6 d-none d-lg-none">
        <div className="vh-100" style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          position: "relative",
          overflow: "hidden"
        }}>
          <div className="position-absolute top-50 start-50 translate-middle text-center text-white p-4">
            <i className="fas fa-lock-shield display-1 mb-3 opacity-75"></i>
            <h3 className="fw-bold mb-3">Secure Your Account</h3>
            <p className="lead opacity-90">
              Update your password regularly to keep your account safe and secure
            </p>
          </div>
        </div>
      </div> */}

      {/* Right Side - Password Change Form */}
      <div className="col-lg-12 col-md-12">
        <div className="min-vh-100 d-flex align-items-center justify-content-start p-4 p-lg-5">
          <div
            className="card border-0 shadow-lg"
            style={{
              width: "100%",
              maxWidth: "600px",
              borderRadius: "16px",
              background: "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)",
              border: "1px solid rgba(255,255,255,0.8)"
            }}
          >
            {/* Header Section */}
            <div className="card-header border-0 pb-0 pt-4 px-4" style={{
              background: "transparent"
            }}>
              <div className="text-center mb-3">
                <div  className=" bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                  style={{backgroundColor:"#c52e79ff", width: "60px", height: "60px" }}>
                  <i style={{color:"white"}} className="fas fa-key fs-4"></i>
                </div>
                <h3 className="fw-bold text-dark mb-2">Change Password</h3>
                <p className="text-muted mb-0">
                  Secure your account with a new password
                </p>
              </div>
            </div>

            <div className="card-body px-4 pb-4">
              {/* Alert Message */}
              {message && (
                <div className={`alert alert-${message.type} d-flex align-items-center border-0 shadow-sm mb-4`} 
                  style={{
                    borderRadius: "12px",
                    background: message.type === 'success' 
                      ? 'linear-gradient(135deg, #d4edda, #c3e6cb)'
                      : 'linear-gradient(135deg, #f8d7da, #f5c6cb)'
                  }}>
                  <i className={`fas fa-${message.type === 'success' ? 'check-circle' : 'exclamation-triangle'} me-2`}></i>
                  {message.text}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Old Password */}
                <div className="form-group mb-4">
                  <label className="form-label fw-semibold text-dark mb-2">
                    <i className="fas fa-lock me-2 text-primary"></i>
                    Current Password
                  </label>
                  <div className="input-group">
                    <input
                      type="password"
                      name="oldPassword"
                      value={formData.oldPassword}
                      onChange={handleChange}
                      className="form-control border-2 py-3"
                      style={{ borderRadius: "10px" }}
                      placeholder="Enter your current password"
                      required
                    />
                    {/* <span className="input-group-text bg-transparent border-2 border-start-0">
                      <i className="fas fa-eye-slash text-muted"></i>
                    </span> */}
                  </div>
                </div>

                {/* New Password */}
                <div className="form-group mb-4">
                  <label className="form-label fw-semibold text-dark mb-2">
                    <i className="fas fa-key me-2 text-success"></i>
                    New Password
                  </label>
                  <div className="input-group">
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      className="form-control border-2 py-3"
                      style={{ borderRadius: "10px" }}
                      placeholder="Create a strong new password"
                      required
                    />
                    {/* <span className="input-group-text bg-transparent border-2 border-start-0">
                      <i className="fas fa-eye-slash text-muted"></i>
                    </span> */}
                  </div>
                  <small className="text-muted mt-1 d-block">
                    Use 8+ characters with mix of letters, numbers & symbols
                  </small>
                </div>

                {/* Confirm Password */}
                <div className="form-group mb-4">
                  <label className="form-label fw-semibold text-dark mb-2">
                    <i className="fas fa-redo me-2 text-info"></i>
                    Confirm New Password
                  </label>
                  <div className="input-group">
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="form-control border-2 py-3"
                      style={{ borderRadius: "10px" }}
                      placeholder="Re-enter your new password"
                      required
                    />
                    {/* <span className="input-group-text bg-transparent border-2 border-start-0">
                      <i className="fas fa-eye-slash text-muted"></i>
                    </span> */}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="btn w-100 h-100 py-3 fw-bold text-white shadow-sm"
                  style={{
                   // background: "linear-gradient(135deg, #764ba2 0%, #2a5298 100%)",
                   backgroundColor:"#c52e79ff",
                    borderRadius: "12px",
                    fontSize: "1.1rem",
                    border: "none",
                    transition: "all 0.3s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = "0 8px 25px rgba(52, 108, 176, 0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "0 4px 15px rgba(52, 108, 176, 0.2)";
                  }}
                >
                  <i className="fas fa-sync-alt me-2"></i>
                  Update Password
                </button>
              </form>

              {/* Security Tips */}
              <div className="mt-4 pt-3 border-top">
                <h6 className="text-dark fw-semibold mb-3">
                  <i className="fas fa-shield-alt me-2 text-warning"></i>
                  Password Security Tips
                </h6>
                <div className="row text-muted small">
                  <div className="col-6 mb-2">
                    <i className="fas fa-check-circle text-success me-1"></i>
                    Use 8+ characters
                  </div>
                  <div className="col-6 mb-2">
                    <i className="fas fa-check-circle text-success me-1"></i>
                    Mix letters & numbers
                  </div>
                  <div className="col-6 mb-2">
                    <i className="fas fa-check-circle text-success me-1"></i>
                    Include symbols
                  </div>
                  <div className="col-6 mb-2">
                    <i className="fas fa-check-circle text-success me-1"></i>
                    Avoid common words
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
};

export default ChangePassword;
