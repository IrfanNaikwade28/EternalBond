import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useFilterModal } from "../context/FilterModalContext";
import { CardLink } from "react-bootstrap";

const Sidebar = ({ collapsed, isMobile, isTablet, mobileOpen, toggleMobileSidebar }) => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const [activeDropdown, setActiveDropdown] = useState(null);

  const { clearFilter } = useFilterModal();

  // Use the toggleMobileSidebar from props
  const handleMenuClick = () => {
    setActiveDropdown(null);
    if (isMobile || isTablet) {
      toggleMobileSidebar(); // Close sidebar when menu item is clicked
    }
  };

  const toggleDropdown = (menu) => {
    setActiveDropdown(activeDropdown === menu ? null : menu);
  };

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  // sidebar left for mobile/tablet
  const sidebarLeft = (isMobile || isTablet) ? (mobileOpen ? "0" : "-100%") : "0";

  const sidebarStyle = {
    width: (isMobile || isTablet) ? "280px" : (collapsed ? "80px" : "250px"),
    position: "fixed",
    top: (isMobile || isTablet) ? "70px" : "0",
    bottom: 0,
    left: sidebarLeft,
    transition: "all 0.3s ease",
    background: "linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)",
    zIndex: 999,
    overflow: "hidden",
    boxShadow: (isMobile || isTablet) ? "2px 0 15px rgba(0,0,0,0.3)" : "2px 0 15px rgba(0,0,0,0.1)",
    borderRight: "1px solid #e9ecef"
  };

  return (
    <>
      {/* Sidebar */}
      <aside style={sidebarStyle} className="app-aside app-aside-expand-md app-aside-light">
        <div className="aside-content" style={{ height: "100%", paddingTop: (isMobile || isTablet) ? "0" : "70px" }}>

          {/* Mobile Header - Show on both mobile and tablet */}
          {(isMobile || isTablet) && (
            <header className="aside-header" style={{ 
              padding: "15px", 
              borderBottom: "1px solid #e9ecef",
              background: "#d63384",
              color: "#fff",
              marginBottom: "10px"
            }}>
              <button 
                className="btn-account" 
                type="button" 
                onClick={() => toggleDropdown("userMenu")}
                style={{
                  background: "none",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  cursor: "pointer",
                  color: "#fff"
                }}
              >
                <span className="user-avatar user-avatar-lg">
                  <img 
                    src={storedUser.uprofile} 
                    alt="User" 
                    style={{ 
                      width: "50px", 
                      height: "50px", 
                      borderRadius: "50%",
                      border: "2px solid rgba(255,255,255,0.7)"
                    }}
                  />
                </span>
                <span className="account-summary" style={{ marginLeft: "10px", textAlign: "left", flex: 1 }}>
                  <span className="account-name" style={{ display: "block", fontWeight: "600" }}>{storedUser.Uname}</span>
                  <span className="account-description" style={{ display: "block", fontSize: "12px", opacity: "0.9" }}>{storedUser.Education}</span>
                </span>
                <span className="account-icon">
                  <span className="fa fa-caret-down fa-lg"></span>
                </span>
              </button>

              {activeDropdown === "userMenu" && (
                <div className="dropdown-aside" style={{ 
                  background: "#fff", 
                  borderRadius: "8px", 
                  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                  marginTop: "10px",
                  padding: "10px 0"
                }}>
                  <div className="pb-3">
                    <Link to="/app/profile" className="dropdown-item" onClick={handleMenuClick} style={{ padding: "10px 15px", display: "flex", alignItems: "center", color: "#333" }}>
                      <span className="dropdown-icon oi oi-person" style={{ marginRight: "10px", color: "#d63384" }}></span> Profile
                    </Link>
                    <Link to="/" className="dropdown-item" onClick={handleLogout} style={{ padding: "10px 15px", display: "flex", alignItems: "center", color: "#333" }}>
                      <span className="dropdown-icon oi oi-account-logout" style={{ marginRight: "10px", color: "#d63384" }}></span> Logout
                    </Link>
                  </div>
                </div>
              )}
            </header>
          )}

          {/* Sidebar Menu */}
          <div className="aside-menu overflow-hidden" style={{ flex: 1, padding: "10px 0" }}>
            <nav className="stacked-menu">
              <ul className="menu" style={{ padding: "0", margin: "0", listStyle: "none" }}>
                <li className="menu-item">
                  <Link
                    to="/app"
                    className="menu-link"
                    onClick={() => {
                      clearFilter();
                      handleMenuClick();
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "15px 20px",
                      color: "#333",
                      textDecoration: "none",
                      transition: "all 0.3s ease",
                      borderRadius: "8px",
                      margin: "5px 10px",
                      borderLeft: "4px solid transparent"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = "linear-gradient(135deg, rgba(214, 51, 132, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)";
                      e.target.style.borderLeftColor = "#d63384";
                      e.target.style.color = "#d63384";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "transparent";
                      e.target.style.borderLeftColor = "transparent";
                      e.target.style.color = "#333";
                    }}
                  >
                    <span className="fas fa-home" style={{ width: "30px", color: "#d63384" }}></span>
                    {(!collapsed || isMobile || isTablet) && <span style={{ marginLeft: "10px", fontWeight: "500" }}>Dashboard</span>}
                  </Link>
                </li>
                <li className="menu-item">
                  <Link to="/app/profileupdate" className="menu-link" onClick={handleMenuClick}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "15px 20px",
                      color: "#333",
                      textDecoration: "none",
                      transition: "all 0.3s ease",
                      borderRadius: "8px",
                      margin: "5px 10px",
                      borderLeft: "4px solid transparent"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = "linear-gradient(135deg, rgba(214, 51, 132, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)";
                      e.target.style.borderLeftColor = "#d63384";
                      e.target.style.color = "#d63384";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "transparent";
                      e.target.style.borderLeftColor = "transparent";
                      e.target.style.color = "#333";
                    }}
                  >
                    <span className="fas fa-user-edit" style={{ width: "30px", color: "#d63384" }}></span>
                    {(!collapsed || isMobile || isTablet) && <span style={{ marginLeft: "10px", fontWeight: "500" }}>Profile Update</span>}
                  </Link>
                </li>
                <li className="menu-item">
                  <Link to="/app/chnagePassword" className="menu-link" onClick={handleMenuClick}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "15px 20px",
                      color: "#333",
                      textDecoration: "none",
                      transition: "all 0.3s ease",
                      borderRadius: "8px",
                      margin: "5px 10px",
                      borderLeft: "4px solid transparent"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = "linear-gradient(135deg, rgba(214, 51, 132, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)";
                      e.target.style.borderLeftColor = "#d63384";
                      e.target.style.color = "#d63384";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "transparent";
                      e.target.style.borderLeftColor = "transparent";
                      e.target.style.color = "#333";
                    }}
                  >
                    <span className="fas fa-key" style={{ width: "30px", color: "#d63384" }}></span>
                    {(!collapsed || isMobile || isTablet) && <span style={{ marginLeft: "10px", fontWeight: "500" }}>Change Password</span>}
                  </Link>
                </li>

                  <li className="menu-item">
                  <Link to="/app/wishList" className="menu-link" onClick={handleMenuClick}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "15px 20px",
                      color: "#333",
                      textDecoration: "none",
                      transition: "all 0.3s ease",
                      borderRadius: "8px",
                      margin: "5px 10px",
                      borderLeft: "4px solid transparent"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = "linear-gradient(135deg, rgba(214, 51, 132, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)";
                      e.target.style.borderLeftColor = "#d63384";
                      e.target.style.color = "#d63384";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "transparent";
                      e.target.style.borderLeftColor = "transparent";
                      e.target.style.color = "#333";
                    }}
                  >
                    <span className="fas fa-heart" style={{ width: "30px", color: "#d63384" }}></span>
                    {(!collapsed || isMobile || isTablet) && <span style={{ marginLeft: "10px", fontWeight: "500" }}>WishList</span>}
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Footer */}
          <footer className="aside-footer border-top p-3" style={{ background: "rgba(248, 249, 250, 0.8)" }}>
            <button className="btn btn-light btn-block text-primary"
              style={{
                //background: "linear-gradient(135deg, rgba(214, 51, 132, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)",
                //border: "1px solid rgba(214, 51, 132, 0.2)",
                borderRadius: "8px",
                padding: "12px",
                color: "#d63384",
                fontWeight: "300",
                transition: "all 0.3s ease"
              }}
              // onMouseEnter={(e) => {
              //   e.target.style.background = "linear-gradient(135deg, rgba(214, 51, 132, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)";
              // }}
              // onMouseLeave={(e) => {
              //   e.target.style.background = "linear-gradient(135deg, rgba(214, 51, 132, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)";
              // }}
              onClick={handleLogout}
            >
              {(!collapsed || isMobile || isTablet) && <p>
                <span style={{color:"#d63384"}} className="fas fa-sign-out-alt"></span>
                 <span className="fw-bold xl-large ml-2" style={{color:"#d63384"}} >Logout</span>
              </p>} 
             
            </button>
          </footer> 
        </div>
      </aside>

      {/* Overlay for mobile and tablet */}
      {(isMobile || isTablet) && mobileOpen && (
        <div
          onClick={toggleMobileSidebar}
          style={{
            position: "fixed",
            top: "70px",
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 998,
          }}
        ></div>
      )}
    </>
  );
};

export default Sidebar;