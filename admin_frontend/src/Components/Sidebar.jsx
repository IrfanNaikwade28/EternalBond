import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

const Sidebar = ({ sidebarOpen, onClose, onCollapse }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [loginUser, setLoginUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setLoginUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Invalid user JSON:", err);
      }
    }
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (onCollapse) onCollapse(collapsed);
  }, [collapsed, onCollapse]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLinkClick = () => {
    if (isMobile && onClose) onClose();
  };

  return (
    <>
      <style>
        {`
        @media (min-width: 768px) and (max-width: 1024px) {
          .collapse-toggle {
            display: none !important;
          }
        }
      `}
      </style>

      <aside
        className="sidebar bg-light"
        style={{
          width: collapsed ? 80 : 250,
          position: "fixed",
          top: 0,
          left: sidebarOpen ? 0 : -250,
          bottom: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          transition: "all 0.3s ease",
          borderRight: "1px solid #dee2e6",
          zIndex: 1050,
          overflowY: "auto",
        }}
      >
        <div
          className="sidebar-header d-flex justify-content-between align-items-center px-3 py-2"
          style={{ backgroundColor: "#346cb0", color: "#fff" }}
        >
          <h5 className="m-0 fw-semibold" style={{ whiteSpace: "nowrap" }}>
            {!collapsed && "Matrimony"}
          </h5>
          <div className="d-flex align-items-center">
            <button
              className="btn btn-sm btn-light ms-2 collapse-toggle"
              onClick={() => setCollapsed(!collapsed)}
              style={{ border: "none", fontSize: "1.2rem", color: "#346cb0" }}
            >
              <i className="fas fa-bars"></i>
            </button>

            <button
              className="btn btn-sm btn-light d-md-none ms-2"
              onClick={onClose}
              style={{ border: "none", fontSize: "1.5rem", color: "#fff" }}
            >
              &times;
            </button>
          </div>
        </div>

        {/* Mobile User Dropdown */}
        <div
          className="d-md-none d-flex flex-column align-items-start py-3 px-3"
          style={{ borderBottom: "1px solid #dee2e6", width: "100%" }}
        >
          <div
            className="d-flex align-items-center w-100"
            style={{ cursor: "pointer" }}
            onClick={toggleDropdown}
          >
            <img
              src={
                loginUser && loginUser.uprofile
                  ? `http://localhost:5000/uploads/photos/${loginUser.uprofile}`
                  : "assets/images/avatars/profile.jpg"
              }
              alt={loginUser ? loginUser.Uname : "Guest"}
              className="rounded-circle"
              width="50"
              height="50"
            />
            <div className="ms-2 text-start flex-grow-1">
              <div style={{ fontWeight: "600" }}>
                {loginUser ? loginUser.Uname : "Guest"}
              </div>
              <div style={{ fontSize: "12px", color: "#666" }}>
                {loginUser ? loginUser.urole : "Guest"}
              </div>
            </div>
            <i className={`fa ms-2 ${dropdownOpen ? "fa-caret-up" : "fa-caret-down"}`}></i>
          </div>

          {dropdownOpen && (
            <div
              className="mt-2 w-100"
              style={{
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#f8f9fa",
                borderRadius: "5px",
                overflow: "hidden",
                border: "1px solid #ccc",
              }}
            >
              <button
                onClick={handleLogout}
                className="px-3 py-2 text-start text-dark"
                style={{ border: "none", background: "transparent" }}
              >
                <i className="oi oi-account-logout me-2"></i> Logout
              </button>
            </div>
          )}
        </div>

        {/* Sidebar Menu */}
        <nav className="sidebar-menu p-2 flex-grow-1">

          {/* Reusable menu item component */}
          {[
            { to: "/", icon: "fa-tachometer-alt", label: "Dashboard" },
            { to: "/Master", icon: "fa-cogs", label: "Master" },
            { to: "/AddUserDetails", icon: "fa-user-plus", label: "Add User Details" },
            { to: "/ShortRegistration", icon: "fa-file-signature", label: "Short Registration" },
            { to: "/ExtendViewCount", icon: "fa-eye", label: "Extend View Count" },
            { to: "/ActiveUsers", icon: "fa-users", label: "Active Users" },
            { to: "/DeactiveUsers", icon: "fa-user-slash", label: "Deactive Users" },
            { to: "/ExpiryPlanUsers", icon: "fa-calendar-times", label: "Expiry Plan Users" },
            { to: "/ProfileViews", icon: "fa-chart-bar", label: "Profile Views" },
            { to: "/SuccessStory", icon: "fa-heart", label: "Add Success Story" },
            { to: "/BioData", icon: "fa-file-signature", label: "Bio Data Users" },
            { to: "/Testomonial", icon: "fa-comment-dots", label: "Add Testomonial" },
            { to: "/About", icon: "fa-info-circle", label: "Add About" },
          ].map((item, index) => (
            <NavLink
              key={index}
              to={item.to}
              onClick={handleLinkClick}
              className={({ isActive }) =>
                `d-flex align-items-center p-2 mb-2 rounded text-decoration-none
                ${isActive ? "#016ef4ff " : "text-dark"}`
              }
            >
              <i className={`fas ${item.icon} me-3`}></i>
              {!collapsed && <span style={{ marginLeft: "5px" }}>{item.label}</span>}
            </NavLink>
          ))}

        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
