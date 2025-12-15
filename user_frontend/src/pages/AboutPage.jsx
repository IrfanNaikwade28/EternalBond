import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export function AboutPage() {
  const stats = [
    { value: "10K+", label: "Successful Matches" },
    { value: "500+", label: "Cities Covered" },
    { value: "98%", label: "Satisfaction Rate" },
    { value: "15+", label: "Years of Experience" }
  ];

  return (
    <div id="about" className="container py-5">
      <div className="text-center mb-5">
        <span style={{
          display: "inline-block",
          padding: "8px 25px",
          background: "linear-gradient(135deg, rgba(214, 51, 132, 0.1), rgba(255, 107, 157, 0.1))",
          color: "#d63384",
          borderRadius: "30px",
          fontWeight: "600",
          marginBottom: "15px"
        }}>
          ABOUT US
        </span>
        <h2 className="fw-bold mb-3" style={{
          fontSize: "2.5rem",
          background: "linear-gradient(135deg, #d63384, #ff6b9d)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontFamily: "'Playfair Display', serif"
        }}>
          Creating Lasting Connections
        </h2>
        <p className="text-muted" style={{ maxWidth: "700px", margin: "0 auto" }}>
          Building bridges between hearts with trust, tradition, and technology
        </p>
      </div>

      <div className="row align-items-center">
        {/* Left Side - Image */}
        <div className="col-lg-6 mb-5 mb-lg-0">
          <div style={{
            position: "relative",
            borderRadius: "20px",
            overflow: "hidden",
            boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
          }}>
            <img
              src="about1.jpg"
              alt="Married Couple"
              className="img-fluid"
              style={{
                height: "550px",
                objectFit: "cover",
                width: "100%"
              }}
            />
            <div style={{
              position: "absolute",
              bottom: "20px",
              left: "20px",
              right: "20px",
              background: "rgba(255,255,255,0.95)",
              padding: "20px",
              borderRadius: "15px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
            }}>
              <h5 className="fw-bold" style={{ color: "#d63384", marginBottom: "10px" }}>
                Trusted by Families Nationwide
              </h5>
              <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
                Over 15 years of creating happy marriages
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Content */}
        <div className="col-lg-6 ps-lg-5">
          <div style={{
            padding: "40px",
            background: "#fff",
            borderRadius: "20px",
            boxShadow: "0 15px 35px rgba(0,0,0,0.05)"
          }}>
            <h3 className="fw-bold mb-4" style={{ color: "#333" }}>
              Welcome to EternalBond Matrimony
            </h3>
            
            <p className="mb-4 text-justify" style={{ lineHeight: "1.8", color: "#555" }}>
              <strong>EternalBond</strong> is India's most trusted platform for singles and families seeking meaningful, 
              lasting relationships. Our mission goes beyond matchmaking — we're dedicated to creating 
              partnerships built on shared values, mutual respect, and lifelong compatibility.
            </p>
            
            <div className="mb-4">
              <div className="d-flex align-items-start mb-3">
                <div style={{
                  width: "40px",
                  height: "40px",
                  background: "linear-gradient(135deg, #d63384, #ff6b9d)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: "15px",
                  flexShrink: 0
                }}>
                  <i className="fas fa-heart text-white"></i>
                </div>
                <div>
                  <h6 className="fw-bold mb-1">Personalized Matchmaking</h6>
                  <p className="text-muted mb-0" style={{ fontSize: "0.95rem" }}>
                    Advanced algorithms combined with human insight for perfect matches
                  </p>
                </div>
              </div>
              
              <div className="d-flex align-items-start mb-3">
                <div style={{
                  width: "40px",
                  height: "40px",
                  background: "linear-gradient(135deg, #d63384, #ff6b9d)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: "15px",
                  flexShrink: 0
                }}>
                  <i className="fas fa-shield-alt text-white"></i>
                </div>
                <div>
                  <h6 className="fw-bold mb-1">Verified Profiles</h6>
                  <p className="text-muted mb-0" style={{ fontSize: "0.95rem" }}>
                    Rigorous verification process ensuring authentic connections
                  </p>
                </div>
              </div>
              
              <div className="d-flex align-items-start">
                <div style={{
                  width: "40px",
                  height: "40px",
                  background: "linear-gradient(135deg, #d63384, #ff6b9d)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: "15px",
                  flexShrink: 0
                }}>
                  <i className="fas fa-users text-white"></i>
                </div>
                <div>
                  <h6 className="fw-bold mb-1">Family Involvement</h6>
                  <p className="text-muted mb-0" style={{ fontSize: "0.95rem" }}>
                    Platform designed for both individuals and family participation
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="row g-3 mt-4">
              {stats.map((stat, index) => (
                <div className="col-6" key={index}>
                  <div style={{
                    textAlign: "center",
                    padding: "15px",
                    background: "linear-gradient(135deg, rgba(214, 51, 132, 0.05), rgba(255, 107, 157, 0.05))",
                    borderRadius: "15px",
                    border: "1px solid rgba(214, 51, 132, 0.1)"
                  }}>
                    <div style={{
                      fontSize: "1.8rem",
                      fontWeight: "700",
                      background: "linear-gradient(135deg, #d63384, #ff6b9d)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      marginBottom: "5px"
                    }}>
                      {stat.value}
                    </div>
                    <div style={{ fontSize: "0.9rem", color: "#666" }}>
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}