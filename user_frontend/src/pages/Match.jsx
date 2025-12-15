import { useNavigate } from "react-router-dom";

export function Match() {
  const navigate = useNavigate();

  const features = [
    "Age & Compatibility",
    "Education & Profession",
    "Income & Lifestyle",
    "Religion & Community",
    "Location & Preferences",
    "Family Background",
  ];

  const containerStyle = {
    background: "linear-gradient(135deg, #fff6f9 0%, #ffeef6 100%)",
    borderRadius: "30px",
    padding: "50px 0",
    margin: "50px auto",
    maxWidth: "1200px",
    boxShadow: "0 20px 40px rgba(214, 51, 132, 0.1)",
    position: "relative",
    overflow: "hidden",
  };

  const circleStyle = {
    position: "absolute",
    width: "300px",
    height: "300px",
    borderRadius: "50%",
    background:
      "linear-gradient(135deg, rgba(214, 51, 132, 0.1), rgba(255, 107, 157, 0.1))",
    zIndex: 0,
  };

  const goLogin = () => {
    navigate("/login");
  };

  return (
    <div className="container">
      <div style={containerStyle}>
        {/* Background decorative circles */}
        <div style={{ ...circleStyle, top: "-150px", left: "-150px" }}></div>
        <div
          style={{ ...circleStyle, bottom: "-150px", right: "-150px" }}
        ></div>

        <div
          className="row align-items-center"
          style={{ position: "relative", zIndex: 1 }}
        >
          <div className="col-lg-7">
            <div className="px-4 px-lg-5">
              <span
                style={{
                  display: "inline-block",
                  padding: "8px 20px",
                  background:
                    "linear-gradient(135deg, rgba(214, 51, 132, 0.2), rgba(255, 107, 157, 0.2))",
                  color: "#d63384",
                  borderRadius: "30px",
                  fontWeight: "600",
                  fontSize: "0.9rem",
                  marginBottom: "20px",
                }}
              >
                FIND YOUR PERFECT MATCH
              </span>

              <h1
                className="fw-bold mb-4"
                style={{
                  fontSize: "2.5rem",
                  background: "linear-gradient(135deg, #333, #555)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontFamily: "'Playfair Display', serif",
                }}
              >
                Advanced Matchmaking <br /> with{" "}
                <span
                  style={{
                    background: "linear-gradient(135deg, #d63384, #ff6b9d)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Intelligent Filters
                </span>
              </h1>

              <p
                className="mb-4"
                style={{ color: "#666", fontSize: "1.1rem", lineHeight: "1.6" }}
              >
                Our intelligent matching system considers over 50 compatibility
                factors to find your perfect life partner. Start your journey
                with confidence.
              </p>

              <div className="row g-3 mb-4">
                {features.map((feature, index) => (
                  <div className="col-12 col-sm-6" key={index}>
                    <div
                      className="feature-item"
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "10px",
                        padding: "10px 15px",
                        background: "#fff",
                        borderRadius: "10px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                        marginBottom: "5px",
                      }}
                    >
                      <div
                        className="feature-dot"
                        style={{
                          background:
                            "linear-gradient(135deg, #d63384, #ff6b9d)",
                          borderRadius: "50%",
                        }}
                      ></div>
                      <span style={{ color: "#555", fontWeight: "500" }}>
                        {feature}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-lg-5">
            <div className="px-4 px-lg-5">
              <div
                style={{
                  background: "linear-gradient(135deg, #fff, #fff9fb)",
                  borderRadius: "20px",
                  padding: "40px",
                  boxShadow: "0 20px 40px rgba(214, 51, 132, 0.15)",
                  textAlign: "center",
                  border: "1px solid rgba(214, 51, 132, 0.1)",
                }}
              >
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    background: "linear-gradient(135deg, #d63384, #ff6b9d)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 25px",
                  }}
                >
                  <i
                    className="fas fa-heartbeat text-white"
                    style={{ fontSize: "2rem" }}
                  ></i>
                </div>

                <h3 className="fw-bold mb-3" style={{ color: "#333" }}>
                  Ready to Find Your Match?
                </h3>

                <p className="text-muted mb-4" style={{ fontSize: "0.95rem" }}>
                  Join thousands of successful members who found their life
                  partners through us
                </p>

                <button
                  onClick={goLogin}
                  className="btn w-100 btn-responsive"
                  style={{
                    background: "linear-gradient(135deg, #d63384, #ff6b9d)",
                    color: "#fff",
                    borderRadius: "30px",
                    fontWeight: "600",
                    fontSize: "1.1rem",
                    boxShadow: "0 8px 25px rgba(214, 51, 132, 0.3)",
                    border: "none",
                    transition: "all 0.3s ease",
                    position: "relative",
                    overflow: "hidden",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.boxShadow =
                      "0 12px 30px rgba(214, 51, 132, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 25px rgba(214, 51, 132, 0.3)";
                  }}
                >
                  {" "}
                  Find Your Perfect Match
                  {/* <div style={{
                    position: "absolute",
                    top: "0",
                    left: "-100%",
                    width: "100%",
                    height: "100%",
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                    transition: "0.5s"
                  }}></div> */}
                </button>

                <div
                  className="mt-4"
                  style={{ fontSize: "0.9rem", color: "#999" }}
                >
                  <i className="fas fa-lock me-1"></i> 100% Secure &
                  Confidential
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Responsive layout helpers */}
      <style>{`
        /* Responsive feature bullet size */
        .feature-dot {
          width: 8px;
          height: 8px;
          margin-top: 0.3em; /* align with first text line */
        }

        /* Default: no border; will add on mobile */
        .feature-item { border: 0; }

        /* Responsive button sizing */
        .btn-responsive {
          padding: 0.8rem 1.1rem;
        }

        /* Mobile */
        @media (max-width: 575.98px) {
          .feature-dot {
            width: 10px;
            height: 10px;
            margin-top: 0.25em;
          }
          /* Add subtle border to feature cards on mobile */
          .feature-item {
            border: 1px solid rgba(214, 51, 132, 0.18);
          }
          .btn-responsive {
            padding: 0.6rem 0.9rem;
            font-size: 1rem;
            border-radius: 12px;
          }
        }

        /* Small devices */
        @media (min-width: 576px) and (max-width: 767.98px) {
          .feature-dot {
            width: 10px;
            height: 10px;
            margin-top: 0.28em;
          }
          .btn-responsive {
            padding: 0.7rem 1rem;
            font-size: 1.05rem;
          }
        }

        /* Tablets */
        @media (min-width: 768px) and (max-width: 991.98px) {
          .feature-dot {
            width: 8px;
            height: 8px;
            margin-top: 0.3em;
          }
          .btn-responsive {
            padding: 0.8rem 1.1rem;
            font-size: 1.1rem;
          }
        }

        /* Desktops */
        @media (min-width: 992px) {
          .feature-dot {
            width: 10px;
            height: 10px;
            margin-top: 0.32em;
          }
          .btn-responsive {
            padding: 0.4rem 1.2rem;
            font-size: 1.15rem;
          }
        }
      `}</style>
    </div>
  );
}
