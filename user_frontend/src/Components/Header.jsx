import React,{useState} from "react";
import { Link } from "react-router-dom";
import FilterModal from "../pages/FilterModal"; // import modal
import { useFilterModal } from "../context/FilterModalContext.jsx";

const Header = ({ toggleSidebar }) => {
  const storedUser = JSON.parse(localStorage.getItem("user"));

  const {
    showFilterModal,
    closeFilterModal,
    openFilterModal,
    onApplyFilter,
    searchUID,
    setSearchUID,
  } = useFilterModal();

  console.log("FULL USER OBJECT =>", storedUser.Uname);
  
  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("user"); // Remove login data
    window.location.href = "/"; // Redirect to login
  };

  // When clicking filter icon
  const handleFilterClick = () => {
    openFilterModal((filterData) => {
      console.log("Filter applied from Header:", filterData);
      // do something with filterData if needed
    });
  };
  
  const handleSearchSubmit = (e) => {
  e.preventDefault();
  if (!searchUID.trim()) return;

  onApplyFilter({ search: searchUID.trim() });
};

  return (
    <>
    {`<style>
     @media (max-width: 1024px) {
     .mobile-view{
   
     }
    }
      </style>`}
    <header className="app-header app-header-dark"
     style={{
        //background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
          background: "linear-gradient(135deg, #c52e79ff)",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        height: "70px"
      }}
    >
      {/* .top-bar */}
      <div className="top-bar">
        {/* .top-bar-brand */}
        <div className="top-bar-brand">
          {/* toggle aside menu */}
          <button
        className="hamburger hamburger-squeeze mobile-view"
        onClick={toggleSidebar}
        style={{
          marginRight: "20px",
         background: "rgba(255,255,255,0.2)",
          border: "none",
          color: "#fff",
          fontSize: "20px",
          cursor: "pointer",
          padding: "8px 12px",
          borderRadius: "8px",
          transition: "all 0.3s ease"
        }}
        onMouseEnter={(e) => e.target.style.background = "rgba(255,255,255,0.3)"}
        onMouseLeave={(e) => e.target.style.background = "rgba(255,255,255,0.2)"}
      >
        ☰
      </button>
          {/* /toggle aside menu */}

          <a href="#" aria-label="Matrimony">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="320"
              height="36"
              viewBox="0 0 320 36"
              role="img"
              aria-label="Matrimony logo"
              style={{ verticalAlign: "middle" }}
            >
              <g fill="none" fillRule="evenodd">
                {/* Ring + Heart icon (left) */}
                <g transform="translate(0 2)">
                  {/* outer ring */}
                  <circle cx="18" cy="16" r="14" stroke="currentColor" strokeWidth="2" fill="none" />
                  {/* inner decorative gem */}
                  <path
                    d="M11 11 L15 6 L19 11 L23 6 L27 11 L19 20 Z"
                    fill="currentColor"
                    opacity="0.12"
                  />
                  {/* heart inside ring */}
                  <path
                    d="M19 12.5c1.5-1.5 4-1.2 4 1 0 2.5-3.8 5.6-4 5.8-.2-.2-4-3.3-4-5.8 0-2.2 2.5-2.5 4-1z"
                    fill="currentColor"
                  />
                </g>

                {/* Wordmark */}
                <text
                  x="48"
                  y="24"
                  fontFamily="Segoe UI, Roboto, Helvetica, Arial, sans-serif"
                  fontSize="18"
                  fontWeight="600"
                  fill="currentColor"
                >
                  Matrimony
                </text>
              </g>
            </svg>
          </a>
        </div>
        {/* /.top-bar-brand */}

        {/* .top-bar-list */}
        <div className="top-bar-list">
          {/* Responsive hamburger */}
          <div className="top-bar-item px-2 d-md-none d-lg-none d-xl-none">
            <button
              className="hamburger hamburger-squeeze"
              type="button"
              data-toggle="aside"
              aria-label="toggle menu"
            >
              <span className="hamburger-box">
                <span className="hamburger-inner"></span>
              </span>
            </button>
          </div>

          {/* Top bar search */}
          <div className="top-bar-item top-bar-item-full" style={{ display: "flex", alignItems: "center" }}>
            <form className="top-bar-search" style={{ flex: 1 }}  onSubmit={handleSearchSubmit}>
              <div className="input-group input-group-search">
                <div className="input-group-prepend">
                  <span className="input-group-text" style={{  border: "none" }}>
                    <span className="oi oi-magnifying-glass" style={{ color: "#ebadccff" }}></span>
                  </span>
                </div>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search By User Profile Id"
                  style={{ 
                    maxWidth: "250px",
                    
                    border: "none",
                    borderRadius: "0 25px 25px 0"
                  }}
                  value={searchUID}
                  onChange={(e) => setSearchUID(e.target.value)}
                />
              </div>
            </form>

            {/* Filter icon outside search box */}
            <button
              type="button"
              style={{
                backgroundColor: "rgba(255,255,255,0.2)",
                border: "none",
                marginLeft: "10px",
                cursor: "pointer",
                color: "#fff",
                fontSize: "18px",
                padding: "8px 12px",
                borderRadius: "8px",
                transition: "all 0.3s ease"
              }}
              onClick={handleFilterClick}
              onMouseEnter={(e) => e.target.style.backgroundColor = "rgba(255,255,255,0.3)"}
              onMouseLeave={(e) => e.target.style.backgroundColor = "rgba(255,255,255,0.2)"}
            >
              <i className="fa fa-filter"></i>
            </button>
          </div>

          {/* Top bar right items */}
          <div className="top-bar-item top-bar-item-right px-0 d-none d-sm-flex">
            {/* Navigation */}
            <ul className="header-nav nav">
              {/* Activities, Messages, Apps dropdowns can go here */}
            </ul>

            {/* User Account */}
            <div className="dropdown d-none d-md-flex">
              <button
                className="btn-account"
                type="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
                style={{
                  //background: "rgba(255,255,255,0.1)",
                  border: "none",
                  borderRadius: "25px",
                  padding: "5px 15px",
                  transition: "all 0.3s ease"
                }}
                //onMouseEnter={(e) => e.target.style.background = "rgba(255,255,255,0.2)"}
                //onMouseLeave={(e) => e.target.style.background = "rgba(255,255,255,0.1)"}
              >
                <span className="user-avatar user-avatar-md">
                  <img src={storedUser.uprofile} alt="Profile" style={{ border: "2px solid rgba(255,255,255,0.5)" }}/>
                </span>
                <span className="account-summary pr-lg-4 d-none d-lg-block">
                  <span className="account-name" style={{ fontWeight: "600" }}> {storedUser.Uname}</span>
                  <span className="account-description" style={{ fontSize: "0.85rem" }}>{storedUser.Education}</span>
                </span>
              </button>
              <div className="dropdown-menu" style={{ 
                borderRadius: "12px", 
                border: "none", 
                boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                overflow: "hidden"
              }}>
                <div className="dropdown-arrow ml-3 d-none d-lg-block"></div>
                <h6 className="dropdown-header d-none d-md-block d-lg-none">
                 {storedUser.Uname}
                </h6>
                <Link to="/app/profile" className="dropdown-item" style={{ padding: "12px 20px", transition: "all 0.3s" }}>
                  <span className="dropdown-icon oi oi-person" style={{ color: "#d63384" }}></span> Profile
                </Link>
                <Link to="/" className="dropdown-item" href="#" onClick={handleLogout} style={{ padding: "12px 20px", transition: "all 0.3s" }}>
                  <span className="dropdown-icon oi oi-account-logout" style={{ color: "#d63384" }}></span> Logout
                </Link>
              </div>
            </div>
          </div>
        </div>
        {/* /.top-bar-list */}
      </div>
      {/* /.top-bar */}
    </header>
    <FilterModal show={showFilterModal} onClose={closeFilterModal} />
    </>
  );
};

export default Header;