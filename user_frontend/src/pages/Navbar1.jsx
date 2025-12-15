import { useState, useEffect } from "react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar1() {
  const [active, setActive] = useState("home");
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const menu = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "story", label: "Success Stories" },
    { id: "testimonial", label: "Testimonials" },
    { id: "gallery", label: "Gallery" },
    { id: "contact", label: "Contact" },
  ];

  const handleMenuClick = (id) => {
    setActive(id);
    navigate("/", { state: { scrollTo: id } });
    // Close mobile menu after navigating
    setIsOpen(false);
  };

  // Close menu when window resized to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 992) {
        setIsOpen(false);
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const navbarStyle = {
    background: "linear-gradient(135deg, #fff 0%, #fff9fb 100%)",
    boxShadow: "0 4px 20px rgba(214, 51, 132, 0.1)",
    borderBottom: "2px solid rgba(214, 51, 132, 0.1)",
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light sticky-top" style={navbarStyle}>
      <div className="container px-3">
        {/* Brand Logo */}
        <div className="navbar-brand d-flex align-items-center">
          <div className="brand-logo d-flex align-items-center justify-content-center me-2 p-2" style={{
            background: "linear-gradient(135deg, #d63384 0%, #ff6b9d 100%)",
            borderRadius: "50%"
          }}>
            <i className="fas fa-heart text-white"></i>
          </div>
          <span className="brand-title" style={{
            fontWeight: "700",
            background: "linear-gradient(135deg, #d63384 0%, #ff6b9d 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontFamily: "'Playfair Display', serif"
          }}>
            EternalBond
          </span>
        </div>

        {/* Hamburger */}
        <button
          className="navbar-toggler"
          type="button"
          aria-controls="matrimonyNavbar"
          aria-expanded={isOpen ? "true" : "false"}
          aria-label="Toggle navigation"
          style={{ border: "none" }}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {/* Toggle icon: bars when closed, times when open */}
          <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 32, height: 32 }}>
            {isOpen ? (
              <i className="fas fa-times" style={{ fontSize: "1.25rem", color: "#888" }}></i>
            ) : (
              <i className="fas fa-bars" style={{ fontSize: "1.25rem", color: "#888" }}></i>
            )}
          </span>
        </button>

        {/* Menu */}
        <div className={`navbar-collapse collapse ${isOpen ? "show" : ""}`} id="matrimonyNavbar">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 flex-column flex-lg-row align-items-start align-items-lg-center gap-2 gap-lg-0">
            {menu.map((item) => (
              <li className="nav-item mx-2" key={item.id}>
                <span
                  onClick={() => handleMenuClick(item.id)}
                  className={`nav-link position-relative ${active === item.id ? "active" : ""}`}
                  style={{
                    cursor: "pointer",
                    fontWeight: "500",
                    color: active === item.id ? "#d63384" : "#666",
                    padding: "10px 16px",
                    borderRadius: "30px",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (active !== item.id) {
                      e.currentTarget.style.background = "rgba(214, 51, 132, 0.05)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (active !== item.id) {
                      e.currentTarget.style.background = "transparent";
                    }
                  }}
                >
                  {item.label}
                  {active === item.id && (
                    <span style={{
                      position: "absolute",
                      bottom: "0",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "20px",
                      height: "3px",
                      background: "linear-gradient(90deg, #d63384, #ff6b9d)",
                      borderRadius: "2px"
                    }}></span>
                  )}
                </span>
              </li>
            ))}
          </ul>

          {/* Login Button */}
          <div className="ms-lg-4 mt-3 mt-lg-0 w-100 w-lg-auto">
            <Link
              to="/login"
              className="btn px-4 py-2 w-100 w-lg-auto"
              style={{
                background: "linear-gradient(135deg, #d63384 0%, #ff6b9d 100%)",
                color: "#fff",
                borderRadius: "30px",
                fontWeight: "600",
                boxShadow: "0 4px 15px rgba(214, 51, 132, 0.3)",
                transition: "all 0.3s ease",
                border: "none",
              }}
              onClick={() => setIsOpen(false)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(214, 51, 132, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 15px rgba(214, 51, 132, 0.3)";
              }}
            >
              <i className="fas fa-user-circle me-2"></i>
              Login
            </Link>
          </div>
        </div>
      </div>
      {/* Mobile menu layout enhancements */}
      <style>{`
        /* Apply a soft panel look on mobile when menu is open */
        @media (max-width: 991.98px) {
          .navbar-collapse.show {
            background: linear-gradient(135deg, #fff, #fff9fb);
            border-radius: 16px;
            padding: 12px;
            box-shadow: 0 12px 30px rgba(214, 51, 132, 0.12);
            border: 1px solid rgba(214, 51, 132, 0.12);
          }
          .navbar-collapse.show .nav-item .nav-link {
            width: 100%;
            border-radius: 12px;
            text-align: center;
            display: flex;
            justify-content: center;
          }
          .navbar-collapse.show .navbar-nav {
            align-items: center !important;
          }
          .navbar-collapse.show .nav-item .nav-link.active {
            background: rgba(214, 51, 132, 0.08);
          }
        }
      `}</style>
    </nav>
  );
}

export default Navbar1;